const path = require('path')
const { spawnSync } = require('child_process')

const frontendDir = path.join(__dirname, '..', '..', 'Frontend')
const reactScripts = require.resolve('react-scripts/bin/react-scripts.js', { paths: [frontendDir] })
const build = spawnSync(process.execPath, [reactScripts, 'build'], {
  cwd: frontendDir,
  env: { ...process.env, REACT_APP_API_URL: '' },
  stdio: 'inherit'
})

if (build.error) throw build.error
process.exitCode = build.status ?? 1
