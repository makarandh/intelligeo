FROM nginx
WORKDIR /docker_nginx
RUN mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.old
COPY ["./nginx.conf", "/etc/nginx/"]
COPY ["./proxy_params", "/etc/nginx/"]
COPY ["./start_services.sh", "./"]
RUN chown -R nginx:nginx /docker_nginx
RUN chmod +x ./start_services.sh
RUN apt update && apt -y upgrade && apt -y autoremove && apt install php-curl php-gd php-intl php-mbstring php-soap php-xml php-xmlrpc php-zip php-mysql php8.2-mysql
COPY ["./php.ini", "./etc/php/8.2/fpm/php.ini"]
CMD ["/bin/bash", "-c", "./start_services.sh"]
