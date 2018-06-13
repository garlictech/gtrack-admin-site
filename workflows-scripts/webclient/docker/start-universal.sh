#!/usr/bin/env bash
DOCKER_COMPOSE="docker-compose -f docker/docker-compose.webpack.yml -f docker/docker-compose.net.yml"

${DOCKER_COMPOSE} run --user `id -u` --service-ports ${PROJECT}.webpack-server npm run server:universal
