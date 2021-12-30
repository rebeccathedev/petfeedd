# petfeedd

## About

petfeedd is a daemon for Raspberry Pi that will feed your pets. :)

Well, okay, obviously, it won't physically feed your pets. You'll still have to
build the hardware part of the feeder. But it aims to wrap up the common
functionality that pet feeders require into a format that can be reused for any
number of feeder designs.

petfeedd provides:

* A web interface for "programming" your feeder, that allows an arbitrary number
of feeds of an arbitrary size.

* A RESTful API that can be used to write third-party clients.

* An auto-discovery protocol that can be used to find feeders on your network.
Useful for writing third party clients.

* A notification system that supports email, MQTT and Twitter.

petfeedd is implemented in NodeJS with Vue for the web front end.

### A Note About Security

Let's have some common sense here. This is a pet feeder. Do not expose it to the
Internet. It implements **no security** on the web interface. There are no users
or passwords or API keys. Again, it's a pet feeder, not a banking site. Keep it
safely behind your firewall.

If you are truly paranoid about this, you can use nginx as a proxy to add HTTP
authentication, or simply not expose the web interface once you have it
configured.

## Supported Hardware

petfeedd is reported to be working without modification on:

* Raspberry Pi Zero
* Raspberry Pi Zero 2
* Raspberry Pi 3
* Raspberry Pi 3B v1.2
* Raspberry Pi 3B+
* Raspberry Pi 4

I generally recommend not using the Zero for a project like this. The limited
onboard memory tends to be problematic.

## Documentation

* [Installation](docs/INSTALL.md)
* [Configuration](docs/CONFIGURE.md)
* [API](docs/API.md)
* [Auto Discovery](docs/DISCOVERY.md)
* [FAQ](docs/FAQ.md)

## Contributing

Patches are always welcome if you have some cool functionality you would like to
add.
## Author

Rob Peck

## License

GPLv3
