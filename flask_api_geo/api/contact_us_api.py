import logging

from flask import request
from flask_restful import Resource
from marshmallow import EXCLUDE

from app import limiter
from schemas.email_schema import EmailSchema
from utils.email import send_contact_us_email
from utils.global_vars import MESSAGE, INVALID_DATA, SUCCESS, INTERNAL_SERVER_ERROR

logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s] [%(levelname)s] [%(name)s: %(lineno)d]: %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class ContactUsAPI(Resource):

    @staticmethod
    @limiter.limit("2/minute", override_defaults=False)
    def post():
        json_data = request.get_json()
        logger.info("url: {}; from: {}; data: {}".format(request.url, request.remote_addr, json_data))
        if not json_data:
            logger.error("Json data not found")
            return {MESSAGE: INVALID_DATA}, 400

        schema = EmailSchema(unknown=EXCLUDE)
        error = schema.validate(json_data)
        if error:
            logger.error("Error parsing request body: {}".format(error))
            return {MESSAGE: INVALID_DATA}, 400

        email_dict = schema.load(json_data)
        email_message = """<div>
                            <p><strong>Name</strong>: {}</p> 
                            <p><strong>Email</strong>: {}</p>
                            <p><strong>Message</strong>: {}</p>
                        </div>""".format(email_dict["name"],
                                         email_dict["email"],
                                         email_dict["message"])

        return_value = send_contact_us_email(email_message)
        if return_value:
            return {MESSAGE: SUCCESS}, 200
        else:
            return {MESSAGE: INTERNAL_SERVER_ERROR}, 500