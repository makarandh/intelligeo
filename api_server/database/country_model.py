import datetime
import json
import logging
import re
import random

from pymongo import WriteConcern
from database.db_connect import get_db

from utils.global_vars import (str_ID, strNAME, strCLUES,
                               strQUESTION_ANS, strMETA,
                               strQUESTION, strANS, strCONTINENT,
                               strREGION, strID, strADDED_BY, strLAST_MODIFIED_BY,
                               strCREATED_AT, strLAST_MODIFIED_AT)

logging.basicConfig(level=logging.DEBUG,
                    format='[%(asctime)s] [%(levelname)s] [%(filename)s] [%(lineno)s]: %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

MAX_LIMIT = 100000000


class QuestionAns:

    def __init__(self, question: str, ans: bool):
        self.question = question
        self.ans = ans

    def __repr__(self):
        return json.dumps(self.to_dict())

    def to_dict(self) -> dict:
        return {
            strQUESTION: self.question,
            strANS: self.ans
        }


class Meta:

    def __init__(self, continent: str, region: str):
        self.continent = continent
        self.region = region

    def to_dict(self) -> dict:
        return {
            strCONTINENT: self.continent,
            strREGION: self.region
        }

    def __repr__(self):
        return json.dumps(self.to_dict())


class CountryModel:
    """
        Country Model for a document in the collection:
        document:
            {
                "_id": <ObjectID:MongoDBObjectID>
                "basename": <country basename>
                "clues": <list of clues>
                "questions": <list of documents with a question and a answer>
                "meta": <a document with the following info: continent, region>
            }
    """

    search_filter = {str_ID: 0}

    def __init__(self, name: str, clues: list, questions: list,
                 meta: dict, added_by: str, last_modified_by,
                 id: int = None, created_at=None, last_modified_at=None):
        self.name = name
        self.clues = clues
        self.questions = questions
        self.meta = meta
        self.added_by = added_by
        self.created_at = created_at
        self.last_modified_by = last_modified_by
        self.last_modified_at = last_modified_at
        self.id = id
        if self.id == None:
            self.id = random.randint(1, MAX_LIMIT)
            while self.find_by_id(self.id):
                logger.error("Country with id {} already exist. Creating another random...".format(self.id))
                self.id = random.randint(1, MAX_LIMIT)


    def __repr__(self) -> str:
        return json.dumps(self.to_dict())


    def to_dict(self) -> dict:
        return {
            strNAME: self.name,
            strCLUES: self.clues,
            strQUESTION_ANS: self.questions,
            strMETA: self.meta,
            strADDED_BY: self.added_by,
            strCREATED_AT: self.created_at,
            strLAST_MODIFIED_BY: self.last_modified_by,
            strLAST_MODIFIED_AT: self.last_modified_at,
            strID: self.id
        }


    @classmethod
    def from_dict(cls, source_dict):
        if strID in source_dict:
            return cls(source_dict[strNAME], source_dict[strCLUES], source_dict[strQUESTION_ANS],
                       source_dict[strMETA], source_dict[strADDED_BY], source_dict[strLAST_MODIFIED_BY],
                       source_dict[strID])
        return cls(source_dict[strNAME], source_dict[strCLUES], source_dict[strQUESTION_ANS],
                   source_dict[strMETA], source_dict[strADDED_BY], source_dict[strLAST_MODIFIED_BY])


    @classmethod
    def get_collection(cls):
        """
            :return: DB collection
        """
        db = get_db()
        return db.country.with_options(write_concern=WriteConcern(w=1, j=True))


    def insert(self) -> str or bool:
        """
            Description: Inserts a new country to db
            :return: MongoDBID of listing:str
            :raises exception if db operations fail
        """
        try:
            collection = self.get_collection()
            self.created_at = (datetime.datetime.utcnow()
                               .replace(tzinfo=datetime.timezone.utc)
                               .isoformat())
            self.last_modified_by = self.added_by
            self.last_modified_at = self.created_at
            result = collection.find_one({
                strNAME: re.compile(re.escape(self.name), re.IGNORECASE)
            }, self.search_filter)
            if result:
                logger.info("Country {} already exists in database: {}".format(self.name, result))
                return False
            else:
                result = collection.insert_one(self.to_dict())
                logger.info("Country added to db:{} {}".format(result.inserted_id, self.__repr__()))
                return str(self.id)
        except Exception as e:
            logger.error("Error adding country to db: {}".format(e))
            raise Exception(e)


    def update_one(self) -> str or bool:
        """
            Description: Inserts a new country to db
            :return: MongoDBID of listing:str
            :raises exception if db operations fail
        """
        try:
            collection = self.get_collection()
            search_param = {strID: self.id}
            result = collection.find_one(search_param, self.search_filter)
            if not result:
                logger.info("Country with id {} does not exist in database: {}".format(self.id, result))
                return False
            else:
                self.created_at = result[strCREATED_AT]
                self.added_by = result[strADDED_BY]
                self.last_modified_at = (datetime.datetime.utcnow()
                                         .replace(tzinfo=datetime.timezone.utc)
                                         .isoformat())
                result = collection.replace_one(search_param, self.to_dict())
                logger.info("Country update result matched_count:{}, modified_count: {}".format(result.matched_count,
                                                                                                result.modified_count))
                return str(result.modified_count)
        except Exception as e:
            logger.error("Error adding country to db: {}".format(e))
            raise Exception(e)


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
    def find_by_id(cls, id) -> dict:
        try:
            collection = cls.get_collection()
            result = collection.find_one({"id": id}, cls.search_filter)
            if result:
                logger.info("Country with id {} found {}".format(id, result))
                return result
            else:
                logger.info("Country with id {} does not exist".format(id))
                return {}
        except Exception as e:
            logger.error("Error retrieving country with id {}: {}".format(id, e))
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


    @classmethod
    def delete(cls, id):
        try:
            deleted_collection = get_db().deleted
            document_to_del = cls.find_by_id(id)
            if not document_to_del:
                logger.error("Country with id {} not found".format(id))
                return False
            deleted_collection.insert_one(document_to_del)
            collection = cls.get_collection()
            result = collection.delete_one({strID: id})
            logger.info("Documents deleted {}".format(result.deleted_count))
            return result.deleted_count
        except Exception as e:
            logger.error("Error deleting country: {}".format(e))
            raise Exception(e)
