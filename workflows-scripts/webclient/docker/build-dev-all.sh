#!/usr/bin/env bash
set -e
. .env

docker-compose -f docker/docker-compose.webpack.yml -f docker/docker-compose.dependencies.yml pull $@
docker-compose -f docker/docker-compose.webpack.yml build --no-cache $@
docker-compose -f docker/docker-compose.webpack.yml run ${PROJECT}.webpack-server npm run build:dll
