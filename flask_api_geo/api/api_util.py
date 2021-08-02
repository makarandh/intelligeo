import logging
import os

from utils.global_vars import HTTP_ORIGIN, HTTP_REFERER


logging.basicConfig(level=logging.DEBUG,
                    format='[%(asctime)s] [%(levelname)s] [%(filename)s] [%(lineno)s]: %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

VALID_REFERER_ORIGINS = [
    "https://geo.intellideep.digital",
    "https://admin.geo.intellideep.digital"
]


def test_referer_origin(environ) -> bool:
    test_passed = True
    http_origin = "null"
    http_referer = "null"

    if HTTP_ORIGIN not in environ:
        test_passed = False
    else:
        http_origin = environ[HTTP_ORIGIN]
        if http_origin not in VALID_REFERER_ORIGINS:
            test_passed = False

    if HTTP_REFERER not in environ:
        test_passed = False
    else:
        http_referer = environ[HTTP_REFERER]
        if http_referer not in VALID_REFERER_ORIGINS:
            test_passed = False

    logger.info("origin: {}; referer: {}".format(http_origin, http_referer))
    if "DEBUG" in os.environ and os.environ["DEBUG"]:
        if not test_passed:
            test_passed = True
            logger.warning("WARNING: REFERER ORIGIN TEST FAILED BUT MARKED AS PASSED IN DEBUG MODE")
    return test_passed

