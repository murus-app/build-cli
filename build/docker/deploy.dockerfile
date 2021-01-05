ARG BUILD_STAGE_IMAGE_TAG
FROM "$BUILD_STAGE_IMAGE_TAG"

ARG NPM_DEPLOY_TOKEN
ARG CI_PUBLIC_EMAIL
ARG CI_PUBLIC_ORG_NAME

WORKDIR /build
COPY . .
RUN node ./dist/main.js prepare-npmrc \
      --npmrc_path="./.npmrc" \
      --auth_token="${NPM_DEPLOY_TOKEN}" \
      --org_email="${CI_PUBLIC_EMAIL}" \
      --org_name="${CI_PUBLIC_ORG_NAME}"
RUN cp ./.npmrc ./dist/components/ \
    && cd ./dist/components/ \
    && npm publish
