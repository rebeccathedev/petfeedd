# petfeedd Installation

[README](../README.md) · **Installation** · [Configuration](CONFIGURE.md) · [API](API.md) · [Discovery](DISCOVERY.md) · [FAQ](FAQ.md)

No matter which installation path you choose, the first step is to install
[Raspbian](https://www.raspberrypi.org/downloads/raspbian/) and configure to
your liking.

## Quickstart using Docker

If you just want to run petfeedd and don't want to go to all of the work below
to run it from source, I maintain [Docker](https://www.docker.com/) images that
are complete and ready for immediate use. To install this way:

1. [Install Docker](https://medium.freecodecamp.org/the-easy-way-to-set-up-docker-on-a-raspberry-pi-7d24ced073ef)
   on your Raspberry Pi. You may need to log out and back in if you get
   permission errors.

2. `docker pull ghcr.io/rebeccathedev/petfeedd:latest`. Be patient, it will take a bit.

3. `sudo touch /opt/petfeedd.db && sudo chown pi: /opt/petfeedd.db`

4. `docker run --privileged -v /opt/petfeedd.db:/opt/petfeedd.db -p 0.0.0.0:8080:8080 ghcr.io/rebeccathedev/petfeedd:latest`

Navigate to the IP of your Raspberry Pi on port 8080, and you should see
petfeedd running. It takes a bit to start, so give it about 20-30 seconds to get
going. It will run with the defaults, but in order for it to be useful, you'll
need to configure it.

The reason we pass `--privileged` to the container is to allow the container to
access the host's GPIO pins. The reason that we pass
`-v /opt/petfeedd.db:/opt/petfeedd.db` is to store the DB outside the
container.

### Different Architectures

The Docker image `ghcr.io/rebeccathedev/petfeedd:latest` supports multiple architectures. Docker automatically pulls the correct image for the host.

* `linux/arm64` - 64-bit Raspberry Pi 3/4/5
* `linux/arm/v7` - 32-bit Raspberry Pi 2/3
* `linux/arm/v6` - Raspberry Pi 1/Zero
* `linux/amd64` - Intel and AMD x86-64

These four variants are published together under the same tag in GitHub Container Registry.

## Building from Source

**Note: I highly discourage you from building from source unless you know what you are doing.** These instructions are mostly intended for people who want
to contribute to petfeedd. If you just want to use petfeedd, Docker is
definitely the way to go. The only other reason you might want to do this is if
you are using an old or underpowered device (like a Pi Zero or a
first-generation Raspberry Pi) and cannot spare the resources to run Docker.

1. `apt-get install -y git pigpio libpigpio1`

2. Install Node.js 22 or later and npm.

3. `cd /opt`

4. `git clone me@rebeccapeck.org:rebeccathedev/petfeedd.git`

5. `cd petfeedd`

6. `npm ci`

7. `npx webpack --mode production`

10. `useradd -d /opt/petfeedd -G gpio petfeedd`

11. `cp init/systemd/petfeedd.service /etc/systemd/system`

12. `touch /opt/petfeedd.db`

13. `chown -R petfeedd: /opt/petfeedd*`

14. `systemctl daemon-reload`

15. `systemctl start petfeedd`

## Updating

Simply `docker pull ghcr.io/rebeccathedev/petfeedd:latest` and restart the container. Or, if
installed from source, `git pull` from the checkout and restart petfeedd using
systemctl.

---

[README](../README.md) · **Installation** · [Configuration](CONFIGURE.md) · [API](API.md) · [Discovery](DISCOVERY.md) · [FAQ](FAQ.md)
