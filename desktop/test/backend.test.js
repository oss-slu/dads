const { describe, it, afterEach } = require('node:test')
const assert = require('node:assert/strict')
const path = require('path')
const { startBackend, stopBackend } = require('../src/main/backend')

// Instead of the real backend, PYTHON points at tiny shell scripts that
// ignore the `server.py` argument and just sleep, ignore SIGTERM, or exit
const fake = (name) => path.join(__dirname, 'fake-backends', name)

// nothing listens here, so a real backend on port 5000 can't make a fake one look ready
const NO_BACKEND = 'http://127.0.0.1:9/health'
const start = (options) => startBackend({ healthUrl: NO_BACKEND, ...options })

// keep whatever PYTHON the tests were run with
const originalPython = process.env.PYTHON

// give the script a moment to start (and set its trap) before stopping it
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

describe('backend', { skip: process.platform === 'win32' && 'fake backends are sh scripts' }, () => {
  afterEach(async () => {
    await stopBackend()
    if (originalPython === undefined) {
      delete process.env.PYTHON
    } else {
      process.env.PYTHON = originalPython
    }
  })

  it('stopBackend() stops a backend that never gets ready', async () => {
    process.env.PYTHON = fake('sleep-forever.sh')
    const started = start()
    await wait(300)

    await stopBackend()
    await assert.rejects(started, /exited before it was ready.*signal SIGTERM/)
  })

  it('stopBackend() uses SIGKILL when the backend ignores SIGTERM', async () => {
    process.env.PYTHON = fake('ignore-term.sh')
    const started = start()
    await wait(300)

    const stopTime = Date.now()
    await stopBackend()
    const elapsed = Date.now() - stopTime

    assert.ok(elapsed >= 5000, `stopped after ${elapsed} ms, expected at least 5000`)
    await assert.rejects(started, /signal SIGKILL/)
  })

  it('startBackend() rejects when the backend exits early', async () => {
    process.env.PYTHON = fake('exit-early.sh')
    await assert.rejects(start(), /exited before it was ready \(code 3/)
  })

  it('startBackend() rejects when the interpreter does not exist', async () => {
    process.env.PYTHON = '/nonexistent'
    await assert.rejects(start(), /failed to start backend with \/nonexistent/)
  })

  it('startBackend() rejects when the backend is not ready in time', async () => {
    process.env.PYTHON = fake('sleep-forever.sh')
    await assert.rejects(start({ timeout: 500 }), /not ready after 500 ms/)
  })

  it('stopBackend() resolves when the backend already exited', async () => {
    process.env.PYTHON = fake('exit-early.sh')
    await assert.rejects(start())
    await stopBackend()
  })
})
