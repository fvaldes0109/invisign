FROM php:8.2-cli

RUN apt-get update && apt-get install -y --no-install-recommends \
    unzip \
    libzip-dev \
    && docker-php-ext-install pdo pdo_mysql zip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --no-interaction

COPY . .

RUN composer dump-autoload --no-dev --optimize --no-interaction

EXPOSE 8080

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8080"]
