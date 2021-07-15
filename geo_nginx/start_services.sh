#!/bin/bash
service nginx stop; chown -R nginx:nginx /docker_nginx
(nginx -t && service nginx start && echo "Nginx server is up and running" && /bin/bash) || (echo "ERROR: Nginx configuration file malformed. Exiting." && exit 1)
