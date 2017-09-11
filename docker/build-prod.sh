#!/usr/bin/env bash
set -e
docker/npm.sh build:prod
docker build -t docker.garlictech.com/gtrack-admin-site .
