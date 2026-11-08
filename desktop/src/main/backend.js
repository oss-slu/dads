// Starts the Flask backend, waits until /health says it can reach the database,
// and stops it again when the app quits. Kept free of `require('electron')`
// so it can be unit tested with plain Node.

const path = require('path')
const http = require('http')
const { spawn } = require('child_process')

const BACKEND_DIR = path.join(__dirname, '..', '..', '..', 'Backend')
// 127.0.0.1, not localhost: on macOS AirPlay also listens on port 5000
const HEALTH_URL = 'http://127.0.0.1:5000/health'
const POLL_INTERVAL = 250
const READY_TIMEOUT = 20000
const KILL_TIMEOUT = 5000

let child = null

// prefix each line of backend output so it is easy to tell apart from ours
function forward (stream, write) {
  let buffer = ''
  stream.on('data', (chunk) => {
    buffer += chunk
    const lines = buffer.split(/\r?\n/)
    buffer = lines.pop()
    lines.forEach((line) => write(`[backend] ${line}`))
  })
  stream.on('end', () => {
    if (buffer) write(`[backend] ${buffer}`)
  })
}

// Resolves true only when the health URL answers 200 with "db": true.
// agent: false opens a new connection each time; with keep-alive, a socket that
// reached AirPlay before Flask was listening would be reused for every poll.
function checkHealth (healthUrl) {
  return new Promise((resolve) => {
    const req = http.get(healthUrl, { agent: false }, (res) => {
      let body = ''
      res.setEncoding('utf8')
      res.on('data', (chunk) => { body += chunk })
      res.on('end', () => {
        try {
          resolve(res.statusCode === 200 && JSON.parse(body).db === true)
        } catch {
          resolve(false)
        }
      })
    })
    req.on('error', () => resolve(false))
    req.setTimeout(POLL_INTERVAL, () => req.destroy())
  })
}

// Runs `python server.py` and resolves once the backend is ready. Rejects if it
// is not ready within `timeout` ms or exits first. `onExit` is called if the backend
// exits after it was ready. Set PYTHON to pick the interpreter.
function startBackend ({ timeout = READY_TIMEOUT, healthUrl = HEALTH_URL, onExit } = {}) {
  const python = process.env.PYTHON || 'python'
  const startTime = Date.now()

  return new Promise((resolve, reject) => {
    let ready = false
    let failed = false
    let pollTimer = null

    const markReady = () => {
      if (ready || failed) return
      ready = true
      clearInterval(pollTimer)
      console.log(`backend ready after ${Date.now() - startTime} ms`)
      resolve()
    }

    const fail = (message) => {
      if (ready || failed) return
      failed = true
      clearInterval(pollTimer)
      reject(new Error(message))
    }

    // stdin stays open so the backend can tell when we are gone (see server.py)
    const proc = spawn(python, ['server.py'], {
      cwd: BACKEND_DIR,
      env: { ...process.env, PYTHONUNBUFFERED: '1', DADS_WATCH_STDIN: '1' },
      stdio: ['pipe', 'pipe', 'pipe']
    })
    child = proc

    forward(proc.stdout, (line) => console.log(line))
    forward(proc.stderr, (line) => console.error(line))

    proc.on('error', (err) => {
      fail(`failed to start backend with ${python}: ${err.message}`)
    })

    proc.on('exit', (code, signal) => {
      if (ready) {
        console.log(`backend exited (code ${code}, signal ${signal})`)
        if (onExit) onExit(code, signal)
      } else {
        fail(`backend exited before it was ready (code ${code}, signal ${signal})`)
      }
    })

    pollTimer = setInterval(() => {
      if (Date.now() - startTime > timeout) {
        fail(`backend not ready after ${timeout} ms`)
        return
      }
      checkHealth(healthUrl).then((ok) => {
        if (ok) markReady()
      })
    }, POLL_INTERVAL)
  })
}

// Asks the backend to stop and resolves once the process has actually exited.
// If it is still running KILL_TIMEOUT ms later, it is killed with SIGKILL.
function stopBackend () {
  const proc = child
  if (!proc || !proc.pid || proc.exitCode !== null || proc.signalCode !== null) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const killTimer = setTimeout(() => {
      console.error(`backend still running ${KILL_TIMEOUT} ms after stop, killing it`)
      proc.kill('SIGKILL')
    }, KILL_TIMEOUT)

    proc.once('exit', () => {
      clearTimeout(killTimer)
      resolve()
    })
    proc.kill()
  })
}

module.exports = { startBackend, stopBackend }
