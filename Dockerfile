FROM node:14.15.1 AS build
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG sockets_address=http://socket:8000
ENV REACT_APP_SOCKETS_ADDRESS=$sockets_address
ARG app_server=http://localhost:8008
ENV REACT_APP_SERVER_ADDRESS=$app_server
ARG app_sentry="https://ef0e91d5dac44ca68696e90914f939b4@o489142.ingest.sentry.io/5550906"
ENV REACT_APP_SENTRY=$app_sentry
ARG kc_url=http://localhost:8080
ENV REACT_APP_KEYCLOAK_URL=$kc_url
ARG kc_url=http://localhost:8080
ENV REACT_APP_KEYCLOAK_URL=$kc_url
ARG kc_realm=iHub
ENV REACT_APP_KEYCLOAK_REALM=$kc_realm
ARG kc_client=boldo-doctor
ENV REACT_APP_KEYCLOAK_CLIENT_ID=$kc_client

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
