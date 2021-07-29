FROM python:3.8
RUN pip3 install pipenv
WORKDIR /flaskapp
RUN mkdir -p /flaskapp/log;
RUN touch /flaskapp/log/flaskapi.err.log; touch /flaskapp/log/flaskapi.out.log
RUN apt update && apt -y upgrade && apt -y autoremove && apt install supervisor libwebp-dev -y

COPY ["./Pipfile", "/flaskapp/"]
COPY [".", "/flaskapp"]
COPY ["./flaskapp.conf", "/etc/supervisor/conf.d/"]

RUN export PIPENV_VENV_IN_PROJECT=1; export LC_ALL=C.UTF-8; export LANG=C.UTF-8; pipenv install
RUN chmod +x ./start_services.sh
CMD ["/bin/bash", "-c", "./start_services.sh"]
