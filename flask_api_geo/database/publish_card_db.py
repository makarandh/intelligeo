import datetime
import logging

from pymongo import WriteConcern
from database.country_model import CountryModel
from database.db_connect import get_db
from utils.global_vars import ID, PUBLISHED_AT, PUBLISHED_BY, UNPUBLISHED_AT, UNPUBLISHED_BY, NAME

logging.basicConfig(level=logging.DEBUG,
                    format='[%(asctime)s] [%(levelname)s] [%(filename)s] [%(lineno)s]: %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class Publisher:
    """
    Country collection and Draft collection are one and the same
    Publisher cards move from country collection to published collection and vice versa.
    """

    @classmethod
    def get_collection(cls):
        db = get_db()
        return db.published.with_options(write_concern=WriteConcern(w=1, j=True))


    @classmethod
    def find_by_id(cls, id) -> dict:
        try:
            collection = cls.get_collection()
            result = collection.find_one({ID: id}, CountryModel.search_filter)
            if result:
                logger.info("Published country with id {} found {}".format(id, result[NAME]))
                return dict(result)
            else:
                logger.info("Country with id {} is not published".format(id))
                return {}
        except Exception as e:
            logger.error("Error finding published country with id {}: {}".format(id, e))
            raise Exception(e)


    @classmethod
    def publish_card(cls, card_id: int, user) -> bool:
        try:
            logger.info("Requested db operation: publish country: {}".format(card_id))
            collection = cls.get_collection()
            country_collection = CountryModel.get_collection()
            country_dict = cls.find_by_id(card_id)
            if country_dict:
                logger.error("Country {} already exists in published collection: {}".format(card_id, country_dict))
                return False

            country_dict = CountryModel.find_by_id(card_id)
            if not country_dict:
                logger.error("Country to publish not found card_id: {}".format(card_id))
                return False
            country_dict[PUBLISHED_AT] = (datetime.datetime.utcnow()
                                          .replace(tzinfo=datetime.timezone.utc)
                                          .isoformat())
            country_dict[PUBLISHED_BY] = user
            logger.info("Adding to published collection: {}".format(country_dict))
            result = collection.insert_one(country_dict)
            if not result:
                logger.error("Could not add card to publish collection {}".format(country_dict))
                return False
            logger.info("Card added to published collection:{} {}".format(result.inserted_id, country_dict))
            result = country_collection.delete_one({ID: card_id})
            if not result:
                logger.error("Could not delete card from draft collection {}".format(country_dict))
                return False
            return True
        except Exception as e:
            logger.error("Error moving card to published collection: {}".format(e))
            raise Exception(e)


    @classmethod
    def unpublish_card(cls, card_id: int, user) -> bool:
        logger.info("Requested db operation: unpublish country: {}".format(card_id))
        try:
            collection = cls.get_collection()
            country_collection = CountryModel.get_collection()
            country_dict = CountryModel.find_by_id(card_id)
            if country_dict:
                logger.error("Country {} already exists in drafts collection. Please delete it first: {}".format(
                        card_id, country_dict))
                return False

            country_dict = cls.find_by_id(card_id)
            if not country_dict:
                logger.error("Country to publish not found card_id: {}".format(card_id))
                return False
            country_dict[UNPUBLISHED_AT] = (datetime.datetime.utcnow()
                                            .replace(tzinfo=datetime.timezone.utc)
                                            .isoformat())
            country_dict[UNPUBLISHED_BY] = user
            logger.info("Moving to draft: {}".format(country_dict))
            result = country_collection.insert_one(country_dict)
            if not result:
                logger.error("Could not move card from publish to draft: {}".format(country_dict))
                return False
            logger.info("Card moved from published to draft:{} {}".format(result.inserted_id, country_dict))
            result = collection.delete_one({ID: card_id})
            if not result:
                logger.error("Could not delete card from published collection {}".format(country_dict))
                return False
            return True
        except Exception as e:
            logger.error("Error moving card from published to drafts: {}".format(e))
            raise Exception(e)


    @classmethod
    def find(cls, page_num=1, items_per_page=200) -> list:
        try:
            collection = cls.get_collection()
            result = list(collection
                          .find({}, CountryModel.search_filter)
                          .skip((page_num - 1) * items_per_page)
                          .limit(items_per_page))
            logger.info("countries in published collection result: {}".format(len(result)))
            return result
        except Exception as e:
            logger.error("Error retrieving published country: {}".format(e))
            raise Exception(e)


    @classmethod
    def count_total(cls) -> int:
        try:
            collection = cls.get_collection()
            result = collection.find().count()
            logger.info("total no. of published countries in database: {}".format(result))
            return result
        except Exception as e:
            logger.error("Exception occurred getting total published countries: {}".format(e))
            raise Exception(e)
