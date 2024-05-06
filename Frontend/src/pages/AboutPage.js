/*
This is the homepage of the application which displays some general background
information to the user. 
*/
import React from 'react';

function AboutPage() {
  return (
    <div className="padded-page"> {/*Scaling issues due to other static components, WIP*/}
      <div className = "header"><h2>About Us</h2></div>
      <div className="container">

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
    <p>Visit our <a className = "linkButton" href="https://github.com/oss-slu/dads">Github Page</a>.</p>
  </div>
  );
}

export default AboutPage;
