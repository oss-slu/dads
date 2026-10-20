const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const { isExternal, isSameOrigin } = require('../src/main/links')

const appOrigin = 'http://localhost:3000'

// [url, isExternal, isSameOrigin]
// internal = stays in the window, external = handed to shell.openExternal,
// neither = ignored (the window does not navigate and nothing is opened)
const cases = [
  // internal: app pages, including trailing slash, query string and fragment
  ['http://localhost:3000/system/11', false, true],
  ['http://localhost:3000', false, true],
  ['http://localhost:3000/', false, true],
  ['http://localhost:3000/system/11/', false, true],
  ['http://localhost:3000/systems?degree=2', false, true],
  ['http://localhost:3000/system/11#models', false, true],
  ['http://LOCALHOST:3000/system/11', false, true],

  // external: other sites, or same host on another port or scheme
  ['https://www.lmfdb.org/NumberField/1.1.1.1', true, false],
  ['https://github.com/oss-slu/dads', true, false],
  ['http://localhost:5000/', true, false],
  ['https://localhost:3000/', true, false],

  // neither: non-http(s) schemes must never reach shell.openExternal
  ['mailto:x@y.z', false, false],
  ['file:///etc/passwd', false, false],
  ['javascript:alert(1)', false, false],
  ['data:text/html,hi', false, false],
  ['about:blank', false, false],

  // neither: garbage input must not throw
  ['', false, false],
  ['not a url', false, false],
  ['/system/11', false, false],
  [undefined, false, false],
  [null, false, false],

  // The broken Rational Twists link. Parsed on its own, `http:/system/11`
  // becomes http://system/11 (host "system"), so it counts as external.
  // In the app this string never reaches the helpers: Chromium resolves the
  // href against the current http: page first (see the test below).
  ['http:/system/11', true, false]
]

describe('link helpers', () => {
  for (const [url, external, sameOrigin] of cases) {
    it(`${JSON.stringify(url)} -> ${external ? 'external' : sameOrigin ? 'internal' : 'neither'}`, () => {
      assert.equal(isExternal(url, appOrigin), external)
      assert.equal(isSameOrigin(url, appOrigin), sameOrigin)
    })
  }

  it('the broken twist link resolves to an app page when clicked inside the app', () => {
    const resolved = new URL('http:/system/11', 'http://localhost:3000/rational_twists/5').href
    assert.equal(resolved, 'http://localhost:3000/system/11')
    assert.equal(isExternal(resolved, appOrigin), false)
    assert.equal(isSameOrigin(resolved, appOrigin), true)
  })

  it('never treats a link as both external and internal', () => {
    for (const [url] of cases) {
      assert.ok(!(isExternal(url, appOrigin) && isSameOrigin(url, appOrigin)), String(url))
    }
  })

  it('uses the origin it is given, not a hard-coded one', () => {
    const otherOrigin = 'http://127.0.0.1:5000'
    assert.equal(isSameOrigin('http://127.0.0.1:5000/system/11', otherOrigin), true)
    assert.equal(isExternal('http://127.0.0.1:5000/system/11', otherOrigin), false)
    assert.equal(isExternal('http://localhost:3000/system/11', otherOrigin), true)
  })
})
