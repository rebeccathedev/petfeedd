import threading
import socket

class DiscoveryWorker(threading.Thread):

    def __init__(self, config, *args, **kwargs):
        self.config = config
        super().__init__(*args, **kwargs)

    def run(self):
        print("Starting auto discovery worker.")

        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.bind(("", 11213))

        while True:
            data, address = sock.recvfrom(1024)

            if data:
                print("Discovery request received from " + address[0])
                info_string = "petfeedd\nHEAD\n" + self.config["web"]["bind_port"]
                sent = sock.sendto(info_string.encode(), address)
