# DynaBase Desktop

A minimal [Electron](https://www.electronjs.org/) shell that opens the DynaBase web app in a native window. It loads the app by URL, the same way a browser tab does. The React app is not bundled or changed.

## Run order

The desktop window only shows the web app, so everything the web app needs has to be running first. Start these in order, each in its own terminal:

1. **Database**: make sure your PostgreSQL database is running and `Backend/database.ini` points at it (see the [Installation Guide](../Installation_Guide.md)).
2. **Backend**:
   ```
   cd Backend
   python server.py
   ```
3. **Frontend** (React dev server on http://localhost:3000):
   ```
   cd Frontend
   npm start
   ```
4. **Desktop**:
   ```
   cd desktop
   npm install
   npm start
   ```

A window titled "DynaBase" opens and shows the About page.

## Loading a different URL

By default the window loads `http://localhost:3000`. Set `DADS_URL` to load something else:

```
# bash / macOS / Linux
DADS_URL=http://127.0.0.1:5000 npm start

# PowerShell
$env:DADS_URL='http://127.0.0.1:5000'; npm start
```



## Links

Links to other sites, such as lmfdb.org or the GitHub button, open in your normal browser instead of a new Electron window. Links to other pages of the app stay inside the app.
