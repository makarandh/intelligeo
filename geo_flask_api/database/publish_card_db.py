import datetime
import logging
import re

from pymongo import WriteConcern
from database.country_model import CountryModel
from database.db_connect import get_db
from utils.global_vars import ID

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
            result = collection.find_one({ID: id})
            if result:
                logger.info("Published country with id {} found {}".format(id, result))
                return dict(result)
            else:
                logger.info("Country with id {} is not published".format(id))
                return {}
        except Exception as e:
            logger.error("Error finding published country with id {}: {}".format(id, e))
            raise Exception(e)


    @classmethod
    def publish_card(cls, card: CountryModel, user) -> bool:
        try:
            logger.info("Requested db operation: publish country: {}".format(card.__repr__()))
            collection = cls.get_collection()
            country_collection = CountryModel.get_collection()
            card.published_at = (datetime.datetime.utcnow()
                                 .replace(tzinfo=datetime.timezone.utc)
                                 .isoformat())
            card.published_by = user
            result = collection.find_one({
                ID: re.compile(re.escape(str(card.id)), re.IGNORECASE)
            })
            if result:
                logger.error("Country {} already exists in published collection: {}".format(card.name, result))
                return False
            else:
                logger.info("Adding to published collection: {}".format(card.__repr__()))
                result = collection.insert_one(card.to_dict())
                if not result:
                    logger.error("Could not add card to publish collection {}".format(card.__repr__()))
                    return False
                logger.info("Card added to published collection:{} {}".format(result.inserted_id, card.__repr__()))
                result = country_collection.delete_one({ID: card.id})
                if not result:
                    logger.error("Could not delete card from draft collection {}".format(card.__repr__()))
                    return False
                return True
        except Exception as e:
            logger.error("Error moving card to published collection: {}".format(e))
            raise Exception(e)


    @classmethod
    def unpublish_card(cls, card: CountryModel, user) -> bool:
        logger.info("Requested db operation: unpublish country: {}".format(card.__repr__()))
        try:
            collection = cls.get_collection()
            country_collection = CountryModel.get_collection()
            card.unpublished_at = (datetime.datetime.utcnow()
                                   .replace(tzinfo=datetime.timezone.utc)
                                   .isoformat())
            card.unpublished_by = user
            result = CountryModel.find_by_id(card.id)
            if result:
                logger.error("Country {} already exists in drafts collection. Please delete it first: {}".format(
                        card.name, result))
                return False
            else:
                logger.info("Moving to draft: {}".format(card.__repr__()))
                result = country_collection.insert_one(card.to_dict())
                if not result:
                    logger.error("Could not move card from publish to draft: {}".format(card.__repr__()))
                    return False
                logger.info("Card moved from published to draft:{} {}".format(result.inserted_id, card.__repr__()))
                result = collection.delete_one({ID: card.id})
                if not result:
                    logger.error("Could not delete card from published collection {}".format(card.__repr__()))
                    return False
                return True
        except Exception as e:
            logger.error("Error moving card from published to drafts: {}".format(e))
            raise Exception(e)


    @classmethod
    def find(cls, page_num, items_per_page) -> list:
        try:
            collection = cls.get_collection()
            result = list(collection
                          .find({}, CountryModel.search_filter)
                          .skip((page_num - 1) * items_per_page)
                          .limit(items_per_page))
            logger.info("find country in published collection result: {}".format(result))
            return result
        except Exception as e:
            logger.error("Error retrieving published country: {}".format(e))
            raise Exception(e)
