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

## Installation

### Preparing your Raspberry Pi

1. Install [Raspbian](https://www.raspberrypi.org/downloads/raspbian/).
Configure to your liking.

2. `apt-get install python3 python3-gpio python3-pip git`

3. `pip3 install pipenv`

4. `curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash - && sudo apt-get install -y nodejs`

5. `npn install -g gulp`

### Build the Source

1. Clone the Repository. cd to the directory you cloned it to.

2. `pipenv install`

3. `npm install`

4. `gulp`

5. `cp petfeedd.conf.example petfeedd.conf`

6. Edit `petfeedd.conf` to your liking.

### Install The Systemd Service

1. `useradd -d /path/to/your/checkout -G gpio petfeedd`

2. `cp init/systemd/petfeedd.service /etc/systemd/system`

3. `systemctl daemon-reload`

4. `systemctl start petfeedd`

Be patient, it can take some time to start up. On my Raspberry Pi 3 Model B
version 1.2, it takes about 10 seconds. You can `tail -f /var/log/syslog` for
when it is up and operational. Then you should be able to open a Browser and
configure your feeds.

## API

petfeedd exposes a web API that can be used to build third-party clients. The
API is REST/JSON.

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

## License

GPLv3
