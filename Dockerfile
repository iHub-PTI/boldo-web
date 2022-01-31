FROM node:14.15.1 AS build
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ARG sockets_address=https://boldo-dev.pti.org.py
ENV REACT_APP_SOCKETS_ADDRESS=https://boldo-dev.pti.org.py
ARG app_server=https://boldo-dev.pti.org.py/api
ENV REACT_APP_SERVER_ADDRESS=https://boldo-dev.pti.org.py/api
ARG app_sentry="https://ef0e91d5dac44ca68696e90914f939b4@o489142.ingest.sentry.io/5550906"
ENV REACT_APP_SENTRY=https://ef0e91d5dac44ca68696e90914f939b4@o489142.ingest.sentry.io/5550906
COPY . /usr/src/app/
RUN npm i && NODE_ENV=production npm run build

FROM nginx:1.19.5-alpine AS base
RUN mkdir /etc/nginx/cache


FROM base AS final
COPY --from=build  /usr/src/app/build /usr/share/nginx/html

COPY ./web-conf/default.conf /etc/nginx/conf.d/default.conf
RUN chmod -R 775 /var/cache/nginx /var/run /var/log/nginx
RUN chmod -R 775 /usr/share/nginx
RUN chgrp -R root /var/cache/nginx
RUN sed -i.bak 's/^user/#user/' /etc/nginx/nginx.conf
RUN addgroup nginx root
USER nginx

EXPOSE 3000
