from flask import request
from flask_restful import Resource
from flask_jwt_extended import (create_access_token, get_jwt_identity, create_refresh_token,
                                get_jwt, jwt_required)
from marshmallow import EXCLUDE

from database.blacklist_db import BlacklistModel
from database.user_model import UserModel
from schemas.user_schema import UserSchema
from utils.strings import (strINTERNAL_SERVER_ERROR, strUSERNAME, strPASSWORD,
                           strACCESS_TOKEN, strREFRESH_TOKEN, strMESSAGE, strINVALID_DATA, strAUTH_ERROR)
import logging


logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s] [%(levelname)s] [%(name)s] [%(lineno)s]: %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class Login(Resource):
    """
        API: Login
        Endpoint: /login
        HTTP Methods: POST
    """

    @classmethod
    def post(cls):
        """
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
        if not json_data:
            return {strMESSAGE: strINVALID_DATA}, 400

        try:
            schema = UserSchema(unknown=EXCLUDE)
            schema.load(json_data)
        except Exception as e:
            logger.error("Error parsing request body: {}".format(e))
            return {strMESSAGE: strINVALID_DATA}, 400

        username = json_data[strUSERNAME]
        password = json_data[strPASSWORD]
        logger.info("/login api called for user: {}".format(username))

        try:
            user = UserModel(username, password)
            status = user.authenticate()
        except Exception as e:
            logger.error("Error logging in user {}: {}".format(username, e))
            return {strMESSAGE: strINTERNAL_SERVER_ERROR}, 500

        if status:
            access_token = create_access_token(identity=username, fresh=True)
            refresh_token = create_refresh_token(identity=username)
            logger.info("Sending access_token and refresh_token for user: {}...".format(username))
            return {strACCESS_TOKEN: access_token, strREFRESH_TOKEN: refresh_token}, 200
        logger.info("Authentication failed for user: {}".format(username))
        return {strMESSAGE: "Invalid credentials"}, 401


class TokenRefresh(Resource):
    """
        API: TokenRefresh
        Endpoint: /refresh
        HTTP Methods: GET
    """

    @classmethod
    @jwt_required(refresh=True)
    def get(cls):
        """
            Description: generates new access_token from refresh_token
            Authentication token required: True
            Admin privilege required: False
            Expected JSON body: null
            Required header: "refresh_token"

            :returns:
                {
                    "access_token": <new access token:str>
                }
        """
        current_user = get_jwt_identity()
        jti = get_jwt()["jti"]
        if BlacklistModel.find(jti):
            logger.error("Refresh Token API called for user {}".format(current_user))
            return {strMESSAGE: strAUTH_ERROR}, 401
        logger.info("Refresh Token API called for user {}".format(current_user))
        new_access_token = create_access_token(identity=current_user, fresh=False)
        return {"access_token": new_access_token}, 200


class Logout(Resource):
    """
        API: TokenRefresh
        Endpoint: /logout
        HTTP Methods: GET
    """

    @classmethod
    @jwt_required(refresh=True)
    def get(cls):
        """
            Description: logs out user by adding refresh token to blacklist
                Note: By default refresh token lives for 30 days but jwt token lives for
                15 minutes only. Hence it's safe enough to revoke only the refresh_token
            Authentication token required: True
            Admin privilege required: False
            Expected body: null
            Expected Authorization Header: refresh_token
            :returns:
                {
                    "message": "message of logout status"
                }
        """
        jti = get_jwt()["jti"]
        current_user = get_jwt_identity()
        logger.info("Logout called for user {}".format(current_user))
        try:
            BlacklistModel(jti).insert()
        except Exception as e:
            logger.error("Error trying to insert jti to blacklist: {}".format(e))
            return {strMESSAGE: strINTERNAL_SERVER_ERROR}, 500
        return {strMESSAGE: "Successfully logged out"}, 200
