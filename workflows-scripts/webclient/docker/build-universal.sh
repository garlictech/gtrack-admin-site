#!/usr/bin/env bash
set -e
. .env

if [[ "$1" == 'aot' ]]; then
  docker/npm.sh build:universal:aot
else
  docker/npm.sh build:universal
fi
