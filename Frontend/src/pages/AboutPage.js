import React from 'react';

function AboutPage() {
  return (
    <div style={{ marginLeft: '13em', padding: '25px'}}> {/*Scaling issues due to other static components, WIP*/}
      <div className = "header"><h2>About Us</h2></div>
      <div class="container">

      <p className = "body">
      The goal of this project is to create a flexible, web-based, search-driven user
      interface for a database of arithmetic dynamical systems. The web-based interface
      to access the data will be search-driven making tasks such as locating examples
      with specific properties or examining the collective statistics of certain sets of
      dynamical systems as simple as possible. This data will be able to be exported
      for further analysis. This type of searchable rich data set will save researchers
      countless hours of computation as well as provide a means to identify previously
      unknown patterns and connections</p>
      <img src="./homeImage.png" alt="image" />
      </div>
      <h1>Who will Use DADs?</h1>
      <p>A database of arithmetical dynamical systems has numerous potential users including researchers, mathematicians, scientists, educators, and professionals. This database will be useful to anyone interested in studying how numbers change when a formula is applied to them. This could mean anything from modeling a chemical reaction, or modeling the effect of codebreaking formualae. Here are a few examples:</p>
      <ul>
        <li><strong>Mathematicians and Researchers in Dynamical Systems:</strong> Mathematicians and researchers who specialize in dynamical systems may use databases of arithmetical dynamical systems to study the behavior and properties of systems with arithmetical components. This could include researchers interested in number theory, chaos theory, or discrete dynamical systems.</li>
        <br/>
        <li><strong>Mathematical Physicists:</strong> Researchers in mathematical physics may study arithmetical dynamical systems as they are relevant to understanding certain physical phenomena. These systems may arise in the study of discrete physical models or in the analysis of mathematical structures related to physics.</li>
        <br/>
        <li><strong>Educators and Students:</strong> Educators teaching courses in dynamical systems or related mathematical subjects may use databases to provide examples, materials, and resources for students. Students can benefit from such databases to explore and understand arithmetical dynamical systems.</li>
        <br/>
        <li><strong>Complex Systems Researchers:</strong> Researchers studying complex systems, which may include arithmetical components, could use databases to explore the dynamics of these systems. This might be relevant in disciplines such as biology, economics, or computer science.</li>
        <br/>
        <li><strong>Computer Scientists and Algorithm Developers:</strong> Professionals working in computer science, especially those involved in algorithm development, may use databases of arithmetical dynamical systems for applications in computational mathematics, algorithmic analysis, and complexity theory.</li>
        <br/>
        <li><strong>Cryptographers:</strong> Researchers in cryptography might be interested in arithmetical dynamical systems for their applications in the design and analysis of cryptographic algorithms. Certain chaotic maps and dynamical systems are used in cryptographic protocols.</li>
        <br/>
        <li><strong>Researchers in Control Theory:</strong> Professionals working in control theory, engineering, and systems analysis may explore arithmetical dynamical systems for applications in system control, stability analysis, and related fields.</li>
        <br/>
        <li><strong>Mathematical Software Developers:</strong> Developers of mathematical software or tools may reference databases of arithmetical dynamical systems to validate implementations, test algorithms, and ensure the accuracy of computational tools.</li>
        <br/>
        <li><strong>Research Institutions and Laboratories:</strong> Academic institutions, research laboratories, and organizations focused on mathematical research may maintain or use databases of arithmetical dynamical systems as part of their research resources.</li>
    </ul>
    <h1>Getting started with  DADS:</h1>
    <p>Visit our <a className = "linkButton" href="https://github.com/oss-slu/dads" target="_blank">Github Page</a>.</p>

    <h2>Dependencies</h2>
    <p><strong>Python dependencies:</strong> flask, flask_cors</p>
    <p><strong>Frontend:</strong> Node, React, MUI</p>

    <h2>How to run backend</h2>
    <p>Run the following command inside the backend folder:</p>
    <code>python server.py</code>

    <h2>How to run frontend</h2>
    <p>For the first time, run the following command inside the frontend folder:</p>
    <code>npm install</code>

    <p>Then, run the following command inside the frontend folder. The website should open up automatically in the browser:</p>
    <code>npm run start</code>

    <h1>Troubleshooting:</h1>
    <div>
    <h2>Problems with Docker:</h2>
    <p>
        <a href="https://docs.docker.com/desktop/install/windows-install/" target="_blank">Docker Desktop Installation Guide</a>, 
        or use the appropriate package manager on a UNIX based system.
    </p>
    <p>
        (Homebrew will likely be the best for Mac, but research your Linux distro to use the package manager it was installed with.
        The command will likely look like this: <code>sudo PACKAGE_MANAGER_NAME install docker</code>)
    </p>

    <h3>Setup Docker Container</h3>
    <p>
        Open CMD as admin if you are running a Windows machine, or if using an Apple or Mac device use the sudo prefix before each command,
        navigate to the folder with Dockerfile.
    </p>
    <p>Run <code>docker build -t NAME_OF_IMAGE ./</code> (this image name will be chosen by you)</p>
    <p>
        Run <code>docker run --name NAME_OF_CONTAINER -v SOME_FILE_PATH/pgdata:/var/lib/postgresql/data -p 5432:5432 NAME_OF_IMAGE</code>
        (the container name will be chosen by you, and SOME_FILE_PATH is the path by which you want to put the pgdata folder as this is the
        folder that the container will access. In a UNIX system, you will not need to provide the path to the current directory you are in, but with Windows, you will.)
    </p>

    <h3>Populate the Database</h3>
    <p>
        Navigate to the File path provided in the previous step, then into the new pgdata folder. Now drop your .csv file into the pgdata folder,
        in our case, this will likely be test_data.csv.
    </p>
    <p>In a new CMD window run <code>docker exec -it NAME_OF_CONTAINER psql -U postgres -d dynamSystems</code></p>
    <p>
        This should give a shell within the docker container. The Docker container is a specialized environment that in our case is acting as a
        dummy database.
    </p>
    <p>
        In this shell, run <code>\copy data FROM '/var/lib/postgresql/data/data.csv' DELIMITER ',' CSV HEADER;</code>
        this is going to call upon the docker container's internal file path which we set as a reference to the pgdata folder earlier on, and will allow us to access the .csv data.
    </p>

    <h3>Database Connection Information</h3>
    <p>
        This should get the database setup and populated. Now you should be able to connect using this info:
    </p>
    <ul>
        <li>Host: localhost</li>
        <li>Port: 5432</li>
        <li>User: postgres</li>
        <li>Password: docker</li>
        <li>Database Name: dynamSystems</li>
        <li>Table Name: public.data</li>
    </ul>

    <p>
        You'll only need to follow these initial steps the very first time you set it up; after that, you should be able to just restart the container by using
        <code>docker start NAME_OF_CONTAINER</code> in a CMD, and the database should persist.
    </p>
    </div>
  </div>
  );
}

export default AboutPage;