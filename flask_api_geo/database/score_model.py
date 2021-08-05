import datetime
import logging
from database.db_connect import get_db
from utils.global_vars import USERNAME, SCORE, TIMESTAMP

logging.basicConfig(level=logging.DEBUG,
                    format='[%(asctime)s] [%(levelname)s] [%(filename)s] [%(lineno)s]: %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class ScoreModel():

    def __init__(self, username, score) -> None:
        self.username = username
        self.score = score


    def to_dict(self) -> dict:
        return {
            USERNAME: self.username,
            SCORE: self.score,
            TIMESTAMP: self.timestamp
        }


    @classmethod
    def get_collection(cls):
        db = get_db()
        collection = db.score
        return collection


    @classmethod
    def find_highest(cls, count) -> dict:
        try:
            collection = cls.get_collection()
            result = dict(collection.find_one().sort(SCORE, -1).limit(count))
            return result
        except Exception as e:
            raise Exception(e)


    def insert(self) -> bool:
        try:
            collection = self.get_collection()
            self.timestamp = datetime.datetime.utcnow().replace(tzinfo=datetime.timezone.utc).isoformat()
            collection.insert_one(self.to_dict())
            logger.info("Added score: {} for {}".format(self.score, self.username))
            return True
        except Exception as e:
            logger.error("Error creating user {}: {}".format(self.username, e))
            raise Exception(e)
