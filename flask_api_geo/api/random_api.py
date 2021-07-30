import logging
import random
from flask import request
from flask_restful import Resource
from marshmallow import EXCLUDE
from database.publish_card_db import Publisher
from schemas.game_schema import RandomCountriesRequestSchema
from utils.global_vars import MESSAGE, INVALID_DATA, RESULT, COUNT, COUNTRIES, INTERNAL_SERVER_ERROR, ID, NAME

logging.basicConfig(level=logging.DEBUG,
                    format='[%(asctime)s] [%(levelname)s] [%(filename)s] [%(lineno)s]: %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class RandomAPI(Resource):

    @staticmethod
    def post():
        json_data = request.get_json()
        logger.info("url: {}; from: {}; data: {}".format(request.url, request.remote_addr, json_data))
        schema = RandomCountriesRequestSchema(unknown=EXCLUDE)
        error = schema.validate(json_data)
        if error:
            logger.error("Error parsing request body: {}".format(error))
            return {MESSAGE: INVALID_DATA}, 400

        try:
            rand_request_dict = schema.load(json_data)
            count = rand_request_dict[COUNT]
            exclude = None
            exclude_country = None
            if "exclude" in rand_request_dict:
                exclude = rand_request_dict["exclude"]
                exclude_country = Publisher.find_by_id(exclude)

            countries = Publisher.find()
            if exclude and exclude_country:
                countries.remove(exclude_country)
            if count > len(countries):
                logger.error("Requested number of countries: {}; total countries in db: {}".format(count,
                                                                                                   len(countries)))
                count = len(countries)

            random_countries = random.sample(countries, count)
            result = []
            for country in random_countries:
                result.append({
                    ID: country[ID],
                    NAME: country[NAME]
                })

            logger.info("Sending response of random countries: {}".format(result))
            return {
                       COUNT: count,
                       RESULT: result
                   }, 200
        except Exception as e:
            logger.error("Error sending random countries: {}".format(e))
            return {MESSAGE: INTERNAL_SERVER_ERROR}, 500
