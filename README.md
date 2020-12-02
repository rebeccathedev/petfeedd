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

* A notification system that supports email, PushBullet and Twitter.

petfeedd is implemented predominantly in Python 3 using Flask and Peewee, with
Vue.js and Bootstrap used for the web interface.

### A Note About Security

Let's have some common sense. This is a pet feeder. Do not expose it to the
Internet. It implements **no security** on the web interface. There are no users
or passwords or API keys. Again, it's a pet feeder, not a banking site. Keep it
safely behind your firewall.

If you're truly paranoid, after configuring it you can disable the web interface
and auto discovery system. Then it'll just run as usual.

## Supported Hardware

petfeedd is reported to be working without modification on:

* Raspberry Pi Zero
* Raspberry Pi 3
* Raspberry Pi 3B v1.2
* Raspberry Pi 3B+

## Installation

No matter which installation path you choose, the first step is to install 
[Raspbian](https://www.raspberrypi.org/downloads/raspbian/) and configure to 
your liking.

### Quickstart using Docker

If you just want to run petfeedd and don't want to go to all of the work below 
to run it from source, I maintain [Docker](https://www.docker.com/) images that
are complete and ready for immediate use. To install this way:

1. [Install Docker](https://medium.freecodecamp.org/the-easy-way-to-set-up-docker-on-a-raspberry-pi-7d24ced073ef)
   on your Raspberry Pi. You may need to log out and back in if you get 
   permission errors.

2. `docker pull peckrob/petfeedd-arm32v7:latest`. Be patient, it will take a bit.

3. `sudo touch /opt/petfeedd.db && sudo chown pi: /opt/petfeedd.db`

4. `docker run --privileged -v /opt/petfeedd.db:/petfeedd/petfeedd.db -p 0.0.0.0:8080:8080 peckrob/petfeedd-arm32v7`

Navigate to the IP of your Raspberry Pi on port 8080, and you should see 
petfeedd running. It takes a bit to start, so give it about 20-30 seconds to get 
going. It will run with the defaults, but in order for it to be useful, you'll 
need to configure it.

The reason we pass `--privileged` to the container is to allow the container to
access the host's GPIO pins. The reason that we pass 
`-v /opt/petfeedd.db:/petfeedd/petfeedd.db` is to store the DB outside the 
container.

#### Different Architectures

The examples here are indended for the ARM processors on the Raspberry Pi, thus
the `arm32v7` on the end of the image. I also build `amd64` and `arm32v6` images 
as well, just replace `arm32v7` with any of the below in every example above.

* `arm32v7` - Raspberry Pi 2/2B/3/3B
* `arm32v6` - Raspperry Pi/Zero
* `amd64` - Intel x86

#### A Note on Timezones

Timezones inside the Docker container are independent of timezones on the 
device. Assuming you have run `sudo raspi-config` and set the timezone properly,
unless you want to use UTC for your feeders you will need to bring 
`/etc/localtime` into the container.

```
$ docker run --privileged -v /etc/localtime:/etc/localtime -v /opt/petfeedd.db:/petfeedd/petfeedd.db -p 0.0.0.0:8080:8080 peckrob/petfeedd-arm32v7
```

#### Configuring under Docker using petfeedd.conf

To configure it, you have two options. You can either use environment variables
passed to the Docker container or the config file. The config file is probably
the easiest approach.

To configure using a config file, you'll create a config file at 
`/etc/petfeedd.conf` using the contents of the example config file above, 
customized for your liking. Then, run the Docker container with the config file
mapped into the container. petfeedd should pick it up automatically.

```
$ docker run -d --privileged -v /opt/petfeedd.db:/petfeedd/petfeedd.db -v /etc/petfeedd.conf:/petfeedd/petfeedd.conf -p 0.0.0.0:8080:8080 peckrob/petfeedd-arm32v7
```

#### Configuring under Docker using Environment Variables

While the config file is probably the easiest approach, petfeedd will also read
from environment variables. Environment variables start with `petfeedd` and 
follow the convention expressed in the config file, with sections and keys 
separated by underscores (`_`). For example, to enable logging, you would pass
`petfeedd_logging_enabled=1` to the Docker container:

```
$ docker run -d --privileged -v /opt/petfeedd.db:/petfeedd/petfeedd.db -e petfeedd_logging_enable=0 -p 8080:8080 peckrob/petfeedd-arm32v7
```

#### Restarting Automatically

**IMPORTANT**: By default, the examples above will not restart automatically.
You probably want to set a restart policy when you start petfeedd using docker.
Otherwise, your cats will likely be very angry with you.

So, a complete example of running petfeedd using Docker would be something like:

```
$ docker run -d --restart always --privileged -v /etc/localtime:/etc/localtime -v /opt/petfeedd.db:/petfeedd/petfeedd.db -v /etc/petfeedd.conf:/petfeedd/petfeedd.conf -p 0.0.0.0:8080:8080 -p 0.0.0.0:11211:11211 peckrob/petfeedd-arm32v7
```

#### Using Docker Compose

Once the command gets that large, you may consider using `docker-compose` for
better reproducability.

If you haven't already installed `docker-compose` you can do so with:

```
$ sudo apt update
$ sudo apt install -y python python-pip
$ sudo pip install docker-compose
```

Here is an example `docker-compose.yml` file representing the above command.

```yml
version: '3'
services:
    petfeedd:
        privileged: true
        image: peckrob/petfeedd-arm32v7
        restart: always
        volumes:
         - /etc/localtime:/etc/localtime
         - /opt/petfeedd.db:/petfeedd/petfeedd.db
         - /etc/petfeedd.conf:/petfeedd/petfeedd.conf
        ports:
         - 0.0.0.0:8080:8080
         - 0.0.0.0:11211:11211
```

Now you can just run:

```
$ docker-compose up -d
```

#### Updating

Simply `docker pull peckrob/petfeedd-arm32v7` and restart the container.

#### Multiple Servos

If you want to drive more than one servo using petfeedd, you have a few options.

The easiest is to run multiple instances of petfeedd using Docker, each pointed 
to a different servo. I would be sure to offset each servo by a few seconds to 
be sure you don’t have any voltage drop issues with the Raspberry Pi.

The other would be to drive the servos using a relay or other control board that
allows you to drive multiple servos from a single pin. These will usually need a
separate power supply as well.

### Building from Source

While the Docker container is the fastest and most foolproof way to get going,
you can also install from source directly onto the Raspberry Pi. This is also 
useful if you want to make changes to the source code.

1. `apt-get install python3 python3-gpio python3-pip git`

2. `pip3 install pipenv`

3. `curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash - && sudo apt-get install -y nodejs`

4. Clone the Repository. cd to the directory you cloned it to.

5. `pipenv install`

6. `npm install`

7. `./node_modules/.bin/gulp`

8. `cp petfeedd.conf.example petfeedd.conf`

9. Edit `petfeedd.conf` to your liking.

10. `useradd -d /path/to/your/checkout -G gpio petfeedd`

11. `cp init/systemd/petfeedd.service /etc/systemd/system`

12. `systemctl daemon-reload`

13. `systemctl start petfeedd`

Be patient, it can take some time to start up. On my Raspberry Pi 3 Model B
version 1.2, it takes about 10 seconds. You can `tail -f /var/log/syslog` for
when it is up and operational. Then you should be able to open a Browser and
configure your feeds.

## API

petfeedd exposes a web API that can be used to build third-party clients. The
API is REST/JSON. The web interface in fact uses the API.

```
GET /api/events
```

Will return a list of the 50 most recent feed events.

```
GET|POST /api/feeds
```

Sending GET will get all the scheduled feeds. Sending POST will create a new
feed. Posting a new feed accepts the following as a JSON object in the body:

* `time` - "HH:MM:SS" string of the time of the feed, in 24 hour time.
* `name` - A friendly name for the feed ("Breakfast", "Lunch", etc).
* `size` - The size of the feed. This is a multiplier of the config
`sevo_feed_time` for how long it will run the servo.
* `last_feed` - To reset or change the last feed time.
* `feed_count` - To reset or change the feed count.

```
GET|POST|DELETE /api/feeds/<int>
```

Sending GET will get details about a specific feed. Sending POST will update the
feed. Sending DELETE will delete the feed. Posting an updated feed accepts the
same parameters as posting a new feed.

```
POST /api/feed
```

Will trigger an on-demand feed.

```
POST /api/pause
```

Pauses all feeding activity.

```
POST /api/start
```

Resumes feeding activity after a pause.

```
GET /api/status
```

Returns some information about the feeder.

## Auto Discovery

petfeedd implements a simple auto-discovery mechanism to allow you to find
feeders on your network. Send a UDP broadcast packet to port 11213 containing
`petfeedd`, and all the feeders on your network should respond with information
about themselves. This is useful for writing clients.

## Contributing

Patches are always welcome if you have some cool functionality you would like to
add. To make things a little bit easier for development, there are some things 
that you should know.

### Running Locally

You can run petfeedd locally. It will detect that it is not running on a 
Raspberry Pi and imitate a feed. PIGPIO is also included as a dev dependency so
you should be able to use remote GPIO as well. I have not tested this, but I 
have no reason to believe it would not work.

To run locally, follow steps 4-7 above, then run:

```
$ pipenv run python3 src/__main__.py
```

### Building your own Docker images

From a source code checkout, you can build your own Docker images as well. In 
order to keep the Docker images as small as possible and reduce the build times, 
we use a build pipeline to do as much work as possible. The build pipeline:

1. Cleans the build directory.
1. Copies the sources into the build directory.
1. Builds the assets.
1. Removes everything that is not needed in the Docker image.
1. Builds the Docker images.
1. Cleans the build directory.

There is a gulp command to make it easy:

```
$ gulp build --image=<your image name> [--tag=latest] [--arch=<arch>]
```

If you don't pass an `--arch` argument, it will build all architectures. Be 
aware that this will take considerable time (it takes about 20 minutes to build
each ARM arch image on my 2018 MacBook Pro). For arch, you can pass any of the
supported architectures (that have a matching `Dockerfile.<arch>`).

## Author

Rob Peck

## License

GPLv3
