# petfeedd

## About

petfeedd is a daemon for Raspberry Pi that will feed your pets. :)

Well, okay, obviously, it won't physically feed your pets. You'll still have to build the hardware part of the feeder. But it aims to wrap up the common functionality that pet feeders require into a format that can be reused for any number of feeder designs.

petfeedd provides:

* A web interface for "programming" your feeder, that allows an arbitrary number of feeds of an arbitrary size.

* A RESTful API that can be used to write third-party clients.

* An auto-discovery protocol that can be used to find feeders on your network. Useful for writing third party clients.

petfeedd is implemented predominently in Python 3 using Flask and Peewee, with Vue.js and Bootstrap used for the web interface.
