#!/bin/sh
rm -rf /var/run/pigpio.pid
/usr/bin/node /usr/src/app/index.js -d /opt/petfeedd.db
