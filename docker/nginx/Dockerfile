FROM nginx:1.27-alpine
ARG DOMAIN
COPY default.conf.template /tmp/default.conf.template
# Only substitute $DOMAIN; nginx-native variables ($host, $remote_addr, etc.) are left intact
RUN envsubst '${DOMAIN}' < /tmp/default.conf.template > /etc/nginx/conf.d/default.conf \
    && rm /tmp/default.conf.template
