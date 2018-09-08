#!/usr/bin/env bash
set -e
. .env

export DOCKER_CMD="scripts/cat-package-json.sh"
DOCKER_RUN_CMD="docker-compose -f docker/docker-compose.webpack.yml run -T ${PROJECT}.webpack-server"
# /app/package_project.json is the package.json in this project, copied into the container.
echo "Updating package.json..."
${DOCKER_RUN_CMD} > package.json

echo "Updating tslint.json..."
export DOCKER_CMD="cat tslint.json"
${DOCKER_RUN_CMD} > tslint.json

echo "Updating tsconfig.json..."
export DOCKER_CMD="cat tsconfig.json"
${DOCKER_RUN_CMD} > tsconfig.json

echo "Adding ng packages..."
ng add ng-cli-pug-loader && rm -f ng-add-pug-loader.js
