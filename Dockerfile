FROM node:14.15.1 AS build
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ARG sockets_address=http://localhost:8000
ENV REACT_APP_SOCKETS_ADDRESS=$sockets_address
ARG app_server=http://localhost:8008
ENV REACT_APP_SERVER_ADDRESS=$app_server
ARG app_frontend=http://localhost:3000
ENV REACT_APP_FRONTEND_ADDRESS=$app_frontend 
COPY . /usr/src/app/
RUN npm i && npm run build

FROM nginx:1.19.5-alpine AS base
RUN mkdir /etc/nginx/cache


FROM base AS final
COPY --from=build  /usr/src/app/build /usr/share/nginx/html

RUN sed -i 's,listen       80;,listen 3000;,' /etc/nginx/conf.d/default.conf
RUN chmod -R 775 /var/cache/nginx /var/run /var/log/nginx
RUN chmod -R 775 /usr/share/nginx
RUN chgrp -R root /var/cache/nginx
RUN sed -i.bak 's/^user/#user/' /etc/nginx/nginx.conf
RUN addgroup nginx root
USER nginx

EXPOSE 3000
