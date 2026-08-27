# petfeedd Configuration

[README](../README.md) · [Installation](INSTALL.md) · **Configuration** · [API](API.md) · [Discovery](DISCOVERY.md) · [FAQ](FAQ.md)

A major change from previous versions of petfeedd are that the new node-based
petfeedd's configuration is entirely editable from the web interface and
entirely stored in the database.

Node petfeedd will attempt to read `petfeedd.conf` and migrate the settings to
the database. However, this functionality **should not be relied on.** You may
have to reconfigure some or all of your feeder when you migrate.

## Docker Configuration

### A Note on Timezones

Timezones inside the Docker container are independent of timezones on the
device. Unless you want to use UTC for your feeders, you will need to set the
`TZ` environment variable to a valid timezone.

```
$ docker run --privileged -e TZ=America/Chicago -v /opt/petfeedd.db:/opt/petfeedd.db -p 0.0.0.0:8080:8080 ghcr.io/rebeccathedev/petfeedd:latest
```

### Restarting Automatically

**IMPORTANT**: By default, the examples above will not restart automatically.
You probably want to set a restart policy when you start petfeedd using docker.
Otherwise, your cats will likely be very angry with you.

So, a complete example of running petfeedd using Docker would be something like:

```
$ docker run -d --restart always --privileged -e TZ=America/Chicago -v /opt/petfeedd.db:/opt/petfeedd.db -v /etc/petfeedd.conf:/etc/petfeedd.conf -p 0.0.0.0:8080:8080 ghcr.io/rebeccathedev/petfeedd:latest
```

### Using Docker Compose

Once the command gets that large, you may prefer Docker Compose for a reusable
configuration.

Install Docker Engine with the Compose plugin by following the
[official Docker instructions](https://docs.docker.com/engine/install/).

Here is an example `docker-compose.yml` file representing the above command.

```yml
services:
    petfeedd:
        privileged: true
        image: ghcr.io/rebeccathedev/petfeedd:latest
        restart: always
        volumes:
         - /opt/petfeedd.db:/opt/petfeedd.db
         - /etc/petfeedd.conf:/etc/petfeedd.conf
        ports:
         - 0.0.0.0:8080:8080
        environment:
         - TZ=America/Chicago
```

Now you can just run:

```
$ docker compose up -d
```

For initial setup and supported CPU architectures, see [Installation](INSTALL.md). For programmatic settings, see the [API reference](API.md#settings).

---

[README](../README.md) · [Installation](INSTALL.md) · **Configuration** · [API](API.md) · [Discovery](DISCOVERY.md) · [FAQ](FAQ.md)
