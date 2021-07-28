import datetime
import logging

from typing import List
from database.db_connect import get_db
from utils.global_vars import DATE_TIME, JTI


logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s] [%(levelname)s] [%(filename)s] [%(lineno)s]: %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class BlacklistModel():
    """
        Blacklist model for the collection: blacklist
        Refresh token str_jti (Token ID) is added to to blacklist database
        The blacklist collection on MongoDB must have index set such that
            its time to live is 30 days so that MongoDB will automatically delete
            the document when its older than 30 days.
        document:
            {
                "_id": <MongoDBObjectID>
                "str_jti": <refresh-token-str_jti:str>
                "admin": <whether current user is admin:bool>
            }
    """


    def __init__(self, jti: str) -> None:
        self.jti = jti


    def to_dict(self) -> dict:
        return {
            JTI: self.jti,
            DATE_TIME: self.timestamp
        }


    @classmethod
    def get_collection(cls):
        """
            :return: DB collection
        """
        db = get_db()
        return db.blacklist


    @classmethod
    def find(cls, jti: str) -> bool:
        """
            Description: Finds a str_jti
            :param jti:
            :returns: dict of str_jti (check documentation of class for more info)
            :raises exception if db operations fail
        """
        try:
            collection = cls.get_collection()
            result = collection.find_one({JTI: jti})
            if result:
                return True
            return False
        except Exception as e:
            raise Exception(e)


    def insert(self):
        """
            Description: Inserts a new str_jti to blacklist if it doesn't exist
            :raises exception if db operations fail
        """
        try:
            collection = self.get_collection()
            if not self.find(self.jti):
                self.timestamp = datetime.datetime.now()
                collection.insert_one(self.to_dict())
                logger.info("Adding jti to blacklist {}".format(self.jti))
                return
            logger.info("jti already blacklisted {}".format(self.jti))
        except Exception as e:
            logger.error("Error adding jti to blacklist {}".format(e))
            raise Exception(e)


    @classmethod
    def find_all(cls) -> List:
        """
            Description: Finds all jtis in blacklist
            :returns: list of dict of all blacklisted jtis
            :raises exception if db operations fail
        """
        try:
            collection = cls.get_collection()
            result = collection.find({})
            if result != None:
                result = list(result)
                result = [jti[JTI] for jti in result]
            else:
                result = []
            return result
        except Exception as e:
            raise Exception(e)
