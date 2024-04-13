## DADS: A Database of Arithmetical Dynamic Systems
DADS is a web application designed for researchers to access information about a vast array of arithmetical dynamical systems that would otherwise take a long time to compute independently. This project was developed by the SLU Capstone Project team under Open Source with SLU in collaboration with Dr. Benjamin Hutz, a professor of mathematics and statistics at Saint Louis University.

**Features**
- Home Page: A brief description of the application and a link to the GitHub repository.
- Explore Systems Page: Allows users to filter and query through the database for various properties like automorphism group cardinality and degree. The results are displayed in a paginated data table with a statistics summary to the right which shows metrics about the returned systems, such as average height.
- System Details Page: Each system in the paginated table has a label which can be selected to show a page with additional information about the system.

**Tech Stack**
Frontend: React
Backend: Python
Database: PostgreSQL

**Getting Started**
Clone the repository from GitHub.
Install the necessary dependencies for React and Python using PIP and npm install 
Set up the PostgreSQL database.
Run the application.
For detailed instructions, please refer to the Installation Guide.

**Contributing**
We welcome contributions from the community. Please refer to the Contributing Guide for more information.

**Database Info**
Currently, the database connection settings are configured for local development using Beekeeper Studio with the following connection parameters:

```python
psycopg2.connect(
    host='localhost',
    dbname='dad',
    user='dad_user',
    password='dad_pass',
    port='5432')

**Key Files**

**License**
This project is licensed under the terms of the MIT license.

**Contact**
For any queries, please contact the SLU Capstone Project team or Dr. Hutz at Saint Louis University.
