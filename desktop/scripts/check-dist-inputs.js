const fs = require('fs')
const path = require('path')
const { BACKEND_EXECUTABLE } = require('../src/main/backend')

if (!['darwin', 'win32'].includes(process.platform)) {
  console.error('Build the DynaBase installer on macOS or Windows.')
  process.exit(1)
}

const desktopDir = path.join(__dirname, '..')
const inputs = [
  [`build/backend/dads-backend/${BACKEND_EXECUTABLE}`, 'npm run build:backend in desktop/'],
  ['../Frontend/build/index.html', 'npm run build:frontend in desktop/'],
  ['../data/exports/dads.sqlite', 'python scripts/build_sqlite.py from the repository root']
]

for (const [file, command] of inputs) {
  if (!fs.existsSync(path.resolve(desktopDir, file))) {
    console.error(`Missing ${file}. Run ${command}.`)
    process.exitCode = 1
  }
}
