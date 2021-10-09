import logging
from flask_mail import Message

logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s] [%(levelname)s] [%(name)s: %(lineno)d]: %(message)s')

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

DEFAULT_MAIL_SENDER = "info@intellideep.digital"
DEFAULT_MAIL_RECIPIENTS = ["info@intellideep.digital"]


def send_contact_us_email(message_text):
    subject = "Someone contacted you"
    msg = Message(subject, recipients=DEFAULT_MAIL_RECIPIENTS, html=message_text, sender=DEFAULT_MAIL_SENDER)
    from app import mail
    try:
        mail.send(msg)
    except Exception as e:
        logger.error("Error sending email: {}".format(e))
        return False
    return True
