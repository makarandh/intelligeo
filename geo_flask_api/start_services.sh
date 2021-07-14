#!/bin/bash
chown -R flaskuser:flaskuser /home/flaskuser/
export PIPENV_VENV_IN_PROJECT=1 && export LC_ALL=C.UTF-8 && export LANG=C.UTF-8 && service supervisor start
(supervisorctl reload && echo "Flask server is up and running" && /bin/bash) || (echo "ERROR: Supervisor could not be reloaded. Exiting." && exit 1)
