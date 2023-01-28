FROM php:8.0-alpine

RUN apk add --no-cache composer php8-pdo php8-pdo_sqlite php8-intl php8-gd php8-sqlite3 sqlite php8-zip

WORKDIR '/var/www/html'

COPY composer.json .
RUN composer install

EXPOSE 80
