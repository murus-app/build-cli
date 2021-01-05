FROM node:current-slim

WORKDIR /temporary
COPY .npmrc package.json yarn.lock ./
RUN yarn install --frozen-lockfile \
  && mkdir --parents /build \
  && cp --archive /temporary/node_modules /build

WORKDIR /build
COPY . .
RUN yarn run build
