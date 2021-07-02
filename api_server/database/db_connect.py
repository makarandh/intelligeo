from pymongo import MongoClient
from pymongo import WriteConcern
from utils.strings import strDB_NAME
import platform


def get_db():
    """
        Creates MongoDB connection
        Note: The database we are connecting to is named store
            If you want to change the basename, please change it here.
        :return: MongoDB database
    """
    client = MongoClient("mongodb://localhost", w=1, journal=True)

    # if platform.node() == "workhorse":
    #     client = MongoClient("mongodb://localhost", w=1, journal=True)
    # else:
    #     client = MongoClient("mongodb://mongo-server", w=1, journal=True)

    db = client.get_database(strDB_NAME, write_concern=WriteConcern(w=1, j=True))
    return db
