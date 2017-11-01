import threading
import socket

class DiscoveryWorker(threading.Thread):

    def run(self):
        print("Starting auto discovery worker.")

        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.bind(("", 11213))

        while True:
            data, address = sock.recvfrom(1024)

            if data:
                print("Discovery request received from " + address[0])
                sent = sock.sendto(b"petfeedd\nHEAD\n8080", address)
