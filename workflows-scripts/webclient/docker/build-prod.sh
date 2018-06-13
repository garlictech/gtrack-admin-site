#!/usr/bin/env bash
set -e
. .env

if [[ "$1" == 'aot' ]]; then
  docker/npm.sh build:aot:prod
else
  docker/npm.sh build:prod
fi
