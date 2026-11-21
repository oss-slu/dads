#!/bin/sh
# exits right away, like a backend that crashes on startup
echo "starting fake backend"
echo "Database connection error: fake" >&2
exit 3
