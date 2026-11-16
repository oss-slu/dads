# DynaBase Desktop

A minimal [Electron](https://www.electronjs.org/) shell that opens the DynaBase web app in a native window. It starts the Python backend itself, waits until the backend can reach the database, and only then opens the window. The React app is loaded by URL, the same way a browser tab does, and is not bundled or changed.

## Run order

Start these in order, each in its own terminal:

1. **Database**: make sure your PostgreSQL database is running and `Backend/database.ini` points at it (see the [Installation Guide](../Installation_Guide.md)). The Python dependencies need to be installed too.
2. **Frontend** (React dev server on http://localhost:3000):
   ```
   cd Frontend
   npm start
   ```
3. **Desktop**:
   ```
   cd desktop
   npm install
   npm start
   ```

You don't need to run `python server.py` yourself. The desktop app runs it, waits until `http://127.0.0.1:5000/health` answers with `"db": true`, and then opens a window titled "DynaBase" with the About page. When you quit the app, it stops the backend and waits for it to exit.

## Picking the Python interpreter

The backend is started with `python` by default. On macOS that is usually not the one you want, so set `PYTHON` to `python3` or to your virtualenv's python:

```
# bash / macOS / Linux
PYTHON=python3 npm start
PYTHON=../venv/bin/python npm start

# PowerShell
$env:PYTHON='..\venv\Scripts\python.exe'; npm start
```

## If the backend doesn't start

If the backend isn't ready within 20 seconds, or exits before it is ready, the app shows an error with the last 20 lines of backend output and quits instead of opening a blank window. Common causes are the database not running, a wrong `PYTHON`, or another program already using port 5000 (on macOS, AirPlay Receiver can, see System Settings).

Everything the backend prints is also written to `backend.log`, and the error shows the full path. It is overwritten each time the app starts.

| OS | Log file |
| --- | --- |
| macOS | `~/Library/Logs/dynabase-desktop/backend.log` |
| Windows | `%APPDATA%\dynabase-desktop\logs\backend.log` |
| Linux | `~/.config/dynabase-desktop/logs/backend.log` |

## Backend launcher

`launcher/start-backend.js` starts and stops the backend the same way the app does, but without Electron. It is handy for debugging the backend startup:

```
node desktop/launcher/start-backend.js
PYTHON=python3 node desktop/launcher/start-backend.js
```

It prints the backend's output with a `[backend]` prefix and `backend ready after N ms` once `/health` reports the database is reachable. Ctrl+C stops the backend and waits for it to exit.

Polling `/health` is more reliable than sleeping for a fixed few seconds. Startup time varies with the machine and with how long the database takes to connect, so a fixed delay is either too short and races the backend or too long and wastes time on every launch.

## Loading a different URL

By default the window loads `http://localhost:3000`. Set `DADS_URL` to load something else:

```
# bash / macOS / Linux
DADS_URL=http://127.0.0.1:5000 npm start

# PowerShell
$env:DADS_URL='http://127.0.0.1:5000'; npm start
```

## Links

Links to other sites, such as lmfdb.org or the GitHub button, open in your normal browser instead of a new Electron window. Links to other pages of the app stay inside the app.

## Tests

The link helpers in `src/main/links.js` and the backend start/stop code in `src/main/backend.js` have unit tests that run with Node's built-in test runner (no Electron needed):

```
cd desktop
npm test
```

The backend tests don't run the real backend. They point `PYTHON` at small shell scripts in `test/fake-backends` that sleep, ignore the stop signal, or exit right away, so they are skipped on Windows.

## Limitations

- The app only checks that *something* on port 5000 answers `/health` with `"db": true`, not that it is our backend. If another copy of the backend is already running, the app may connect to that one instead of the one it started.
- The port is fixed at 5000 because the React dev server calls the backend there.
