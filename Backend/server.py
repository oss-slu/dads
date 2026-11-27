"""
Module Dcstring: This file manages interactions
between frontend and backend
"""

import os
import sys
import signal
import threading

from dads.app import create_app
from static_site import register_static

app = create_app()


# exits once stdin closes, so the backend does not outlive the desktop app
def watch_stdin():
    sys.stdin.read()
    os.kill(os.getpid(), signal.SIGTERM)


static_dir = os.environ.get("DADS_STATIC_DIR")
if static_dir:
    register_static(app, static_dir)


if __name__ == '__main__':
    if os.environ.get("DADS_WATCH_STDIN") and sys.stdin:
        threading.Thread(target=watch_stdin, daemon=True).start()
    app.run()
