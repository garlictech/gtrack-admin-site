#!/usr/bin/env bash

echo "Starting dist server + dependencies..."

DOCKER_COMPOSE="docker-compose -f docker/docker-compose.universal.yml -f docker/docker-compose.dependencies.yml"
$DOCKER_COMPOSE build
${DOCKER_COMPOSE} up --remove-orphans
