FROM php:8.0-alpine

RUN apk add --no-cache \
	composer lighttpd zlib-dev libpng-dev sqlite sqlite-dev icu-dev libzip-dev \
	&& docker-php-ext-install gd pdo pdo_sqlite intl zip \
	&& docker-php-ext-enable gd pdo pdo_sqlite intl zip
	

WORKDIR '/var/www/html'

COPY composer.json .
#RUN composer install

#EXPOSE 80
