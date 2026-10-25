// Starts the Flask backend without Electron, handy for debugging backend.js.
// Usage: node desktop/launcher/start-backend.js
// Set PYTHON to pick the interpreter (defaults to "python").

const { startBackend, stopBackend } = require('../src/main/backend');

let stopping = false;

const shutdown = () => {
    console.log('stopping backend');
    stopping = true;
    stopBackend();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// if the backend dies on its own after it was ready, exit non-zero
const onExit = (code) => {
    if (!stopping) process.exitCode = code || 1;
};

startBackend({ onExit }).catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
    stopBackend();
});
