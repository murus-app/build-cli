ARG BUILD_STAGE_IMAGE_TAG
FROM "$BUILD_STAGE_IMAGE_TAG"

ARG NPM_DEPLOY_TOKEN
ARG CI_PUBLIC_EMAIL
ARG CI_PUBLIC_ORG_NAME
ARG GIT_COMMIT_HASH


WORKDIR /build
COPY . .

RUN cp ./.npmrc ./dist/ \
 && cp ./package.json ./dist/ \
 && cd ./dist/

RUN node ./main.js prepare-npmrc \
      --npmrc_path="./.npmrc" \
      --auth_token="${NPM_DEPLOY_TOKEN}" \
      --org_email="${CI_PUBLIC_EMAIL}" \
      --org_name="${CI_PUBLIC_ORG_NAME}"

RUN node ./main.js prepare-package-json \
      --commit_hash="${GIT_COMMIT_HASH}" \
      --package_json_path="./package.json" \
      --main_js_path="./main.js"

RUN npm publish --access public --tag latest
