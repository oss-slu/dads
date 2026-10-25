#!/bin/sh
# ignores the normal stop signal, so stopBackend() has to use SIGKILL
trap "" TERM
while true; do sleep 1; done
