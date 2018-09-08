#!/usr/bin/env bashs
echo "Starting dist server + dependencies..."

DOCKER_COMPOSE="docker-compose -f docker/docker-compose.dist.yml -f docker/docker-compose.dependencies.yml"
$DOCKER_COMPOSE build
${DOCKER_COMPOSE} up --remove-orphans
