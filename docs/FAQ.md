# petfeedd FAQ

## Why did you rewrite petfeedd in Node?

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

## What about the 0.2 version

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

## Should I upgrade?

That is up to you! If petfeedd 0.2 is working for you and you don't want or need
any of the new features, there is no need for you to upgrade and you are free to
keep using it. But all development going forward is on the new Node version.
