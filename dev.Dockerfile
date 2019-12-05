FROM phpearth/php:7.3-nginx

RUN apk add --no-cache composer php7.3-pdo php7.3-pdo_sqlite php7.3-intl php7.3-gd php7.3-sqlite3 php7.3-zip

WORKDIR '/var/www/html'

COPY composer.json .
RUN composer install

EXPOSE 80