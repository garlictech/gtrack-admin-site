#!/usr/bin/env bash
set -e
. .env

docker-compose -f docker/docker-compose.webpack.yml build $@
docker-compose -f docker/docker-compose.webpack.yml run --user `id -u` ${PROJECT}.webpack-server npm run build:dll
