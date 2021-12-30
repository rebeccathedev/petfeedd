# petfeedd Configuration

A major change from previous versions of petfeedd are that the new node-based
petfeedd's configuration is entirely editable from the web interface and
entirely stored in the database.

Node petfeedd will attempt to read `petfeedd.conf` and migrate the settings to
the database. However, this functionality **should not be relied on.** You may
have to reconfigure some or all of your feeder when you migrate.

## Docker Configuration

### A Note on Timezones

Timezones inside the Docker container are independent of timezones on the
device. Assuming you have run `sudo raspi-config` and set the timezone properly,
unless you want to use UTC for your feeders you will need to bring
`/etc/localtime` into the container.

```
$ docker run --privileged -v /etc/localtime:/etc/localtime -v /opt/petfeedd.db:/petfeedd/petfeedd.db -p 0.0.0.0:8080:8080 peckrob/petfeedd
```

### Restarting Automatically

**IMPORTANT**: By default, the examples above will not restart automatically.
You probably want to set a restart policy when you start petfeedd using docker.
Otherwise, your cats will likely be very angry with you.

So, a complete example of running petfeedd using Docker would be something like:

```
$ docker run -d --restart always --privileged -v /etc/localtime:/etc/localtime -v /opt/petfeedd.db:/petfeedd/petfeedd.db -v /etc/petfeedd.conf:/petfeedd/petfeedd.conf -p 0.0.0.0:8080:8080 -p 0.0.0.0:11211:11211 peckrob/petfeedd
```

### Using Docker Compose

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
        image: peckrob/petfeedd
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
