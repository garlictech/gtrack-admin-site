#!/usr/bin/env bash
set -e
. .env

if [[ "$1" == 'aot' ]]; then
  docker/npm.sh build:aot:prod
elif [[ "$1" == 'debug:aot' ]]; then
  docker/npm.sh build:aot:prod:debug
else
  docker/npm.sh build:prod
fi
