const path = require('path')
const { app, BrowserWindow, dialog } = require('electron')
const { createWindow } = require('./window')
const { startBackend, stopBackend } = require('./backend')

let quitting = false
let backendStopped = false

app.whenReady().then(async () => {
  const logFile = path.join(app.getPath('logs'), 'backend.log')

  // Only open the window once the backend can answer, never a blank page
  try {
    await startBackend({ logFile })
  } catch (err) {
    // quitting stops the backend before it is ready, that is not an error
    if (quitting) return
    const output = err.output.length ? err.output.join('\n') : '(no output)'
    dialog.showErrorBox(
      'DynaBase could not start the backend',
      `${err.message}\n\nLast backend output:\n${output}\n\nFull log: ${logFile}`
    )
    // Electron ignores process.exitCode, so exit with 1 ourselves
    await stopBackend()
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
    app.quit()
  })
})

// Ctrl+C or a plain kill should go through the same quit path
process.on('SIGINT', () => app.quit())
process.on('SIGTERM', () => app.quit())
