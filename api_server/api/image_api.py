import logging
import os

from flask import request, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from marshmallow import EXCLUDE
from database.country_model import CountryModel
from schemas.image_schema import ImageSchema, ImageFormSchema
from utils.image_helper import get_extension, get_img_filename, save_img, sanitize_filename
from utils.strings import (strMESSAGE, strSUCCESS, EP_COUNTRY_IMAGE, IMAGES_FOLDER, COUNTRIES_FOLDER, FLAGS_FOLDER,
                           strINVALID_DATA, strIMAGE, strID, str404)

logging.basicConfig(level=logging.DEBUG,
                    format='[%(asctime)s] [%(levelname)s] [%(filename)s] [%(lineno)s]: %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class ImageAPI(Resource):

    @staticmethod
    @jwt_required()
    def post():
        user = get_jwt_identity()
        image_schema = ImageSchema(unknown=EXCLUDE)
        image_form_schema = ImageFormSchema(unknown=EXCLUDE)
        endpoint = request.path
        logger.info("User: {} Endpoint: {}".format(user, endpoint))

        if endpoint == EP_COUNTRY_IMAGE:
            UPLOAD_FOLDER = os.path.join(IMAGES_FOLDER, COUNTRIES_FOLDER)
        else:
            UPLOAD_FOLDER = os.path.join(IMAGES_FOLDER, FLAGS_FOLDER)

        print(request.files)
        print(request.form)
        error_file = image_schema.validate(request.files)
        error_countryID = image_form_schema.validate(request.form)
        if error_file or error_countryID:
            logger.error("Error parsing request data: {} {}".format(error_file, error_countryID))
            return {strMESSAGE: strINVALID_DATA}, 400

        data = image_schema.load(request.files)
        id = image_form_schema.load(request.form)
        id = id[strID]
        image = data[strIMAGE]
        logger.info("Filetype: {}".format(image.content_type))

        if len(CountryModel.find_by_id(int(id))) == 0:
            logger.error("Country not found {}".format(id))
            return {strMESSAGE: str404}, 400

        file_ext = get_extension(image)
        if not file_ext:
            logger.error("invalid file extension for file {}".format(get_img_filename(image)))
            return {strMESSAGE: strINVALID_DATA}, 400

        try:
            fq_filename = save_img(image, folder=UPLOAD_FOLDER, base_filename=str(id))
            logger.info("File saved {}".format(fq_filename))
            return {strMESSAGE: strSUCCESS}, 201
        except Exception as e:
            logger.error("Error saving image: {}".format(e))
            return {strMESSAGE: strINVALID_DATA}, 400


    @staticmethod
    @jwt_required()
    def get():
        user = get_jwt_identity()
        endpoint = request.path
        if endpoint == EP_COUNTRY_IMAGE:
            folder = os.path.join(IMAGES_FOLDER, COUNTRIES_FOLDER)
        else:
            folder = os.path.join(IMAGES_FOLDER, FLAGS_FOLDER)

        args = request.args
        if strID in args:
            id = args[strID]
        else:
            logger.info("Missing data: {}, Client sent: {}".format(strID, args))
            return {strMESSAGE: strINVALID_DATA}, 400

        if len(CountryModel.find_by_id(int(id))) == 0:
            logger.error("Country not found {}".format(id))
            return {strMESSAGE: str404}, 400

        filename = "{}.png".format(args[strID])
        logger.info("User: {} Endpoint: {}, Filename: {}".format(user, endpoint, filename))
        sanitized_filename = sanitize_filename(filename).lower()
        fq_filename = os.path.join(folder, sanitized_filename)

        try:
            logger.info("Serving file {}".format(fq_filename))
            return send_file(fq_filename)
        except Exception as e:
            logger.error("Error while serving file {}: {}".format(fq_filename, e))
            return {strMESSAGE: str404}, 404


    @staticmethod
    @jwt_required()
    def delete():
        user = get_jwt_identity()
        endpoint = request.path
        if endpoint == EP_COUNTRY_IMAGE:
            folder = os.path.join(IMAGES_FOLDER, COUNTRIES_FOLDER)
        else:
            folder = os.path.join(IMAGES_FOLDER, FLAGS_FOLDER)

        args = request.args
        if strID in args:
            id = args[strID]
        else:
            logger.info("Missing data: {}, Client sent: {}".format(strID, args))
            return {strMESSAGE: strINVALID_DATA}, 400

        if len(CountryModel.find_by_id(int(id))) == 0:
            logger.error("Country not found {}".format(id))
            return {strMESSAGE: str404}, 400

        filename = "{}.png".format(args[strID])
        logger.info("User: {} Endpoint: {}, Filename: {}".format(user, endpoint, filename))
        sanitized_filename = sanitize_filename(filename).lower()
        fq_filename = os.path.join(folder, sanitized_filename)

        try:
            logger.info("Deleting file {}".format(fq_filename))
            os.remove(fq_filename)
            return {strMESSAGE: strSUCCESS}, 200
        except Exception as e:
            logger.error("Error while deleting file {}: {}".format(fq_filename, e))
            return {strMESSAGE: str404}, 404
