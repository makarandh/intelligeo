import logging

from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from marshmallow import EXCLUDE

from database.publish_card_db import Publisher
from schemas.country_schema import PublishSchema, CountriesSchema
from utils.global_vars import (MESSAGE, INVALID_DATA, ID, PUBLISH, RESULT, SUCCESS, FAILED, RESOURCE_NOT_FOUND,
                               EP_PUBLISH, PAGE_NUM, ITEMS_PER_PAGE, INTERNAL_SERVER_ERROR, EP_PUBLISHED,
                               EP_TOTAL_PUBLISHED, PUBLISHED)

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
                result = Publisher.publish_card(id, user)
            else:
                result = Publisher.unpublish_card(id, user)

            if result:
                logger.info("Country (un)published successful. {}".format(id))
                return {RESULT: SUCCESS}, 200
            return {RESULT: FAILED}, 400
        except Exception as e:
            logger.error(e)
            return {MESSAGE: FAILED}, 400


    @jwt_required()
    def get(self, id: int = None):
        user = get_jwt_identity()
        endpoint = request.path
        self.args = request.args
        logger.info("url: {}; from: {}; by: {}; args: {}".format(request.url, request.remote_addr, user, self.args))
        endpoint_arr = endpoint.split("/")
        if endpoint == EP_PUBLISHED:
            return self.get_published_cards()
        if endpoint == EP_TOTAL_PUBLISHED:
            return self.get_total_published()
        if endpoint_arr[1] == PUBLISHED and isinstance(id, int):
            return self.get_published_card(id)

        return {MESSAGE: RESOURCE_NOT_FOUND}, 404


    def get_published_card(self, id):
        result = Publisher.find_by_id(id)
        if len(result) == 0:
            return {MESSAGE: RESOURCE_NOT_FOUND}, 404
        return {RESULT: result}, 200


    def get_total_published(self):
        total_published = Publisher.count_total()
        logger.info("Sending result total published countries: {}".format(total_published))
        return {RESULT: total_published}, 200


    def get_published_cards(self):
        schema = CountriesSchema()
        error = schema.validate(self.args)
        if error:
            logger.error("Error parsing arguments: {}".format(error))
            return {MESSAGE: INVALID_DATA}, 400
        args = schema.load(self.args)
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
