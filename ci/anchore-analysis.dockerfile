FROM node:16.9.1 as base

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

RUN mkdir -p /parabol/node_modules && mkdir -p /home/node/.npm-global

WORKDIR /parabol/
ADD package.json .
ADD yarn.lock .
COPY . .

FROM base as anchore
RUN yarn install --frozen-lockfile
