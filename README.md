## DADS: A Database of Arithmetical Dynamic Systems
DADS is a web application designed for researchers to access information about a vast array of arithmetical dynamical systems that would otherwise take a long time to compute independently. This project was developed by the SLU Capstone Project team under Open Source with SLU in collaboration with Dr. Benjamin Hutz, a professor of mathematics and statistics at Saint Louis University.

### Features
* Home Page: A description of the application and a link to the GitHub repository.
* Explore Systems Page: Allows users to filter and query through the database for various properties like automorphism group cardinality and degree. The results are displayed in a paginated data table with a statistics summary to the right which shows metrics about the returned systems, such as average height.
* System Details Page: Each system in the paginated table has a label which can be selected to show a page with additional information about the system.

### Tech Stack
* Frontend: React
* Backend: Python
* Database: PostgreSQL

### Getting Started
* Clone the repository from GitHub.
* Install the necessary dependencies for React and Python using PIP and npm install.
* Set up the PostgreSQL database.
* Run the application using <code>python server.py</code> and <code>npm start</code> commands in backend and frontend directories respectively. 
* Please see the installation guide for more details.

### Backend Launcher
The <code>desktop/launcher/start-backend.js</code> script starts the Python backend, waits until it is actually accepting requests, and shuts it down cleanly when you quit. It is the first piece of the desktop app, where the window should only open once the backend can answer.

Run it from the repository root with <code>node desktop/launcher/start-backend.js</code>. It uses <code>python</code> by default; set the <code>PYTHON</code> environment variable to use another interpreter, for example <code>PYTHON=python3 node desktop/launcher/start-backend.js</code> on macOS. The database must be running and the Python dependencies installed.

What it does:
* Runs <code>python server.py</code> in the Backend directory and prints its output with a <code>[backend]</code> prefix.
* Polls <code>http://127.0.0.1:5000/get_all_families</code> every 250 ms and prints <code>backend ready after N ms</code> on the first 200 response.
* Gives up after 20 seconds, stops the backend, and exits with code 1 if it never becomes ready.
* On Ctrl+C the backend is stopped and the script waits for it to exit, so no Python process is left behind.
* If the backend dies on its own, the script prints its exit code and exits non-zero.

Polling an endpoint is more reliable than sleeping for a fixed few seconds. Startup time varies with the machine and with how long the database takes to connect, so a fixed delay is either too short and races the backend or too long and wastes time on every launch. Checking a real route also confirms the backend can serve data, not just that the process started.

### Contributing
We welcome contributions from the community. Please refer to the Contributing Guide for more information.
https://github.com/oss-slu/dads/blob/main/Contributing_Guide.txt

### Key Files

#### Backend - 
- postgres_connector.py - Contains methods to select systems and build SQL query text
- server.py - Contains Flask server initialization and API routes4

#### Frontend - 
- ExploreSystems.js - This page allows users to filter and search through the dynamical systems database using various properties.
- SystemDetails.js - Displays detailed information about a specific system when selected from the results in the Explore Systems page, uses component tables and data passed from postgres_connector
- AboutPage.js - Contains static information about the site
- newDataTable.js - Renders a dynamic table that displays systems based on the search and filter criteria, complete with pagination functionality.
- Topbar.js - Contains navigation logic for the site 

### License
This project is licensed under the terms of the MIT license.

### Contact
For any queries, please contact the SLU Capstone Project team or Dr. Hutz at Saint Louis University.
