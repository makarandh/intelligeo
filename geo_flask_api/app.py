import logging
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_restful import Api
from flask_jwt_extended import JWTManager
from marshmallow import ValidationError
# from flask_cors import CORS


logging.basicConfig(level=logging.DEBUG,
                    format='[%(asctime)s] [%(levelname)s] [%(filename)s] [%(lineno)s]: %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

app = Flask(__name__)
# cors = CORS(app, resources={r"*": {"origins": "*"}})

if __name__ == "__main__":
    logger.warning("Running directly without WSGI, loading development environment variables")
    load_dotenv("develop.env", verbose=True)
else:
    logger.info("Running with WSGI, loading production environment variables")
    load_dotenv("production.env", verbose=True)


from utils.global_vars import (strMESSAGE, strAUTH_ERROR, EP_TOTAL_COUNTRIES, EP_COUNTRIES, EP_COUNTRY, EP_COUNTRY_IMAGE,
                               EP_COUNTRY_FLAG, str404)
from api.auth_api import AuthAPI, TokenRefresh
from api.country_api import CountriesAPI, CountryAPI
from api.image_api import ImageAPI
from database.blacklist_db import BlacklistModel

# Why two app.config? Refer to: https://flask.palletsprojects.com/en/0.12.x/config/#development-production
app.config.from_object("utils.default_config")
app.config.from_envvar("APPLICATION_SETTINGS")
jwt = JWTManager(app)
api = Api(app)


@app.errorhandler(ValidationError)
def handle_marshmallow_validation(e):
    logger.error("Marshmallow validation error: {}, from client: {}".format(request, request.remote_addr))
    return jsonify(e.messages), 400


@app.errorhandler(404)
def resource_not_found(e):
    logger.error("404 error: {}, from client: {}".format(request, request.remote_addr))
    return {strMESSAGE: str404}, 404


@jwt.invalid_token_loader
@jwt.unauthorized_loader
def handle_token_error(e):
    logger.error("Token error: {}; Request: {} Client: {}".format(e, request, request.remote_addr))
    return {strMESSAGE: strAUTH_ERROR}, 401


@jwt.expired_token_loader
@jwt.revoked_token_loader
def handle_expired_token_error(header, payload):
    logger.error("Token error. header: {}; payload:{}; Request: {} Client: {}"
                 .format(header, payload, request, request.remote_addr))
    return {strMESSAGE: strAUTH_ERROR}, 401


@jwt.token_in_blocklist_loader
def check_if_token_is_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    token_in_blacklist = BlacklistModel.find(jti)
    if token_in_blacklist:
        logger.error("Blacklisted refresh_token used. jwt_header: {}, jwt_payload: {}".format(jwt_header, jwt_payload))
    return token_in_blacklist


@app.before_first_request
def first_run_init():
    logger.info("First run initialization...")
    from utils.db_init import initialize_db
    initialize_db()


api.add_resource(AuthAPI, "/login", "/logout")
api.add_resource(TokenRefresh, "/refresh")
api.add_resource(CountriesAPI, EP_COUNTRIES, EP_TOTAL_COUNTRIES)
api.add_resource(CountryAPI, EP_COUNTRY)
api.add_resource(ImageAPI, EP_COUNTRY_IMAGE, EP_COUNTRY_FLAG)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000)
