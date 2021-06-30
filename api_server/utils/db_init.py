import logging

from database.blacklist_db import BlacklistModel
from database.country_model import QuestionAns, Meta, CountryModel
from database.db_connect import get_db
from database.user_model import UserModel
from utils.strings import (strTIMESTAMP, strEXPIRE_SECONDS, strNAME, strCLUES, strQUESTION_ANS, strMETA)
from utils.default_config import TTL_SECONDS, DELETED_ENTRY_TTL

logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s] [%(levelname)s] [%(name)s] [%(lineno)s]: %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


def initialize_db():
    populate_countries()
    add_users()
    add_blacklist_table()
    add_deleted_table()

def populate_countries():
    db = get_db()
    country = db.country.find_one()

    if country and len(list(country)) > 0:
        logger.info("Country already populated.")
        return

    logger.info("Populating countries...")
    objectsToInsert = [
        CountryModel("Malaysia", [
            "It's a country in southeast Asia (according to UN geoscheme).",
            "It's a constitutional monarchy.",
            "Majority population follows Islam."
        ], [
                         QuestionAns("Is this country known for its beaches?", True).to_dict(),
                         QuestionAns("Is this country tiny?", False).to_dict(),
                         QuestionAns("Is it a landlocked country?", False).to_dict(),
                         QuestionAns("Is it an island country?", False).to_dict(),
                         QuestionAns("Does it border China?", False).to_dict(),
                         QuestionAns("Is the country separated into two parts by a sea?", True).to_dict(),
                         QuestionAns("Does it border Bangladesh?", False).to_dict(),
                         QuestionAns("Does it border India?", False).to_dict(),
                         QuestionAns(
                                 "Is it a megadiverse country? [The term megadiverse country refers to any one of a "
                                 "group of "
                                 "nations "
                                 "that "
                                 "harbor the majority of Earth's species and high numbers of endemic species.]",
                                 True).to_dict()
                     ], Meta("Asia", "South East Asia").to_dict()).to_dict(),
        CountryModel("Spain", [
            "It's a country in southern Europe.",
            "It's a large country compared to other countries in Europe.",
            "The first modern novel is from this country."
        ], [
                         QuestionAns("Does it share a border with an African country?", True).to_dict(),
                         QuestionAns("Is it completely inside the Balkans?", False).to_dict(),
                         QuestionAns("Is it partially inside the Balkans?", False).to_dict(),
                         QuestionAns("Is football really popular in this country?", True).to_dict(),
                         QuestionAns("Is it a constitutional monarchy?", True).to_dict(),
                         QuestionAns("Is it a parliamentary republic?", False).to_dict(),
                         QuestionAns("Are there any McDonalds in this country?", True).to_dict(),
                         QuestionAns("Is it in the Iberian peninsula?", True).to_dict(),
                         QuestionAns("Is Mont Blanc in this country?", False).to_dict(),
                         QuestionAns("Did pizza originate in this country?", False).to_dict()
                     ],
                     Meta("Europe", "Southern Europe").to_dict()).to_dict()

    ]
    db.country.insert_many(objectsToInsert)


def add_users():
    db = get_db()
    user = db.user.find_one()

    if user and len(list(user)) > 0:
        logger.info("Users already exist.")
        return

    logger.info("Adding regular user...")
    user = UserModel(username="user", plaintext_password="user123")
    user.insert()
    user = UserModel(username="client1", plaintext_password="client123")
    user.insert()
    logger.info("Adding an admin user...")
    admin = UserModel(username="admin", plaintext_password="admin123", admin=True)
    admin.insert()


def add_blacklist_table():
    blacklist_collection = BlacklistModel.get_collection()
    indices = list(blacklist_collection.list_indexes())
    index_exists = False
    drop_index = False
    for index in indices:
        if strTIMESTAMP in dict(index["key"]).keys():
            if strEXPIRE_SECONDS in dict(index):
                if dict(index)[strEXPIRE_SECONDS] == TTL_SECONDS:
                    index_exists = True
                    break
                else:
                    drop_index = True
            else:
                drop_index = True

    if drop_index:
        logger.warning("Blacklist Index incorrect. Dropping...")
        blacklist_collection.drop_index([(strTIMESTAMP, 1)])
        index_exists = False
    if not index_exists:
        blacklist_collection.create_index([(strTIMESTAMP, 1)], expireAfterSeconds=TTL_SECONDS)
        logger.debug("Blacklist index created with TTL: {} seconds".format(TTL_SECONDS))


def add_deleted_table():
    deleted_collection = get_db().deleted
    indices = list(deleted_collection.list_indexes())
    index_exists = False
    drop_index = False
    for index in indices:
        if strTIMESTAMP in dict(index["key"]).keys():
            if strEXPIRE_SECONDS in dict(index):
                if dict(index)[strEXPIRE_SECONDS] == DELETED_ENTRY_TTL:
                    index_exists = True
                    break
                else:
                    drop_index = True
            else:
                drop_index = True

    if drop_index:
        logger.warning("Deleted collection index incorrect. Dropping...")
        deleted_collection.drop_index([(strTIMESTAMP, 1)])
        index_exists = False
    if not index_exists:
        deleted_collection.create_index([(strTIMESTAMP, 1)], expireAfterSeconds=DELETED_ENTRY_TTL)
        logger.debug("Deleted collection index created with TTL: {} seconds".format(DELETED_ENTRY_TTL))
