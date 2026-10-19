// Link helpers for the desktop window. Kept free of `require('electron')`
// so they can be unit tested with plain Node.

// True for http(s) links that leave the app, e.g. lmfdb.org or github.com
function isExternal (url, appOrigin) {
  try {
    const { protocol, origin } = new URL(url)
    return (protocol === 'http:' || protocol === 'https:') && origin !== appOrigin
  } catch {
    return false
  }
}

// True if the URL points at the app itself (same origin as appOrigin)
function isSameOrigin (url, appOrigin) {
  try {
    return new URL(url).origin === appOrigin
  } catch {
    return false
  }
}

module.exports = { isExternal, isSameOrigin }
