FROM nginx:latest
WORKDIR /docker_nginx
RUN apt update && apt -y upgrade && apt -y autoremove && apt install -y nginx-full
RUN mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.old
COPY ["./nginx.conf", "/etc/nginx/"]
COPY ["./proxy_params", "/etc/nginx/"]
COPY ["./start_services.sh", "./"]
RUN chown -R nginx:nginx /docker_nginx
RUN chmod +x ./start_services.sh
CMD ["/bin/bash", "-c", "./start_services.sh"]
