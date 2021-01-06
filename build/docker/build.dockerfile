FROM node:current-slim
ARG NPM_DEPLOY_TOKEN

WORKDIR /temporary
COPY .npmrc package.json yarn.lock ./

RUN echo "//npm.pkg.github.com/:_authToken = ${NPM_DEPLOY_TOKEN}" >> ./.npmrc

RUN yarn install --frozen-lockfile \
  && mkdir --parents /build \
  && cp --archive /temporary/node_modules /build

WORKDIR /build
COPY . .
RUN yarn run build
