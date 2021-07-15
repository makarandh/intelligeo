import logging
import os

from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from flask import request
from marshmallow import EXCLUDE
from database.country_model import CountryModel, ImageInfo
from schemas.country_schema import CountrySchema, CountryRequestSchema
from utils.image_helper import get_fq_filename
from utils.global_vars import (MESSAGE, INVALID_DATA, PAGE_NUM, PAGE_LEN, RESULT,
                               INTERNAL_SERVER_ERROR, EP_TOTAL_COUNTRIES, SUCCESS, RESOURCE_NOT_FOUND, ID,
                               IMAGES_FOLDER, COUNTRIES_FOLDER, ADDED_BY, LAST_MODIFIED_BY, IMAGE_INFO)

logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s] [%(levelname)s] [%(filename)s] [%(lineno)s]: %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class CountryAPI(Resource):

    @staticmethod
    @jwt_required()
    def post():
        user = get_jwt_identity()
        json_data = request.get_json()
        logger.info(json_data)
        if not json_data:
            return {MESSAGE: INVALID_DATA}, 400

        schema = CountrySchema(unknown=EXCLUDE)
        error = schema.validate(json_data)
        if error:
            logger.error("Error parsing request body: {}".format(error))
            return {MESSAGE: INVALID_DATA}, 400

        country_dict = schema.load(json_data)
        country_dict[ADDED_BY] = user
        country_dict[LAST_MODIFIED_BY] = user
        if IMAGE_INFO not in country_dict:
            country_dict[IMAGE_INFO] = ImageInfo().to_dict()
        country_obj = CountryModel.from_dict(country_dict)
        logger.info("user {} is attempting to add country {}".format(user, country_obj))

        try:
            result = CountryModel.insert(country_obj)
            if not result:
                logger.error("Country already exists")
                return {MESSAGE: "Country already exists"}, 409
            logger.info("Country added successful.")
            return {RESULT: result}, 201
        except Exception as e:
            logger.error(e)
            return {MESSAGE: INTERNAL_SERVER_ERROR}, 500


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
                return {MESSAGE: INVALID_DATA}, 400
            args = schema.load(request.args)
            id = args[ID]
            logger.info("Requested for country with id {}".format(id))
            result = CountryModel.find_by_id(id)
            if len(result) == 0:
                return {MESSAGE: RESOURCE_NOT_FOUND}, 404
            return {RESULT: result}, 200
        except Exception as e:
            logger.error(e)
            return {MESSAGE: INTERNAL_SERVER_ERROR}, 500


    @staticmethod
    @jwt_required()
    def put():
        user = get_jwt_identity()
        json_data = request.get_json()
        if not json_data:
            return {MESSAGE: INVALID_DATA}, 400

        schema = CountrySchema(unknown=EXCLUDE)
        error = schema.validate(json_data)
        if error:
            logger.error("Error parsing request body: {}".format(error))
            return {MESSAGE: INVALID_DATA}, 400

        country_dict = schema.load(json_data)
        if ID not in country_dict:
            logger.error("id not found in request body: {}".format(country_dict))
            return {MESSAGE: INVALID_DATA}, 400

        country_dict[ADDED_BY] = None
        country_dict[LAST_MODIFIED_BY] = user
        if IMAGE_INFO not in country_dict:
            country_dict[IMAGE_INFO] = ImageInfo().to_dict()
        country_obj = CountryModel.from_dict(country_dict)
        if IMAGE_INFO not in country_dict:
            country_dict[IMAGE_INFO] = ImageInfo().to_dict()
        logger.info("client {} is attempting to update country {}".format(user, country_obj))

        try:
            result = CountryModel.update_one(country_obj)
            if not result:
                logger.error("Country not found")
                return {MESSAGE: RESOURCE_NOT_FOUND}, 409
            logger.info("Country update successful.")
            return {RESULT: SUCCESS}, 200
        except Exception as e:
            logger.error(e)
            return {MESSAGE: INTERNAL_SERVER_ERROR}, 500


    @staticmethod
    @jwt_required()
    def delete():
        try:
            schema = CountryRequestSchema(unknown=EXCLUDE)
            error = schema.validate(request.args)
            if error:
                logger.error("Error parsing request body: {}".format(error))
                return {MESSAGE: INVALID_DATA}, 400
            args = schema.load(request.args)
            id = args[ID]
            logger.info("Requested for country deletion with id {}".format(id))
            result = CountryModel.delete(id)
            if not result:
                return {MESSAGE: RESOURCE_NOT_FOUND}, 404
        except Exception as e:
            logger.error(e)
            return {MESSAGE: INTERNAL_SERVER_ERROR}, 500

        folder = os.path.join(IMAGES_FOLDER, COUNTRIES_FOLDER)
        fq_filename = get_fq_filename(id, folder)

        try:
            if os.path.isfile(fq_filename):
                logger.info("Deleting file {}".format(fq_filename))
                os.remove(fq_filename)
        except Exception as e:
            logger.error("Error while deleting file {}: {}".format(fq_filename, e))
            return {RESULT: INTERNAL_SERVER_ERROR}, 500
        return {RESULT: SUCCESS}, 200


class CountriesAPI(Resource):

    @staticmethod
    @jwt_required()
    def get():
        endpoint = request.path
        logger.info("Endpoint: {}".format(endpoint))
        if endpoint == EP_TOTAL_COUNTRIES:
            total_countries = CountryModel.count_total()
            logger.info("Sending result total_countries: {}".format(total_countries))
            return {RESULT: total_countries}, 200
        args = request.args
        try:
            if PAGE_NUM in args:
                page_num = int(args[PAGE_NUM])
            else:
                logger.info("Missing data: {}, Client sent: {}".format(PAGE_NUM, args))
                return {MESSAGE: INVALID_DATA}, 400
            if PAGE_LEN in args:
                items_per_page = int(args[PAGE_LEN])
            else:
                logger.info("Missing data: {}, Client sent: {}".format(PAGE_LEN, args))
                return {MESSAGE: INVALID_DATA}, 400

            logger.info("page_num: {}, items_per_page: {}".format(page_num, items_per_page))
            if page_num < 1 or items_per_page < 1:
                logger.info("Invalid data: page_num: {}, items_per_page: {}".format(page_num, items_per_page))
                return {MESSAGE: INVALID_DATA}, 400
        except Exception as e:
            logger.error("Error parsing arguments: {}. Client sent: {}".format(e, args))
            return {MESSAGE: INVALID_DATA}, 400

        try:
            result = CountryModel.find(page_num=page_num, items_per_page=items_per_page)
            if len(result) == 0:
                return {MESSAGE: RESOURCE_NOT_FOUND}, 404
            return {RESULT: result}, 200
        except Exception as e:
            logger.error(e)
            return {MESSAGE: INTERNAL_SERVER_ERROR}, 500
