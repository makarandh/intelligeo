import logging
import os

from utils.global_vars import HTTP_ORIGIN, HTTP_REFERER


logging.basicConfig(level=logging.DEBUG,
                    format='[%(asctime)s] [%(levelname)s] [%(filename)s] [%(lineno)s]: %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

VALID_REFERER_ORIGINS = [
    "https://geo.intellideep.digital",
    "https://admin.geo.intellideep.digital",
    "https://localhost"
]


def test_referer_origin(environ) -> bool:
    test_passed = True
    http_origin = "null"
    http_referer = "null"

    if HTTP_ORIGIN not in environ:
        logger.warning("http_origin not found")
        test_passed = False
    else:
        http_origin = environ[HTTP_ORIGIN]
        logger.info("http_origin: {}".format(http_origin))
        if http_origin[-1] == "/":
            http_origin = http_origin[:-1]
        if http_origin not in VALID_REFERER_ORIGINS:
            logger.error("Origin {} not in valid list {}".format(http_origin, VALID_REFERER_ORIGINS.__str__()))
            test_passed = False

    if HTTP_REFERER not in environ:
        logger.warning("http_referer not found")
        test_passed = True
    else:
        http_referer = environ[HTTP_REFERER]
        logger.info("http_referer: {}".format(http_referer))
        if http_referer[-1] == "/":
            http_referer = http_referer[:-1]
        if http_referer not in VALID_REFERER_ORIGINS:
            test_passed = False
            logger.error("Referer {} not in valid list {}".format(http_referer, VALID_REFERER_ORIGINS.__str__()))

    logger.info("origin: {}; referer: {}".format(http_origin, http_referer))
    if "DEBUG" in os.environ:
        logger.info("DEBUG env variable {}".format(os.environ["DEBUG"]))
    if "DEBUG" in os.environ and os.environ["DEBUG"]:
        if not test_passed:
            test_passed = True
            logger.warning("WARNING: REFERER ORIGIN TEST FAILED BUT MARKED AS PASSED IN DEBUG MODE")
    return test_passed

