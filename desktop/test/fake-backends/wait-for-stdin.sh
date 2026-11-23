#!/bin/sh
printf 'cwd=%s\nargs=%s\nstatic=%s\nsqlite=%s\n' \
  "$PWD" "$#" "$DADS_STATIC_DIR" "$DADS_SQLITE_PATH"
cat > /dev/null
echo 'stdin closed'
