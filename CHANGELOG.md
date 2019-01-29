# petfeedd Changelog

## Version 0.2.1

### New Features

* Docker support for `arm32v6` was added.
* Documentation was updated with information about timezones.
* Documentation was updated with a `docker-compose` example.

## Version 0.2

### Breaking Changes

* Some configuraation options in the config file were renamed slightly to enable
  easier passing as environment variables.

### New Features

* Docker support was added for `amd64` and `arm32v7` architectures.
* Build scripts were updated to build Docker images.
* Ability to pass config as environment variables.

### Bugfixes

* The Pipfile was updated to specify the correct version of libraries 
  instead of "*".
* RPI.GIPO was added as a dependency in the Pipfile.
* A misspelling was fixed in the example config file.

## Version 0.1

Inital release.
