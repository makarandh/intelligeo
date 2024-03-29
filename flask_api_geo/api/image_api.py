import logging
import os

from flask import request, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from marshmallow import EXCLUDE

from database.country_model import CountryModel
from database.publish_card_db import Publisher
from schemas.country_schema import CountryRequestSchema
from schemas.image_schema import ImageSchema, ImageFormSchema
from utils.image_helper import (get_extension,
                                get_img_filename,
                                save_img,
                                get_fq_filename)
from utils.global_vars import (MESSAGE, SUCCESS,
                               EP_COUNTRY_IMAGE,
                               IMAGES_FOLDER,
                               COUNTRIES_FOLDER,
                               FLAGS_FOLDER,
                               INVALID_DATA,
                               IMAGE, ID, RESOURCE_NOT_FOUND)

logging.basicConfig(level=logging.DEBUG,
                    format='[%(asctime)s] [%(levelname)s] [%(filename)s] [%(lineno)s]: %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class ImageAPI(Resource):

    @staticmethod
    @jwt_required()
    def post():
        user = get_jwt_identity()
        file_data = request.files
        form_data = request.form
        logger.info("url: {}; from: {}; by: {}; data: {}, {}".format(request.url, request.remote_addr, user,
                                                                     form_data, file_data))
        image_schema = ImageSchema(unknown=EXCLUDE)
        image_form_schema = ImageFormSchema(unknown=EXCLUDE)
        endpoint = request.path
        logger.info("User: {} Endpoint: {}".format(user, endpoint))

        if endpoint == EP_COUNTRY_IMAGE:
            UPLOAD_FOLDER = os.path.join(IMAGES_FOLDER, COUNTRIES_FOLDER)
        else:
            UPLOAD_FOLDER = os.path.join(IMAGES_FOLDER, FLAGS_FOLDER)

        error_file = image_schema.validate(file_data)
        error_countryID = image_form_schema.validate(form_data)
        if error_file or error_countryID:
            logger.error("Error parsing request data: {} {}".format(error_file, error_countryID))
            return {MESSAGE: INVALID_DATA}, 400

        data = image_schema.load(file_data)
        id = image_form_schema.load(form_data)
        id = id[ID]
        image = data[IMAGE]
        logger.info("Filetype: {}".format(image.content_type))

        if len(CountryModel.find_by_id(int(id))) == 0:
            logger.error("Country not found {}".format(id))
            return {MESSAGE: RESOURCE_NOT_FOUND}, 400

        file_ext = get_extension(image)
        if not file_ext:
            logger.error("invalid file extension for file {}".format(get_img_filename(image)))
            return {MESSAGE: INVALID_DATA}, 400

        try:
            fq_filename = save_img(image, folder=UPLOAD_FOLDER, base_filename=str(id))
            logger.info("File saved {}".format(fq_filename))
            CountryModel.set_photo_uploaded(id, True)
            logger.info("Set image_uploaded as true for {}".format(id))
            return {MESSAGE: SUCCESS}, 201
        except Exception as e:
            logger.error("Error saving image: {}".format(e))
            return {MESSAGE: INVALID_DATA}, 400


    @staticmethod
    @jwt_required()
    def get():
        user = get_jwt_identity()
        logger.info("url: {}; from: {}; by: {};".format(request.url, request.remote_addr, user))
        endpoint = request.path
        if endpoint == EP_COUNTRY_IMAGE:
            folder = os.path.join(IMAGES_FOLDER, COUNTRIES_FOLDER)
        else:
            folder = os.path.join(IMAGES_FOLDER, FLAGS_FOLDER)

        logger.info("User: {} Endpoint: {}".format(user, endpoint))
        schema = CountryRequestSchema(unknown=EXCLUDE)
        error = schema.validate(request.args)
        if error:
            logger.error("Error parsing request body: {}".format(error))
            return {MESSAGE: INVALID_DATA}, 400
        args = schema.load(request.args)
        id = args[ID]

        if len(CountryModel.find_by_id(int(id))) == 0 and len(Publisher.find_by_id((int(id)))) == 0:
            logger.error("Country not found {}".format(id))
            return {MESSAGE: RESOURCE_NOT_FOUND}, 404

        fq_filename = get_fq_filename(id, folder)
        if not fq_filename:
            logger.error("File not found for country id {}".format(id))
            return {MESSAGE: RESOURCE_NOT_FOUND}, 404

        try:
            logger.info("Serving file {}".format(fq_filename))
            return send_file(fq_filename)
        except Exception as e:
            logger.error("Error while serving file {}: {}".format(fq_filename, e))
            return {MESSAGE: RESOURCE_NOT_FOUND}, 404


    @staticmethod
    @jwt_required()
    def delete():
        user = get_jwt_identity()
        logger.info("url: {}; from: {}; by: {}; ".format(request.url, request.remote_addr, user))
        endpoint = request.path
        if endpoint == EP_COUNTRY_IMAGE:
            folder = os.path.join(IMAGES_FOLDER, COUNTRIES_FOLDER)
        else:
            folder = os.path.join(IMAGES_FOLDER, FLAGS_FOLDER)

        logger.info("User: {} Endpoint: {}".format(user, endpoint))
        schema = CountryRequestSchema(unknown=EXCLUDE)
        error = schema.validate(request.args)
        if error:
            logger.error("Error parsing request body: {}".format(error))
            return {MESSAGE: INVALID_DATA}, 400
        args = schema.load(request.args)
        id = args[ID]

        if len(CountryModel.find_by_id(int(id))) == 0:
            logger.error("Country not found {}".format(id))
            return {MESSAGE: RESOURCE_NOT_FOUND}, 400

        fq_filename = get_fq_filename(id, folder)
        if not fq_filename:
            logger.error("File not found for country id {}".format(id))
            return {MESSAGE: RESOURCE_NOT_FOUND}, 404

        try:
            logger.info("Deleting file {}".format(fq_filename))
            os.remove(fq_filename)
            CountryModel.set_photo_uploaded(id, False)
            return {MESSAGE: SUCCESS}, 200
        except Exception as e:
            logger.error("Error while deleting file {}: {}".format(fq_filename, e))
            return {MESSAGE: RESOURCE_NOT_FOUND}, 404
