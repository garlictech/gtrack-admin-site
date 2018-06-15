#!/usr/bin/env bash
set -e
. .env

docker-compose -f docker/docker-compose.webpack.yml build $@
docker-compose -f docker/docker-compose.webpack.yml run ${PROJECT}.webpack-server npm run build:dll
