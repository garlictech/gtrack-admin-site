#!/usr/bin/env bash

echo "Starting prod server + dependencies..."

DOCKER_COMPOSE="docker-compose -f docker/docker-compose.prod.yml -f docker/docker-compose.dependencies.yml"
$DOCKER_COMPOSE build
${DOCKER_COMPOSE} up -d --remove-orphans
