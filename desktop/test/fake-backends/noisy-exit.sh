#!/bin/sh
# prints more lines than the error dialog keeps, then exits
for i in $(seq 1 30); do echo "line $i"; done
exit 1
