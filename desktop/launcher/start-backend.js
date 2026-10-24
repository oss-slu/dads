// Starts the Flask backend without Electron, handy for debugging backend.js.
// Usage: node desktop/launcher/start-backend.js
// Set PYTHON to pick the interpreter (defaults to "python").

const { startBackend, stopBackend } = require('../src/main/backend');

const shutdown = () => {
    console.log('stopping backend');
    stopBackend();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startBackend().catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
    stopBackend();
});
