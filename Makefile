BRANCH     := $(shell git branch --show-current)
ifeq ($(DOCKER_TAG),)
	DOCKER_TAG = latest
	ifneq ($(BRANCH), master)
		DOCKER_TAG = beta
	endif
endif

ifeq ($(DOCKER_PATH),)
	DOCKER_PATH = peckrob/petfeedd
endif

ifeq ($(DOCKER_PLATFORMS),)
	DOCKER_PLATFORMS = linux/arm/v6,linux/arm/v7,linux/arm64/v8,linux/amd64
endif

VERSION_TAG :=
ifneq ($(DOCKER_VERSION_TAG),)
    VERSION_TAG = --tag $(DOCKER_PATH):$(DOCKER_VERSION_TAG)
endif

build:
	docker buildx create --name petfeedd-builder --use
	docker buildx build \
		--push \
		--platform $(DOCKER_PLATFORMS) \
		--tag $(DOCKER_PATH):$(DOCKER_TAG) \
        $(VERSION_TAG) .
	docker buildx rm petfeedd-builder
