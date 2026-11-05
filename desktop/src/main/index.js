const { app, BrowserWindow } = require('electron')
const { createWindow } = require('./window')

app.whenReady().then(() => {
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
