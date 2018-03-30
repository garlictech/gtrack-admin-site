#!/usr/bin/env bash
DOCKER_COMPOSE="docker-compose -f docker/docker-compose.webpack.yml"

if [[ $DEBUG ]]; then
  DOCKER_COMPOSE="${DOCKER_COMPOSE} -f docker/docker-compose.debug.yml"
fi

${DOCKER_COMPOSE} run -p 8092:8092 gtrack-admin-site.webpack-server npm run $@
