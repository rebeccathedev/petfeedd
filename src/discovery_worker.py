import socket
import logging

from worker import Worker

# This class implements a basic auto-discovery protocol. Basically, clients can
# send a broadcast UDP packet on port 11213 and we'll reply with some
# information about ourselves so they can configure themselves to access us.
class DiscoveryWorker(Worker):

    # The constructor.
    def __init__(self, config, *args, **kwargs):
        self.config = config
        super().__init__(*args, **kwargs)

    # Main run method.
    def run(self):
        logging.getLogger('petfeedd').info("Starting auto discovery worker.")

        # Create a socket with a 1 second timeout and bind it to the correct
        # port.
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sock.bind(("", 11213))
        self.sock.settimeout(1)

        while True:

            # If we've been requested to exit, exit.
            if self.stopped():
                return

            # Try to get some data. If we hit the timeout or another error, try
            # again.
            try:
                data, address = self.sock.recvfrom(1024)
            except socket.error:
                continue

            # If we got data, reply with information about us.
            if data:
                logging.getLogger('petfeedd').info("Discovery request received from " + address[0])
                info_string = "petfeedd\nHEAD\n" + self.config["web"]["bind_port"]
                sent = self.sock.sendto(info_string.encode(), address)

    # Causes the socket to close and the thread to gracefully end.
    def end(self):
        logging.getLogger('petfeedd').info("Stopping auto discovery worker.")
        self.sock.close()
        return super(DiscoveryWorker, self).end()
