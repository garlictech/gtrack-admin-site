#!/usr/bin/env bash
DOCKER_COMPOSE="docker-compose -f docker/docker-compose.prod.yml -f docker/docker-compose.dependencies.yml"
${DOCKER_COMPOSE} kill
