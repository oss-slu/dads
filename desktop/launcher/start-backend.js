// Starts the Flask backend, waits until it answers requests, and shuts it down on exit.
// Usage: node desktop/launcher/start-backend.js
// Set PYTHON to pick the interpreter (defaults to "python").

const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const PYTHON = process.env.PYTHON || 'python';
const BACKEND_DIR = path.join(__dirname, '..', '..', 'Backend');
const READY_URL = 'http://127.0.0.1:5000/get_all_families';
const POLL_INTERVAL = 250;
const READY_TIMEOUT = 20000;

let shuttingDown = false;
let exitCode = 0;
let pollTimer = null;

const startTime = Date.now();

const child = spawn(PYTHON, ['server.py'], {
    cwd: BACKEND_DIR,
    env: { ...process.env, PYTHONUNBUFFERED: '1' },
    stdio: ['ignore', 'pipe', 'pipe']
});

// prefix each line of backend output so it is easy to tell apart from ours
const forward = (stream, write) => {
    let buffer = '';
    stream.on('data', (chunk) => {
        buffer += chunk;
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop();
        lines.forEach((line) => write(`[backend] ${line}`));
    });
    stream.on('end', () => {
        if (buffer) write(`[backend] ${buffer}`);
    });
};

forward(child.stdout, (line) => console.log(line));
forward(child.stderr, (line) => console.error(line));

child.on('error', (err) => {
    console.error(`failed to start backend with ${PYTHON}: ${err.message}`);
    process.exit(1);
});

child.on('exit', (code, signal) => {
    clearInterval(pollTimer);
    if (shuttingDown) {
        process.exit(exitCode);
    }
    console.error(`backend exited on its own (code ${code}, signal ${signal})`);
    process.exit(code || 1);
});

// kill the backend and exit with the given code once it is really gone
const stop = (code) => {
    if (shuttingDown) return;
    shuttingDown = true;
    exitCode = code;
    clearInterval(pollTimer);
    if (child.exitCode !== null) {
        process.exit(code);
    }
    child.kill();
};

const shutdown = () => {
    console.log('stopping backend');
    stop(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

const checkReady = () => {
    const req = http.get(READY_URL, (res) => {
        res.resume();
        if (res.statusCode === 200) {
            clearInterval(pollTimer);
            console.log(`backend ready after ${Date.now() - startTime} ms`);
        }
    });
    req.on('error', () => {});
    req.setTimeout(POLL_INTERVAL, () => req.destroy());
};

pollTimer = setInterval(() => {
    if (Date.now() - startTime > READY_TIMEOUT) {
        clearInterval(pollTimer);
        console.error(`backend not ready after ${READY_TIMEOUT} ms, giving up`);
        stop(1);
        return;
    }
    checkReady();
}, POLL_INTERVAL);
