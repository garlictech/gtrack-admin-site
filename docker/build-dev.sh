#!/usr/bin/env bash
set -e
. .env

if [ -z "${NPM_TOKEN_Garlictech}" ]; then
  echo -e "\033[0;31mNPM_TOKEN_Garlictech environment variable must be defined and should contain the NPM token for this organization!\033[m"
  echo
  exit 0
fi

docker-compose -f docker/docker-compose.webpack.yml build $@
