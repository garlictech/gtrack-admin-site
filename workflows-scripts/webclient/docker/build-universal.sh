#!/usr/bin/env bash
set -e
. .env

if [[ "$1" == 'aot' ]]; then
  docker/npm.sh build:universal:aot
elif [[ "$1" == 'debug' ]]; then
  docker/npm.sh build:universal:dev
elif [[ "$1" == 'debug:aot' ]]; then
  docker/npm.sh build:universal:aot:dev
else
  docker/npm.sh build:universal:prod
fi
