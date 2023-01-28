FROM php:8.0-alpine

RUN apk add --no-cache \
	composer lighttpd \
	zlib-dev libpng-dev sqlite sqlite-dev icu-dev libzip-dev libxml2-dev \
	&& docker-php-ext-install gd xml pdo pdo_sqlite intl zip ctype \
	&& docker-php-ext-enable gd xml pdo pdo_sqlite intl zip ctype

WORKDIR '/var/www/html'

COPY . ./
RUN php /usr/bin/composer.phar install

EXPOSE 80
