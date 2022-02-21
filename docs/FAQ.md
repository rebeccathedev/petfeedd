# petfeedd FAQ

## Security

### Why doesn't petfeedd implement usernames or API keys?

Because it is beyond the scope of the project. Implementing usernames, passwords
and API keys adds too much additional complexity to the project for use cases
that are tiny in number. It simply isn't worth it.

The goal of this project is to produce a pet feeder for home use. It is
explicitly **not** designed to be connected to the Internet, and it assumes that
the end user will have the pet feeder connected to their home network, which
itself is protected by a router or firewall. If you can't trust the people and
devices on your home network, you have much, much larger problems. :)

### I still want username and passwords. Can you implement them?

Again, implementing usernames, passwords and API keys in the petfeedd code is an
explicit non-goal of this project and will not be added to the core
functionality of the feeder.

However, should you really wish to do this, my suggested approach is to place
petfeedd behind a reverse proxy like nginx. For example you could use a config
something like this:

```shell
$ sudo apt-get install apache2-utils
$ sudo htpasswd -c /etc/nginx/.htpasswd user1
```

And then configure nginx like this:

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    root /var/www/html;
    server_name _;

	location / {
		proxy_pass http://localhost:8080;
        auth_basic "petfeedd";
        auth_basic_user_file /etc/nginx/.htpasswd;
	}
}
```

Optionally, you could configure iptables to block connections to petfeedd so
that only connections that go through the nginx proxy will work.

```shell
$ sudo iptables -A INPUT -p tcp --destination-port 8080 -j DROP
```

## Troubleshooting

### I am seeing GPIO initialization errors. How do I fix them?

If your feeder isn't working and you are seeing things like the following in the
logs:

```
2022-02-09 09:05:02 initMboxBlock: init mbox zaps failed
[2022-02-09T09:05:02.106] [ERROR] Feeder - Could not enable GPIO.
[2022-02-09T09:05:02.106] [ERROR] Feeder - Error: pigpio error -1 in gpioInitialise
    at initializePigpio (/usr/src/app/node_modules/pigpio/pigpio.js:54:12)
    at new Gpio (/usr/src/app/node_modules/pigpio/pigpio.js:158:5)
    at Feeder.feed (/usr/src/app/Core/Feeder.js:1:842)
[2022-02-09T09:05:02.110] [WARN] Feeder - Feed was unsuccessful.

```

The issue is related to memory usage and some odd behavior of one of the
underlying libraries used by petfeedd. Somewhat counterintuitively, more *GPU*
memory is needed. Fortunately, this is a relatively straightforward fix:

```
$ sudo raspi-config
```

Navigate to Performance Options -> GPU memory and bump it up some. I am running
128 on my feeders. Save and reboot.

## The Version 1.0 Rewrite

### Why did you rewrite petfeedd in Node?

To be completely honest, because I don't really like Python that much. I find it
to be a clunky language with an annoyingly inconsistent syntax. And because of
the Python 2/3 breaking changes, finding help for issues is a regular WTF of "is
this a Python 2 or 3 solution." Performance is fairly poor on many of these
low-powered boards. The whole mess that is virtualenv/pipenv. There's just a
lot about it that I don't really like.

The only reason I wrote the original petfeedd in Python is because, at the time,
it had the best support for GPIO on the Raspberry Pi in a high-level lanugage.
In the meantime, there is now better support for GPIO is other languages.

This is not to say I particularly *like* Javascript either. [It has it's own
fair share of problems](https://www.destroyallsoftware.com/talks/wat). But being
that it is a language I work with regularly, I am at least aware of most of the
pain points instead of having to stumble blindly into them. Being able to have
the same language on the front end and back end is a real time saver. And, it
has dramatically better performance.

I guess that's a really long way of saying: because I wanted to. :)

### What about the 0.2 version

I have deleted the code for the 0.2 version, as it is in the same repository as
this one, and I do not intend to continue to develop it further. However, I am
leaving the docker images up for the time being if you want to continue using
the 0.2 version. I *may* remove them at some point in the future, but I will
give warning before I do.

* `docker pull peckrob/petfeedd-arm32v7` - Raspberry Pi 2/2B/3/3B
* `docker pull peckrob/petfeedd-arm32v6` - Raspperry Pi/Zero
* `docker pull peckrob/petfeedd-amd64` - Intel x86

You are welcome to fork the repo and revert the deletes if you want to continue
to use the Python code from source. But it should be with the clear
understanding that doing so is **entirely unsupported** (like, I will delete
tickets relating to it.)

### Should I upgrade?

That is up to you! If petfeedd 0.2 is working for you and you don't want or need
any of the new features, there is no need for you to upgrade and you are free to
keep using it. But all development going forward is on the new Node version.
