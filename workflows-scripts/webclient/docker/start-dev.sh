#!/usr/bin/env bash
set -e
. .env

DOCKER_COMPOSE="docker-compose -f docker/docker-compose.dependencies.yml"

if [[ $DEBUG ]]; then
  DOCKER_COMPOSE="${DOCKER_COMPOSE} -f docker/docker-compose.debug.yml"
fi

export DOCKER_CMD="$@"

${DOCKER_COMPOSE} up --remove-orphans -d

export NODE_OPTIONS=--max_old_space_size=4096
ng serve --port 8081
