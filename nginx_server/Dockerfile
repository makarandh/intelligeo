FROM nginx
WORKDIR /docker_nginx
RUN mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.old
COPY ["./nginx.conf", "/etc/nginx/"]
COPY ["./proxy_params", "/etc/nginx/"]
COPY ["./start_services.sh", "./"]
RUN chown -R nginx:nginx /docker_nginx
RUN chmod +x ./start_services.sh
RUN apt update; apt -y upgrade
CMD ["/bin/bash", "-c", "./start_services.sh"]
