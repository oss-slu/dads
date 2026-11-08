#!/bin/sh
# runs for a second, then exits, like a backend that crashes while the app is open
echo "starting fake backend"
sleep 1
echo "fake backend crashed" >&2
exit 2
