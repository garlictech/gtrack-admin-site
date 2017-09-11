#!/usr/bin/env bash
set -e
DOCKER_COMPOSE="docker-compose -f docker/docker-compose.dependencies.yml -f docker/docker-compose.webpack.yml -f docker/docker-compose.e2e.yml"

if [[ $DEBUG ]]; then
  DOCKER_COMPOSE="${DOCKER_COMPOSE} -f docker/docker-compose.debug.yml"
fi

if [ $# -eq 0 ]; then
  $DOCKER_COMPOSE run --service-ports garlictech.gtrack-admin-site.e2e-tester
  $DOCKER_COMPOSE stop
elif [ $1 == "bash" ]; then
  $DOCKER_COMPOSE run --entrypoint=/bin/bash garlictech.gtrack-admin-site.e2e-tester
else
  $DOCKER_COMPOSE $@
fi
