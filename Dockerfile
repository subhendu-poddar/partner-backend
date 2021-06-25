# Dockerfile

FROM node:14.17.0-alpine
MAINTAINER ME

RUN mkdir /app
WORKDIR /app
COPY ./app /app

RUN yarn install
RUN apk add --no-cache  chromium --repository=http://dl-cdn.alpinelinux.org/alpine/v3.10/main

EXPOSE 3000
EXPOSE 4000
