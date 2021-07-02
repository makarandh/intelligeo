import logging
import os

from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from marshmallow import EXCLUDE

from database.country_model import CountryModel
from schemas.image_schema import ImageSchema, ImageFormSchema
from utils.image_helper import get_extension, get_img_filename, save_img
from utils.strings import (strMESSAGE, strSUCCESS, EP_COUNTRY_IMAGE, IMAGES_FOLDER, COUNTRIES_FOLDER, FLAGS_FOLDER,
                           strINVALID_DATA, strIMAGE, strFILENAME_ERROR, strOPERATION_FAILED, strID)

logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s] [%(levelname)s] [%(filename)s] [%(lineno)s]: %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class Testing(Resource):

    @jwt_required()
    def post(self):
        user = get_jwt_identity()
        image_schema = ImageSchema(unknown=EXCLUDE)
        image_form_schema = ImageFormSchema(unknown=EXCLUDE)
        endpoint = request.path
        logger.info("User: {} Endpoint: {}".format(user, endpoint))

        if endpoint == EP_COUNTRY_IMAGE:
            UPLOAD_FOLDER = os.path.join(IMAGES_FOLDER, COUNTRIES_FOLDER)
        else:
            UPLOAD_FOLDER = os.path.join(IMAGES_FOLDER, FLAGS_FOLDER)

        error_file = image_schema.validate(request.files)
        error_countryID = image_form_schema.validate(request.form)
        if error_file or error_countryID:
            logger.error("Error parsing request data: {} {}".format(error_file, error_countryID))
            return {strMESSAGE: strINVALID_DATA}, 400

        data = image_schema.load(request.files)
        id = image_form_schema.load(request.form)
        id = id[strID]
        image = data[strIMAGE]

        if len(CountryModel.find_by_id(id)) == 0:
            logger.error("Country not found {}".format(id))
            return {strMESSAGE: "Country not found."}, 400

        file_ext = get_extension(image)
        if not file_ext:
            logger.error("invalid file extension for file {}".format(get_img_filename(image)))
            return {strMESSAGE: strFILENAME_ERROR}, 400

        filename = "{}{}".format(id, file_ext)
        try:
            if not save_img(image, folder=UPLOAD_FOLDER, filename=filename):
                logger.error("Saving file failed for {}".format(filename))
                return {strMESSAGE: strOPERATION_FAILED}, 400
            return {strMESSAGE: strSUCCESS}, 201
        except Exception as e:
            logger.error("Error saving image: {}".format(e))
            return {strMESSAGE: strOPERATION_FAILED}, 400


