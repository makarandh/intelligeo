import json
import logging
from pymongo import WriteConcern
from database.db_connect import get_db

from utils.strings import str__ID, strNAME, strCLUES, strQUESTION_ANS, strMETA

logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s] [%(levelname)s] [%(name)s] [%(lineno)s]: %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class CountryModel:
    """
        Country Model for a document in the collection:
        document:
            {
                "_id": <ObjectID:MongoDBObjectID>
                "name": <country name>
                "clues": <list of clues>
                "questions": <list of documents with a question and a answer>
                "meta": <a document with the following info: continent, region>
            }
    """

    search_filter = {str__ID: 0}

    def __init__(self, name, clues, questions, meta):
        self.name = name
        self.clues = clues
        self.questions = questions
        self.meta = meta


    def __repr__(self) -> str:
        return json.dumps(self.to_dict())


    def to_dict(self) -> dict:
        return {
            strNAME: self.name,
            strCLUES: self.clues,
            strQUESTION_ANS: self.questions,
            strMETA: self.meta
        }


    @classmethod
    def get_collection(cls):
        """
            :return: DB collection
        """
        db = get_db()
        return db.country.with_options(write_concern=WriteConcern(w=1, j=True))


    def insert(self) -> str:
        """
            Description: Inserts a new country to db
            :return: MongoDBID of listing:str
            :raises exception if db operations fail
        """
        try:
            collection = self.get_collection()
            result = collection.insert_one(self.to_dict())
            logger.info("Country added to db:{} {}".format(result.inserted_id, self.__repr__()))
        except Exception as e:
            logger.error("Error adding country to db: {}; error: {}".format(self.__repr__(), e))
            raise Exception(e)
        return str(result.inserted_id)


    @classmethod
    def count_total(cls) -> int:
        try:
            collection = cls.get_collection()
            result = collection.find().count()
            logger.info("total no. of countries in database: {}".format(result))
            return result
        except Exception as e:
            logger.error("Exception occurred getting total countries: {}".format(e))
            raise Exception(e)


    @classmethod
    def find(cls, page_num, items_per_page, country=None, region=None, continent=None) -> list:
        try:
            collection = cls.get_collection()
            query_builder = {}
            or_list = []
            # if country:
            #     country_query = {}
            #     country_query[strCOLOR1] = {strREGEX_EXPR: "^" + color1, strOPTIONS_EXPR: "i"}
            #     or_list.append(color1_query)
            # if color2:
            #     color2_query = {}
            #     color2_query[strCOLOR2] = {strREGEX_EXPR: "^" + color2, strOPTIONS_EXPR: "i"}
            #     or_list.append(color2_query)
            # if color3:
            #     color3_query = {}
            #     color3_query[strCOLOR3] = {strREGEX_EXPR: "^" + color3, strOPTIONS_EXPR: "i"}
            #     or_list.append(color3_query)
            # query_builder[strOR_EXPR] = or_list
            result = list(collection
                          .find({}, cls.search_filter)
                          .skip((page_num - 1) * items_per_page)
                          .limit(items_per_page))
            logger.info("find country result: {}".format(result))
            return result
        except Exception as e:
            logger.error("Error retrieving country: {}".format(e))
            raise Exception(e)
