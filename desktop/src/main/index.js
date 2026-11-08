const path = require('path')
const { app, BrowserWindow, dialog } = require('electron')
const { createWindow } = require('./window')
const { startBackend, stopBackend } = require('./backend')

let quitting = false
let backendStopped = false

const lastOutput = (lines) => lines && lines.length ? lines.join('\n') : '(no output)'

app.whenReady().then(async () => {
  const logFile = path.join(app.getPath('logs'), 'backend.log')

  // A backend that stops while the app is open leaves every page without data,
  // so say so and quit. A normal quit stops it too, that is not an error.
  const onExit = (code, signal, output) => {
    if (quitting) return
    dialog.showErrorBox(
      'The DynaBase backend stopped',
      `backend exited (code ${code}, signal ${signal})\n\nLast backend output:\n${lastOutput(output)}\n\nFull log: ${logFile}`
    )
    // the backend is already gone, so there is nothing to wait for
    app.exit(1)
  }

  // Only open the window once the backend can answer, never a blank page
  try {
    await startBackend({ logFile, onExit })
  } catch (err) {
    // quitting stops the backend before it is ready, that is not an error
    if (quitting) return
    // stop it first so a backend that missed the timeout doesn't keep running
    // behind the dialog
    await stopBackend()
    dialog.showErrorBox(
      'DynaBase could not start the backend',
      `${err.message}\n\nLast backend output:\n${lastOutput(err.output)}\n\nFull log: ${logFile}`
    )
    // Electron ignores process.exitCode, so exit with 1 ourselves
    app.exit(1)
    return
  }

  if (quitting) return
  createWindow()

  // macOS: re-create a window when the dock icon is clicked and none are open
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS where apps stay open
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// Hold the quit until the backend has exited, then quit for real
app.on('before-quit', (event) => {
  quitting = true
  if (backendStopped) return
  event.preventDefault()
  stopBackend().then(() => {
    backendStopped = true
    // quit on the next tick: calling app.quit() while Electron is still in
    // the first before-quit is ignored when stopBackend() resolves right away
    setImmediate(() => app.quit())
  })
})

// Ctrl+C or a plain kill should go through the same quit path
process.on('SIGINT', () => app.quit())
process.on('SIGTERM', () => app.quit())
