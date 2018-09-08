#!/usr/bin/env bash
set -e
. .env

DOCKER_RUN_CMD="docker-compose -f docker/docker-compose.webpack.yml run -T ${PROJECT}.webpack-server"
# /app/package_project.json is the package.json in this project, copied into the container.
echo "Updating package.json..."
${DOCKER_RUN_CMD} scripts/cat-package-json.sh > package.json
# echo "Updating tslint.json..."
# ${DOCKER_RUN_CMD} cat tslint.json > tslint.json
# echo "Updating tsconfig.json..."
# ${DOCKER_RUN_CMD} cat tsconfig.json > tsconfig.json

# echo "Adding ng packages..."
# ng add ng-cli-pug-loader && rm -f ng-add-pug-loader.js
