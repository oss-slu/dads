# Installation Guide for DADS: A Database of Arithmetical Dynamic Systems


## Prerequisites:

Before installing the DADS application, you need to ensure your system has the following software installed:


**Python** - The backend of our application is developed using Python. Download and install the latest version of Python from Python Official Website.
https://www.python.org/downloads/

**Node.js and NPM** - The frontend of our application is built with React, which requires Node.js and npm for dependency management and to run the application locally. 
Download and install Node.js from Node.js Official Website. Installing Node.js will also install npm automatically.
https://nodejs.org/en/download/current

**PostgreSQL** - Our application uses PostgreSQL for the database. Download and install PostgreSQL from PostgreSQL Official Website.
https://www.postgresql.org/download/

**Beekeeper Studio** - For managing the database and making SQL queries, we recommend Beekeeper Studio. Download and install Beekeeper Studio from Beekeeper Studio Official Website.
https://www.beekeeperstudio.io/get


## Installation Steps

**Database Configuration** - 

Use Beekeeper Studio to connect to your PostgreSQL database using the connection parameters provided in the README file.

Clone the Repository using "git clone https://github.com/oss-slu/dads.git"
Navigate to the repository using "cd dads"

**Setup the Backend** - 

Navigate to the backend directory using "cd Backend"
Install the necessary Python dependencies by running <code>pip install -r requirements.txt</code>

**Setup the Frontend** - 

Navigate to the frontend directory using "cd ../frontend"
Install necessary node modules by running <code>npm install</code>


**Running the Application** - 

Start the backend server by navigating to the backend folder ("cd Backend") and running <code>python server.py</code>  

In a separate terminal, navigate to the frontend folder ("cd Frontend") and run <code>npm start</code>

The application should now be running on localhost with the frontend accessible via your web browser.
