import logging

from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from marshmallow import EXCLUDE

from database.country_model import CountryModel
from database.publish_card_db import Publisher
from schemas.country_schema import PublishSchema, CountriesSchema
from utils.global_vars import (MESSAGE, INVALID_DATA, ID, PUBLISH, RESULT, SUCCESS, FAILED, RESOURCE_NOT_FOUND,
                               EP_PUBLISH, PAGE_NUM, ITEMS_PER_PAGE, INTERNAL_SERVER_ERROR, EP_PUBLISHED)

logging.basicConfig(level=logging.DEBUG,
                    format='[%(asctime)s] [%(levelname)s] [%(filename)s] [%(lineno)s]: %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class PublishAPI(Resource):

    @staticmethod
    @jwt_required()
    def post():
        user = get_jwt_identity()
        json_data = request.get_json()
        logger.info("url: {}; from: {}; by: {}; data: {}".format(request.url, request.remote_addr, user, json_data))
        endpoint = request.path
        if endpoint != EP_PUBLISH:
            return {MESSAGE: RESOURCE_NOT_FOUND}, 404
        if not json_data:
            logger.error("No json data provided for {} by {}".format(request.path, user))
            return {MESSAGE: INVALID_DATA}, 400

        schema = PublishSchema(unknown=EXCLUDE)
        error = schema.validate(json_data)
        if error:
            logger.error("Error parsing request body: {}".format(error))
            return {MESSAGE: INVALID_DATA}, 400

        dict_data = schema.load(json_data)
        id = dict_data[ID]
        publish = dict_data[PUBLISH]
        logger.info("country: {} to be published: {} requested by: {}".format(id, publish, user))

        try:
            if publish:
                country_dict = CountryModel.find_by_id(id)
            else:
                country_dict = Publisher.find_by_id(id)

            if not country_dict:
                logger.error("Country: {} to be (un)published does not exist".format(id))
                return {MESSAGE: RESOURCE_NOT_FOUND}, 404

            country = CountryModel.from_dict(country_dict)
            if publish:
                result = Publisher.publish_card(country, user)
            else:
                result = Publisher.unpublish_card(country, user)
            if result:
                logger.info("Country (un)published successful. {}".format(country_dict))
                return {RESULT: SUCCESS}, 200
            return {RESULT: FAILED}, 400
        except Exception as e:
            logger.error(e)
            return {MESSAGE: FAILED}, 400


    @staticmethod
    @jwt_required()
    def get():
        user = get_jwt_identity()
        endpoint = request.path
        args = request.args
        logger.info("url: {}; from: {}; by: {}; args: {}".format(request.url, request.remote_addr, user, args))
        if endpoint != EP_PUBLISHED:
            return {MESSAGE: RESOURCE_NOT_FOUND}, 404
        schema = CountriesSchema()
        error = schema.validate(request.args)
        if error:
            logger.error("Error parsing arguments: {}".format(error))
            return {MESSAGE: INVALID_DATA}, 400
        args = schema.load(args)
        page_num = args[PAGE_NUM]
        items_per_page = args[ITEMS_PER_PAGE]
        try:
            result = Publisher.find(page_num=page_num, items_per_page=items_per_page)
            if len(result) == 0:
                return {MESSAGE: RESOURCE_NOT_FOUND}, 404
            return {RESULT: result}, 200
        except Exception as e:
            logger.error(e)
            return {MESSAGE: INTERNAL_SERVER_ERROR}, 500
