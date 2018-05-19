#!make
include .env
export $(shell sed 's/=.*//' .env)

DOCKER_IMAGE=${DOCKER_REGISTRY}/${PROJECT}-${DOCKER_IMAGE_SCOPE}
SYSTEMTEST_DOCKER_IMAGE=${DOCKER_SYSTEMTEST_REGISTRY}/${PROJECT}.systemtest

DOCKER_IMAGE_BASE=dontpushme/${PROJECT}-base
DEV_SERVICE_NAME=${PROJECT}.dev
DOCKER_COMPOSE_BASE = docker-compose -f docker/docker-compose.dependencies.yml -f docker/docker-compose.yml
SYSTEMTEST_SERVICE_NAME=${PROJECT}.systemtest.runner
DOCKER_COMPOSE = ${DOCKER_COMPOSE_BASE}
DOCKER_RUN = ${DOCKER_COMPOSE} run --rm ${DEV_SERVICE_NAME}
DOCKER_RUN_NODEPS = ${DOCKER_COMPOSE} run --no-deps --rm ${DEV_SERVICE_NAME}
DOCKER_COMPOSE_PROD = docker-compose -f docker/docker-compose.prod.yml -f docker/docker-compose.dependencies.yml
DOCKER_COMPOSE_SYSTEMTEST = docker-compose -f docker/docker-compose.systemtest.base.yml -f docker/docker-compose.systemtest.${DOCKER_IMAGE_SCOPE}.yml
DOCKER_RUN_SYSTEMTEST = ${DOCKER_COMPOSE_SYSTEMTEST} run --service-ports --rm ${SYSTEMTEST_SERVICE_NAME}
DOCKER_COMPOSE_SERVER = ${DOCKER_COMPOSE} -f docker/docker-compose.server.yml

.PHONY: build dist start unittest systemtest login bash docker-login docker-push

# Build the development services.
build:
	-rm -rf project/src/*/node_modules project/src/*/node_modules
	${DOCKER_COMPOSE} build
	${DOCKER_RUN_NODEPS} gulp compile

build-base:
	if [ -f Dockerfile.common ]; then docker build --build-arg NPM_TOKEN=${NPM_TOKEN} -t ${DOCKER_IMAGE_BASE} -f Dockerfile.common . ; fi

build-prod: build-base
	docker build -t ${DOCKER_IMAGE} -f Dockerfile.${DOCKER_IMAGE_SCOPE} .

build-all:
	-${DOCKER_COMPOSE} rm -f -v
	-docker rmi ${DOCKER_REGISTRY}/${PROJECT}
	-docker rmi ${DEV_SERVICE_NAME}
	-${DOCKER_COMPOSE} pull
	${DOCKER_COMPOSE_BASE} build --no-cache
	${DOCKER_RUN_NODEPS} gulp compile

# Start the development server and the defined services. It also watches for file changes. In this case, it re-runs the unit tests and restarts the server.
start:
	${DOCKER_COMPOSE} up

# Stop the development server and the defined services.
stop:
	${DOCKER_COMPOSE} kill

clean:
	-rm -rf project/src/*/node_modules project/src/*/node_modules
	-rm -rf dist

unittest:
	${DOCKER_RUN_NODEPS} gulp unittest

# Execute the system tests
systemtest-build:
	${DOCKER_COMPOSE_SYSTEMTEST} pull
	${DOCKER_COMPOSE_SYSTEMTEST} build

systemtest-compile:
	 ${DOCKER_COMPOSE_SYSTEMTEST} build

systemtest-run: systemtest-compile
	${DOCKER_RUN_SYSTEMTEST} 

systemtest-run-debug: systemtest-compile
	${DOCKER_RUN_SYSTEMTEST} scripts/systemtest-debug.sh

# The system test runner spins up all the dependencies, executes the system tests once, and exits. There are no logs of the dependencies displayed. If you want to see the whole picture, use:.
systemtest-run-d: systemtest-compile
	 ${DOCKER_COMPOSE_SYSTEMTEST} up

systemtest: systemtest-build
	${DOCKER_RUN_SYSTEMTEST}

systemtest-build-prod:
	docker build --build-arg NPM_TOKEN=${NPM_TOKEN} -t ${SYSTEMTEST_DOCKER_IMAGE} -f Dockerfile.systemtest .

# Start bash in the development service
bash:
	${DOCKER_RUN_NODEPS} /bin/bash

# Push the distribution image to the registry
docker-push:
	scripts/docker-push.sh

docker-pull:
	${DOCKER_COMPOSE_DEPS} pull

# Tag the image after the latest npm tag
docker-tag:
	scripts/tag-image.sh

# Login to the docker registry of the project
docker-login:
	scripts/docker-login.sh

docker-deploy:
	scripts/docker-deploy.sh

lint:
	${DOCKER_RUN_NODEPS} npm run lint

prettier:
	${DOCKER_RUN_NODEPS} npm run prettier

doc:
	${DOCKER_RUN_NODEPS} npm run typedoc

# Start the production server and the defined services.
start-prod:
	${DOCKER_COMPOSE_PROD} up


# Start the production server and the defined services.
stop-prod:
	${DOCKER_COMPOSE_PROD} down

start-server:
	${DOCKER_COMPOSE_SERVER} up

# List the running processes related to the server
logs:
	${DOCKER_COMPOSE} logs -f ${DEV_SERVICE_NAME}

# List the running processes related to the server
logs-prod:
	${DOCKER_COMPOSE_PROD} logs -f

# List the running processes related to the server
logs-all:
	${DOCKER_COMPOSE} logs -f

# Kill the development server but let the other services run.
kill:
	${DOCKER_COMPOSE} kill ${DEV_SERVICE_NAME}


# Kill the development server but let the other services run.
kill-all:
	${DOCKER_COMPOSE} kill

# Execute the smoke tests
smoketest:
	test/smoke/smoke_test.sh
