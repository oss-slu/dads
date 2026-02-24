/*
This is the homepage of the application which displays some general background
information to the user. 
*/
import React from 'react';
import { Container, Row, Col, Button,ListGroup,Tab } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import GitHubIcon from '@mui/icons-material/GitHub';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

function AboutPage() {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // Smooth scroll behavior
      });
    };
  return (
    <>
    <Button onClick={scrollToTop} style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: '9999' }}>
    <KeyboardDoubleArrowUpIcon style={{color:'white'}}/>
    </Button>
      <br>
      </br>
      <br>
      </br>
      <br>
      </br>
      <Container>
        <Row style={{ width: "100%" }}>
          <Col>
            <Accordion id='main-accordian' defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header >About the Project</Accordion.Header>
                <Accordion.Body>
                  <p>
                    The goal of this project is to create a comprehensive database of arithmetic dynamical systems and a flexible, web-based, search-driven user interface. The web-based interface to access the data will be search-driven making tasks such as locating examples with specific properties or examining the collective statistics of certain sets of dynamical systems as simple as possible. This data will be able to be exported for further analysis. This type of searchable rich data set will save researchers countless hours of computation as well as provide a means to identify previously unknown patterns and connections.
                  </p>
                  <img src="x2_29_16.jpg" alt="Dynamical System" />
                  <h4>Who will Use DADs?</h4>
                  <p>
                    A database of arithmetical dynamical systems has numerous potential users including researchers, mathematicians, scientists, educators, and professionals. This database will be useful to anyone interested in arithmetic properties of iterated function systems. Here are a few examples:
                  </p>
                  <Accordion>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>1. Mathematicians and Researchers in Dynamical Systems</Accordion.Header>
                      <Accordion.Body>
                        Mathematicians and researchers who specialize in dynamical systems may use the database to quickly find examples with certain properties or to analyze sets of dynamical systems with certain properties. This could include researchers interested in number theory, chaos theory, or discrete dynamical systems.
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="1">
                      <Accordion.Header>2. Mathematical Physicists</Accordion.Header>
                      <Accordion.Body>
                        Researchers in mathematical physics may study arithmetical dynamical systems as they are relevant to understanding certain physical phenomena. These systems may arise in the study of discrete physical models or in the analysis of mathematical structures related to physics.
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="2">
                      <Accordion.Header>3. Educators and Students</Accordion.Header>
                      <Accordion.Body>
                        Educators teaching courses in dynamical systems or related mathematical subjects may use the database to provide examples, materials, and resources for students. Students can benefit from such databases to explore and understand arithmetic dynamical systems.
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="3">
                      <Accordion.Header>4. Complex Systems Researchers</Accordion.Header>
                      <Accordion.Body>
                        Researchers studying complex systems, which may include arithmetical components, could use the database to explore the dynamics of these systems. This might be relevant in disciplines such as biology, economics, or computer science.
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="4">
                      <Accordion.Header>5. Computer Scientists and Algorithm Developers</Accordion.Header>
                      <Accordion.Body>
                        Professionals working in computer science, especially those involved in algorithm development, may use the database of arithmetic dynamical systems for applications in computational mathematics, algorithmic analysis, and complexity theory.
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="5">
                      <Accordion.Header>6. Cryptographers</Accordion.Header>
                      <Accordion.Body>
                        Researchers in cryptography might be interested in arithmetical dynamical systems for their applications in the design and analysis of cryptographic algorithms. Certain chaotic maps and dynamical systems are used in cryptographic protocols.
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="6">
                      <Accordion.Header>7. Researchers in Control Theory</Accordion.Header>
                      <Accordion.Body>
                        Professionals working in control theory, engineering, and systems analysis may explore arithmetical dynamical systems for applications in system control, stability analysis, and related fields.
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="7">
                      <Accordion.Header>8. Mathematical Software Developers</Accordion.Header>
                      <Accordion.Body>
                        Developers of mathematical software or tools may reference the database of arithmetic dynamical systems to validate implementations, test algorithms, and ensure the accuracy of computational tools.
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="8">
                      <Accordion.Header>9. Research Institutions and Laboratories</Accordion.Header>
                      <Accordion.Body>
                        Academic institutions, research laboratories, and organizations focused on mathematical research may use the database of arithmetic dynamical systems as part of their research resources.
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                  <br>
                  </br>
                  <h4>Sample Use Cases:</h4>
                  <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
                    <Row>
                      <Col sm={4}>
                        <ListGroup as="ol" numbered>
                          <ListGroup.Item as="li" variant='primary' action href="#link1">
                            Examples or Counterexamples
                          </ListGroup.Item>
                          <ListGroup.Item as="li" variant='primary' action href="#link2">
                          Numerical Investigation of Conjectures
                          </ListGroup.Item>
                          <ListGroup.Item as="li" variant='primary' action href="#link3">
                          Statistical Analysis of Classes of Maps
                          </ListGroup.Item>
                          <ListGroup.Item as="li" variant='primary' action href="#link4">
                          Special Families of Maps
                          </ListGroup.Item>
                        </ListGroup>
                      </Col>
                      <Col sm={8}>
                        <Tab.Content>
                          <Tab.Pane eventKey="#link1">Consider the existence question: "Are there any post-critically finite polynomial endomorphisms of the projective line of degree 3 for which the critical point portrait contains a 3-cycle?" This question can be immediately answered through the database if the dataset is broad enough. The researcher can then apply the appropriate search criteria to see whether such a map exists.</Tab.Pane>
                          <Tab.Pane eventKey="#link2">
                            <p>
                          Lucien Szpiro conjectured a relationship between the conductor and discriminant of an elliptic curve (two fundamental numerical invariants associated to an elliptic curve). As rational points on elliptic curves can be thought of as a special case of a dynamical system, one would hope to make a more general version of Szpiro's conjecture. Conjecture 4.97 in Silverman's The Arithmetic of Dynamical Systems gives one such possibility looking at the powers which occur in the prime divisors of the minimal resultant of a dynamical system.
                        </p>
                        <p>
                          Essentially, this conjecture says that the powers of the primes that occur in the factorization of the minimal resultant are bounded above by a constant c that does not depend on the function (only on the degree of the function). However, this version is known to be false. Consequently, a more refined notion of conductor and/or resultant needs to be formulated. The information in the database could be used as test data to quickly examine possible reformulations, or advanced AI tools could be used on the database itself to predict a reformulation.
                        </p></Tab.Pane>
                          <Tab.Pane eventKey="#link3">An area of recent research is understanding how similar a given algebraic map over a finite field is to a random map. A truly random map would have equal probability of any point being the forward image of any other. The statistics on the dynamical data associated to truly random maps have been extensively studied due to their connections to problems in computer science, e.g., Pollard Rho factoring or psuedo-random number generators. It is well known that an underlying group structure, such as for Lattes maps or Chebyshev polynomials, has a profound effect on the statistics. More subtly it appears that the size of the function's automorphism group affects the statistics of the map. It is these types of subtle connections that only become visible in large datasets and could be identified through analysis of the data contained in the database.</Tab.Pane>

                          <Tab.Pane eventKey="#link4">Besides performing statistical analysis of the data for a large class of maps, researchers often want to restrict their attention to special families of maps. For example, Lattes maps have received significant attention. A researcher studying Lattes maps would benefit from being able to instantly determine a list of all Lattes maps satisfying certain properties (such as bounded height) and be able to export that list to a format that is immediately usable in Sage or another computer algebra system. That database can both return statistical information about those families of maps and export the search results.</Tab.Pane>
                          
                        </Tab.Content>
                      </Col>
                    </Row>
                  </Tab.Container>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Mathematical Background</Accordion.Header>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>Getting Started with DynaBase</Accordion.Header>
                <Accordion.Body>
                  <p>Visit our <Button variant="dark" href="https://github.com/bhutz/DynaBase"> <GitHubIcon style={{color:'white'}} /> Github</Button></p>
                  <p>
                    Search for dynamical systems with certain properties on the “Dynamical Systems” page. Refine the filters on the left-hand side of the page to narrow down your selection. Click on the label of a dynamical system in the results table to see all data on that specific system. Collected statistics on the returned results are displayed on a table on the right hand side of the page.
                  </p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>About the Data</Accordion.Header>
                <Accordion.Body>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default AboutPage;
