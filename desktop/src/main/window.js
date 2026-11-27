const { BrowserWindow, shell } = require('electron')
const { isExternal, isSameOrigin } = require('./links')

// Flask serves the built frontend by default. DADS_URL can point to a dev server.
const APP_URL = process.env.DADS_URL || 'http://127.0.0.1:5000/'
const appOrigin = new URL(APP_URL).origin

// Opens the main DynaBase window, routes links, and loads the app
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
    if (isExternal(url, appOrigin)) {
      shell.openExternal(url)
    } else if (isSameOrigin(url, appOrigin)) {
      win.loadURL(url)
    }
    return { action: 'deny' }
  })

  // Plain links to other sites (e.g. the GitHub button) would otherwise
  // navigate this window away from the app
  win.webContents.on('will-navigate', (event, url) => {
    if (isExternal(url, appOrigin)) {
      event.preventDefault()
      shell.openExternal(url)
    }
  })

  win.loadURL(APP_URL)
}

module.exports = { createWindow }
