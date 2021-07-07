import logging
from email.mime.text import MIMEText
from email.utils import formataddr

import requests
import smtplib, ssl

logging.basicConfig(level=logging.DEBUG, format="[%(asctime)s] [%(levelname)s] [%(name)s: %(lineno)d]: %(message)s")
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


def send_error_mail(message):
    MAIL_RECIPIENT = "belladatalabs@gmail.com"
    MAIL_USERNAME = "info@ecommerceexperts.expert"
    MAIL_PASSWORD = "Bella@123"
    MAIL_SERVER = "mail.privateemail.com"
    MAIL_PORT = 465

    msg = MIMEText(message, "html", "utf-8")
    msg["From"] = formataddr(("EcommerceExperts.Expert", MAIL_USERNAME))
    msg["To"] = MAIL_RECIPIENT
    msg["Subject"] = "Message from Review App Monitor"

    print("Sending mail")
    context = ssl.create_default_context()
    print("context: {}".format(context))
    with smtplib.SMTP_SSL(MAIL_SERVER, MAIL_PORT, context) as server:
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.sendmail(MAIL_USERNAME, MAIL_RECIPIENT, msg.as_string())
        server.quit()
        print("Probably message was sent??")


if __name__ == "__main__":
    url = "https://rwen8zm5le.execute-api.eu-west-2.amazonaws.com/Test/features"

    body = {
        "clientid": "client1",
        "productid": "product2"
    }

    try:
        response = requests.post(url, body)

        if response.status_code == 200:
            logger.debug("Server working OK")
        else:
            message = "Error: Server returned status: {}, response: {}".format(response.status_code, response.text)
            logger.error(message)
            send_error_mail(message)

    except Exception as e:
        message = "Error: The following exception occurred trying to connect to server: {}".format(e)
        logger.error(message)
        send_error_mail(message)
