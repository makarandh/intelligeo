FROM python:3.8
RUN pip3 install pipenv
RUN useradd -d /home/flaskuser flaskuser; mkdir -p /home/flaskuser/flaskapp/log;
RUN touch /home/flaskuser/flaskapp/log/flaskapi.err.log; touch /home/flaskuser/flaskapp/log/flaskapi.out.log
RUN apt update; apt install supervisor -y
WORKDIR /home/flaskuser/flaskapp

COPY ["./Pipfile", "/home/flaskuser/flaskapp/"]
COPY [".", "/home/flaskuser/flaskapp"]
COPY ["./flaskapp.conf", "/etc/supervisor/conf.d/"]

RUN export PIPENV_VENV_IN_PROJECT=1; export LC_ALL=C.UTF-8; export LANG=C.UTF-8; pipenv install
RUN chown -R flaskuser /home/flaskuser; chmod +x ./start_services.sh
CMD ["/bin/bash", "-c", "./start_services.sh"]
