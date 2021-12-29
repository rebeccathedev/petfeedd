BRANCH := $(shell git branch --show-current)
DOCKER_TAG := latest
ifneq ($(BRANCH), master)
	DOCKER_TAG = beta
endif

ifeq ($(DOCKER_PATH),)
	DOCKER_PATH = peckrob/petfeedd
endif

build:
	docker buildx create --name petfeedd-builder --use
	docker buildx build \
		--push \
		--platform linux/arm/v7,linux/arm64/v8,linux/amd64 \
		--tag $(DOCKER_PATH):$(DOCKER_TAG) .
	docker buildx rm petfeedd-builder
