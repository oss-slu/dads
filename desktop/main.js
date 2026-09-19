const { app, BrowserWindow, shell } = require('electron')

// 3000 is the React dev server; DADS_URL lets us point the window somewhere else
const APP_URL = process.env.DADS_URL || 'http://localhost:3000'
const appOrigin = new URL(APP_URL).origin

// True for http(s) links that leave the app, e.g. lmfdb.org or github.com
function isExternal (url) {
  try {
    const { protocol, origin } = new URL(url)
    return (protocol === 'http:' || protocol === 'https:') && origin !== appOrigin
  } catch {
    return false
  }
}

function isSameOrigin (url) {
  try {
    return new URL(url).origin === appOrigin
  } catch {
    return false
  }
}

function createWindow () {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    title: 'DynaBase'
  })

  // Keep the window title instead of switching to the page's <title>
  win.on('page-title-updated', (event) => event.preventDefault())

  // target="_blank" links: external sites go to the user's browser,
  // app pages (e.g. twist links) load in this window instead of a new one
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (isExternal(url)) {
      shell.openExternal(url)
    } else if (isSameOrigin(url)) {
      win.loadURL(url)
    }
    return { action: 'deny' }
  })

  // Plain links to other sites (e.g. the GitHub button) would otherwise
  // navigate this window away from the app
  win.webContents.on('will-navigate', (event, url) => {
    if (isExternal(url)) {
      event.preventDefault()
      shell.openExternal(url)
    }
  })

  win.loadURL(APP_URL)
}

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
