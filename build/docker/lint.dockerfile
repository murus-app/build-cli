FROM node:current-slim

WORKDIR /temporary
COPY .npmrc package.json yarn.lock ./
RUN yarn install --frozen-lockfile \
  && mkdir --parents /lint \
  && cp --archive /temporary/node_modules /lint

WORKDIR /lint
COPY . .
RUN yarn run lint:inspect
