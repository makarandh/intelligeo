import os

MESSAGE = "message"
SUCCESS = "success"
FAILED = "Operation failed"
INTERNAL_SERVER_ERROR = "Internal Server Error"
AUTH_ERROR = "Authorization Error"
INVALID_DATA = "Request not understood."
RESOURCE_NOT_FOUND = "Resource not found."
OPERATION_FAILED = "Operation failed"

USERNAME = "username"
PASSWORD = "password"
ADMIN = "admin"
TIMESTAMP = "timestamp"
EXPIRE_SECONDS = "expireAfterSeconds"

ACCESS_TOKEN = "access_token"
REFRESH_TOKEN = "refresh_token"
_ID = "_id"
ID = "id"
JTI = "jti"
DATE_TIME = "date_time"
RESULT = "result"
PAGE_NUM = "page_num"
ITEMS_PER_PAGE = "items_per_page"
CREATED_AT = "created_at"
LAST_MODIFIED_AT = "last_modified_at"
LAST_MODIFIED_BY = "last_modified_by"
PUBLISH = "publish"
PUBLISHED = "published"
PUBLISHED_AT = "published_at"
PUBLISHED_BY = "published_by"
UNPUBLISHED_AT = "unpublished_at"
UNPUBLISHED_BY = "unpublished_by"

COUNTRY = "country"
CONTINENT = "continent"
REGION = "region"
NAME = "name"
META = "meta"
ADDED_BY = "added_by"
QUESTION = "question"
ANS = "ans"
QUESTION_ANS = "question_ans"
CLUES = "clues"
IMAGE = "image"
PHOTOGRAPHER = "photographer"
URL = "url"
IMAGE_INFO = "image_info"
IMAGE_UPLOADED = "image_uploaded"

EP_TOTAL_COUNTRIES = "/countries/total"
EP_COUNTRIES = "/countries"
EP_COUNTRY = "/country"
EP_COUNTRY_IMAGE = "/country/image"
EP_COUNTRY_FLAG = "/country/flag"
EP_PUBLISH = "/publish"
EP_PUBLISHED = "/published"
EP_TOTAL_PUBLISHED = "/published/total"
EP_PUBLISHED_ID = "/published/<int:id>"
EP_LOGIN = "/login"
EP_REFRESH = "/refresh"
EP_LOGOUT = "/logout"
EP_USERNAME = "/username"

IMAGES_FOLDER = os.path.join("static", "images")
COUNTRIES_FOLDER = "countries"
FLAGS_FOLDER = "flags"

IMAGE_EXT = "webp"
MAX_IMAGE_HEIGHT = 1080

MONGO_PASS = os.environ["MONGODB_PWD"]
MONGO_USER = os.environ["MONGODB_USER"]
MONGO_DB = os.environ["MONGODB_DB"]
FLASK_USER1 = os.environ["FLASK_USERNAME1"]
FLASK_PASS1 = os.environ["FLASK_PASSWORD1"]
FLASK_USER2 = os.environ["FLASK_USERNAME2"]
FLASK_PASS2 = os.environ["FLASK_PASSWORD2"]
