import flask
from flask import request
from flask_restful import Resource
from flask_jwt_extended import (create_access_token,
                                get_jwt_identity,
                                create_refresh_token,
                                get_jwt, jwt_required)
from marshmallow import EXCLUDE

from api.api_util import test_referer_origin
from database.blacklist_db import BlacklistModel
from database.user_model import UserModel
from schemas.user_schema import UserSchema
from utils.global_vars import (INTERNAL_SERVER_ERROR,
                               USERNAME,
                               PASSWORD,
                               ACCESS_TOKEN,
                               REFRESH_TOKEN,
                               MESSAGE,
                               INVALID_DATA,
                               AUTH_ERROR, RESOURCE_NOT_FOUND, EP_LOGIN, EP_LOGOUT, EP_REFRESH, RESULT, EP_USERNAME)
import logging


logging.basicConfig(level=logging.DEBUG,
                    format='[%(asctime)s] [%(levelname)s] [%(filename)s] [%(lineno)s]: %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class AuthAPI(Resource):

    @staticmethod
    def post():
        """
            Endpoint: /login
            Description: Logs in user
            Authentication token required: False
            Admin privilege required: False
            Expected JSON body:
                {
                    "username": <username:str>
                    "plaintext_password": <plaintext plaintext_password:str>
                }
            :returns:
                if successful:
                    {
                        "access_token": <access token:str>
                        "refresh_token": <refresh token:str>
                    }
                if failed:
                    {
                        "message": <failure message along with status code>
                    }
        """
        json_data = request.get_json()
        logger.info(request.environ)
        logger.info("url: {}; from: {}; ".format(request.url, request.remote_addr))
        if not test_referer_origin(request.environ):
            logger.error("Origin, referer test failed")
            return {MESSAGE: AUTH_ERROR}, 401

        if request.path != EP_LOGIN:
            logger.error("No POST method for {}".format(request.path))
            return {MESSAGE: RESOURCE_NOT_FOUND}, 404
        if not json_data:
            logger.error("No json data found")
            return {MESSAGE: INVALID_DATA}, 400

        try:
            schema = UserSchema(unknown=EXCLUDE)
            schema.load(json_data)
        except Exception as e:
            logger.error("Error parsing request body: {}".format(e))
            return {MESSAGE: INVALID_DATA}, 400

        username = json_data[USERNAME]
        password = json_data[PASSWORD]
        logger.info("/login api called for user: {}".format(username))

        try:
            user = UserModel(username, password)
            status = user.authenticate()
        except Exception as e:
            logger.error("Error logging in user {}: {}".format(username, e))
            return {MESSAGE: INTERNAL_SERVER_ERROR}, 500

        if status:
            access_token = create_access_token(identity=username, fresh=True)
            refresh_token = create_refresh_token(identity=username)
            logger.info("Sending access_token and refresh_token for user: {}...".format(username))
            return {ACCESS_TOKEN: access_token, REFRESH_TOKEN: refresh_token}, 200
        logger.info("Authentication failed for user: {}".format(username))
        return {MESSAGE: "Invalid credentials"}, 401


    @jwt_required(refresh=True)
    def get(self):
        self.username = get_jwt_identity()
        logger.info("url: {}; from: {}; by: {}".format(request.url, request.remote_addr, self.username))
        endpoint = request.path
        self.jti = get_jwt()["jti"]

        if endpoint == EP_LOGOUT:
            return self.log_user_out()
        if endpoint == EP_REFRESH:
            return self.get_refresh_token()
        if endpoint == EP_USERNAME:
            return {RESULT: self.username}, 200
        return {MESSAGE: RESOURCE_NOT_FOUND}, 404


    def log_user_out(self):
        try:
            BlacklistModel(self.jti).insert()
        except Exception as e:
            logger.error("Error trying to insert jti to blacklist: {}".format(e))
            return {MESSAGE: INTERNAL_SERVER_ERROR}, 500
        return {MESSAGE: "Successfully logged out"}, 200


    def get_refresh_token(self):
        if BlacklistModel.find(self.jti):
            logger.error("Refresh Token API called for user {}".format(self.username))
            return {MESSAGE: AUTH_ERROR}, 401
        logger.info("Refresh Token API called for user {}".format(self.username))
        new_access_token = create_access_token(identity=self.username, fresh=False)
        return {"access_token": new_access_token}, 200
