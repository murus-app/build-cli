FROM node:current-slim
ARG NPM_DEPLOY_TOKEN

WORKDIR /temporary
COPY .npmrc package.json yarn.lock ./

RUN echo "//npm.pkg.github.com/:_authToken = ${NPM_DEPLOY_TOKEN}" >> ./.npmrc

RUN yarn install --frozen-lockfile \
  && mkdir --parents /lint \
  && cp --archive /temporary/node_modules /lint

WORKDIR /lint
COPY . .
RUN yarn run lint:inspect
