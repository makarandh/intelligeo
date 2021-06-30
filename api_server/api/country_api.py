import logging

from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from flask import request
from marshmallow import EXCLUDE
from database.country_model import CountryModel
from schemas.country_schema import CountrySchema, CountryRequestSchema
from utils.strings import (strMESSAGE, strINVALID_DATA, strPAGE_NUM, strPAGE_LEN, strRESULT,
                           strINTERNAL_SERVER_ERROR, EP_TOTAL_COUNTRIES, strSUCCESS, str404, strID)

logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s] [%(levelname)s] [%(name)s] [%(lineno)s]: %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class Country(Resource):

    @staticmethod
    @jwt_required()
    def post():
        json_data = request.get_json()
        logger.info(json_data)
        if not json_data:
            return {strMESSAGE: strINVALID_DATA}, 400

        schema = CountrySchema(unknown=EXCLUDE)
        error = schema.validate(json_data)
        if error:
            logger.error("Error parsing request body: {}".format(error))
            return {strMESSAGE: strINVALID_DATA}, 400

        country_dict = schema.load(json_data)
        country_obj = CountryModel.from_dict(country_dict)
        client_id = get_jwt_identity()
        logger.info("client {} is attempting to add country {}".format(client_id, country_obj))

        try:
            result = CountryModel.insert(country_obj)
            if not result:
                logger.error("Country already exists")
                return {strMESSAGE: "Country already exists."}, 409
            logger.info("Country add successful.")
            return {strRESULT: strSUCCESS}, 201
        except Exception as e:
            logger.error(e)
            return {strMESSAGE: strINTERNAL_SERVER_ERROR}, 500


    @staticmethod
    def get():
        """
            Description: returns total number of listings available
        """

        try:
            schema = CountryRequestSchema(unknown=EXCLUDE)
            error = schema.validate(request.args)
            if error:
                logger.error("Error parsing request body: {}".format(error))
                return {strMESSAGE: strINVALID_DATA}, 400
            args = schema.load(request.args)
            id = args[strID]
            logger.info("Requested for country with id {}".format(id))
            result = CountryModel.find_by_id(id)
            if len(result) == 0:
                return {strMESSAGE: str404}, 404
            return {strRESULT: result}, 200
        except Exception as e:
            logger.error(e)
            return {strMESSAGE: strINTERNAL_SERVER_ERROR}, 500


    @staticmethod
    @jwt_required()
    def put():
        json_data = request.get_json()
        if not json_data:
            return {strMESSAGE: strINVALID_DATA}, 400

        schema = CountrySchema(unknown=EXCLUDE)
        error = schema.validate(json_data)
        if error:
            logger.error("Error parsing request body: {}".format(error))
            return {strMESSAGE: strINVALID_DATA}, 400

        country_dict = schema.load(json_data)
        if strID not in country_dict:
            logger.error("id not found in request body: {}".format(country_dict))
            return {strMESSAGE: strINVALID_DATA}, 400
        logger.info("Country id {}".format(country_dict[strID]))

        country_obj = CountryModel.from_dict(country_dict)
        client_id = get_jwt_identity()
        logger.info("client {} is attempting to update country {}".format(client_id, country_obj))

        try:
            result = CountryModel.update_one(country_obj)
            if not result:
                logger.error("Country not found")
                return {strMESSAGE: "Country not found."}, 409
            logger.info("Country update successful.")
            return {strRESULT: strSUCCESS}, 200
        except Exception as e:
            logger.error(e)
            return {strMESSAGE: strINTERNAL_SERVER_ERROR}, 500


    @staticmethod
    @jwt_required()
    def delete():
        try:
            schema = CountryRequestSchema(unknown=EXCLUDE)
            error = schema.validate(request.args)
            if error:
                logger.error("Error parsing request body: {}".format(error))
                return {strMESSAGE: strINVALID_DATA}, 400
            args = schema.load(request.args)
            id = args[strID]
            logger.info("Requested for country deletion with id {}".format(id))
            result = CountryModel.delete(id)
            if result:
                return {strRESULT: strSUCCESS}, 200
            return {strMESSAGE: str404}, 404
        except Exception as e:
            logger.error(e)
            return {strMESSAGE: strINTERNAL_SERVER_ERROR}, 500


class Countries(Resource):

    @staticmethod
    @jwt_required()
    def get():
        endpoint = request.path
        logger.info("Endpoint: {}".format(endpoint))
        if endpoint == EP_TOTAL_COUNTRIES:
            total_countries = CountryModel.count_total()
            logger.info("Sending result total_countries: {}".format(total_countries))
            return {strRESULT: total_countries}, 200
        args = request.args
        try:
            if strPAGE_NUM in args:
                page_num = int(args[strPAGE_NUM])
            else:
                logger.info("Missing data: {}, Client sent: {}".format(strPAGE_NUM, args))
                return {strMESSAGE: strINVALID_DATA}, 400
            if strPAGE_LEN in args:
                items_per_page = int(args[strPAGE_LEN])
            else:
                logger.info("Missing data: {}, Client sent: {}".format(strPAGE_LEN, args))
                return {strMESSAGE: strINVALID_DATA}, 400

            logger.info("page_num: {}, items_per_page: {}".format(page_num, items_per_page))
            if page_num < 1 or items_per_page < 1:
                logger.info("Invalid data: page_num: {}, items_per_page: {}".format(page_num, items_per_page))
                return {strMESSAGE: strINVALID_DATA}, 400
        except Exception as e:
            logger.error("Error parsing arguments: {}. Client sent: {}".format(e, args))
            return {strMESSAGE: strINVALID_DATA}, 400

        try:
            result = CountryModel.find(page_num=page_num, items_per_page=items_per_page)
            if len(result) == 0:
                return {strMESSAGE: "Country not found"}, 404
            return {strRESULT: result}, 200
        except Exception as e:
            logger.error(e)
            return {strMESSAGE: strINTERNAL_SERVER_ERROR}, 500
