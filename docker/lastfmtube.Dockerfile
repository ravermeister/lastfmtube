FROM php:8.0-alpine

RUN apk add --no-cache \
	composer lighttpd \
	zlib-dev libpng-dev sqlite sqlite-dev icu-dev libzip-dev libxml2-dev \
	&& docker-php-ext-install gd xml pdo pdo_sqlite intl zip ctype \
	&& docker-php-ext-enable gd xml pdo pdo_sqlite intl zip ctype

WORKDIR '/var/www/html'

COPY composer.json .
RUN php /usr/bin/composer.phar install

COPY admin.php favicon.ico index.php license.txt .
COPY ./conf ./conf
COPY ./images ./images
COPY ./js ./js
COPY ./locale ./locale
COPY ./php ./php
COPY ./themes ./themes



EXPOSE 80
