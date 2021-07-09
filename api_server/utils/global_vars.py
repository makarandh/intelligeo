import os

strMESSAGE = "message"
strSUCCESS = "success"
strINTERNAL_SERVER_ERROR = "Internal Server Error"
strAUTH_ERROR = "Authorization Error"
strINVALID_DATA = "Request not understood."
str404 = "Resource not found."
strOPERATION_FAILED = "Operation failed"

strUSERNAME = "username"
strPASSWORD = "password"
strADMIN = "admin"
strTIMESTAMP = "timestamp"
strEXPIRE_SECONDS = "expireAfterSeconds"

strACCESS_TOKEN = "access_token"
strREFRESH_TOKEN = "refresh_token"
str_ID = "_id"
strID = "id"
strJTI = "jti"
strDATE_TIME = "date_time"
strRESULT = "result"
strPAGE_NUM = "page_num"
strPAGE_LEN = "items_per_page"
strCREATED_AT = "created_at"
strLAST_MODIFIED_AT = "last_modified_at"
strLAST_MODIFIED_BY = "last_modified_by"

strCOUNTRY = "country"
strCONTINENT = "continent"
strREGION = "region"
strNAME = "name"
strMETA = "meta"
strADDED_BY = "added_by"
strQUESTION = "question"
strANS = "ans"
strQUESTION_ANS = "question_ans"
strCLUES = "clues"
strIMAGE = "image"

EP_TOTAL_COUNTRIES = "/countries/total"
EP_COUNTRIES = "/countries"
EP_COUNTRY = "/country"
EP_COUNTRY_IMAGE = "/country/image"
EP_COUNTRY_FLAG = "/country/flag"

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
