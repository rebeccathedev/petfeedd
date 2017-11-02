import threading

# A Worker parent class that holds some common methods.
class Worker(threading.Thread):

    # Instead of callign start, we call begin(). This allows us to set the
    # stop event and returns self, saving us a few lines of code elsewhere.
    def begin(self):
        self._stop_event = threading.Event()
        self.start()
        return self

    # Sets the end event, causing the thread to gracefully exit.
    def end(self):
        self._stop_event.set()

    # Checks to see if the thread has been requested to shut down.
    def stopped(self):
        return self._stop_event.is_set()
