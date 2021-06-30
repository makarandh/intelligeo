import datetime
import logging
from database.db_connect import get_db
from utils.strings import strUSERNAME, str_ID, strPASSWORD, strADMIN, strDATE_TIME
from auth.security import hash_password, verify_password

logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s] [%(levelname)s] [%(name)s] [%(lineno)s]: %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class UserModel():
    """
        Model for a document in the collection: users
        document:
            {
                "_id": <MongoDBObjectID>
                "username": <username:str>
                "admin": <optional: whether current user is admin:bool>
                "plaintext_password": <plaintext plaintext_password in object; hashed before inserting to db:str>
                "timestamp": <timestamp of when customer was created:ISODate>
            }
    """


    def __init__(self, username, plaintext_password, admin=False) -> None:
        self.username = username
        self.plaintext_password = plaintext_password
        self.admin = admin or False


    def to_dict(self) -> dict:
        return {
            str_ID: self.username,
            strUSERNAME: self.username,
            strADMIN: self.admin,
            strPASSWORD: hash_password(self.plaintext_password),
            strDATE_TIME: self.timestamp
        }


    @classmethod
    def get_collection(cls):
        db = get_db()
        collection = db.user
        return collection


    @classmethod
    def find(cls, username: str):
        """
            Description: Finds a user with specified username
            :param username:
            :returns: dict of user
            :raises exception if db operations fail
        """
        try:
            collection = cls.get_collection()
            result = collection.find_one({strUSERNAME: username})
            return result
        except Exception as e:
            raise Exception(e)


    def insert(self) -> bool:
        """
            Description: Inserts a new user (the current object) to database
            :return: True if successful
            :raises exception if db operations fail
        """
        try:
            collection = self.get_collection()
            user = self.find(self.username)

            if user != None:
                logger.info("User {} already exist. Will not create a new one.".format(self.username))
                return False

            self.timestamp = datetime.datetime.utcnow().replace(tzinfo=datetime.timezone.utc).isoformat()
            collection.insert_one(self.to_dict())
            logger.info("Created user in main db: " + self.username)
            return True

        except Exception as e:
            logger.error("Error creating user {}: {}".format(self.username, e))
            raise Exception(e)


    def authenticate(self) -> bool:
        """
            Description: Checks whether plain-text plaintext_password and saved plaintext_password of current user
            are equivalent
            :returns: True if they are equivalent and False otherwise
        """
        try:
            user = self.find(self.username)
            if not user:
                logger.info("User does not exist: {}".format(self.username))
                return False
            logger.info("User found: {}".format(user[strUSERNAME]))

            if not verify_password(hashed_password=user[strPASSWORD], plaintext_password=self.plaintext_password):
                logger.info("Password verification failed for user: {}".format(self.username))
                return False
            logger.info("Password verification successful for user: {}".format(self.username))
            return True

        except Exception as e:
            logger.error("Exception thrown authenticating: {}".format(e))
            raise Exception(e)
