import platform

from pymongo import MongoClient
from pymongo import WriteConcern
from utils.global_vars import MONGO_DB, MONGO_USER, MONGO_PASS


def get_db():
    """
        Creates MongoDB connection
        Note: The database we are connecting to is named store
            If you want to change the basename, please change it here.
        :return: MongoDB database
    """
    if platform.node() == "workhorse":
        mongo_url = "mongodb://localhost"
    else:
        mongo_url = "mongodb://mongo-server"

    client = MongoClient(mongo_url,
                         username=MONGO_USER,
                         password=MONGO_PASS,
                         authSource=MONGO_DB,
                         w=1,
                         journal=True)

    db = client.get_database(MONGO_DB, write_concern=WriteConcern(w=1, j=True))
    return db
