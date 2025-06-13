/*
Improved AboutPage with better UI/UX
*/
import React from 'react';
import { Container, Row, Col, Button, ListGroup, Tab } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import GitHubIcon from '@mui/icons-material/GitHub';
import PDFViewer from '../components/PDFViewer';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import { styled } from '@mui/system';

// Styled components for better organization
const StyledContainer = styled(Container)({
  marginTop: '80px',
  maxWidth: '1200px',
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
});

const StyledAccordion = styled(Accordion)({
  '& .accordion-item': {
    border: '1px solidrgb(224, 224, 224)',
    borderRadius: '8px',
    marginBottom: '16px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  '& .accordion-header': {
    backgroundColor: '#f8f9fa',
    padding: '16px',
    '& button': {
      fontWeight: '600',
      fontSize: '1.1rem',
      color: '#2c3e50',
      textDecoration: 'none',
      '&:focus': {
        boxShadow: 'none',
      },
      '&:not(.collapsed)': {
        backgroundColor: '#A9A9A9',
      },
    },
  },
  '& .accordion-body': {
    padding: '24px',
    lineHeight: '1.6',
  },
});

const StyledImage = styled('img')({
  maxWidth: '100%',
  height: 'auto',
  borderRadius: '8px',
  margin: '20px 0',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
});

const StyledScrollButton = styled(Button)({
  position: 'fixed',
  bottom: '30px',
  right: '30px',
  zIndex: '1000',
  backgroundColor: '#2c3e50',
  color: 'white',
  borderRadius: '50%',
  width: '50px',
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  '&:hover': {
    backgroundColor: '#1a252f',
    transform: 'translateY(-2px)',
  },
});

const StyledTabContent = styled(Tab.Content)({
  padding: '20px',
  borderLeft: '1px solid #dee2e6',
  minHeight: '200px',
  backgroundColor: '#f8f9fa',
  borderRadius: '0 8px 8px 0',
});

const StyledListGroupItem = styled(ListGroup.Item)({
  border: 'none',
  padding: '12px 16px',
  marginBottom: '8px',
  borderRadius: '6px',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: '#e9ecef',
  },
  '&.active': {
    backgroundColor: '#2c3e50',
    color: 'white',
  },
});

function AboutPage() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <StyledScrollButton onClick={scrollToTop} title="Scroll to top of page">
        <KeyboardDoubleArrowUpIcon style={{ fontSize: '1.5rem' }} />
      </StyledScrollButton>
     
      <StyledContainer>
        <Row>
          <Col>
            <StyledAccordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <h3 style={{ margin: 0 }}>About the Project</h3>
                </Accordion.Header>
                <Accordion.Body>
                  <p className="lead">
                    The goal of this project is to create a comprehensive database of arithmetic dynamical systems and a flexible, web-based, search-driven user interface. The web-based interface to access the data will be search-driven making tasks such as locating examples with specific properties or examining the collective statistics of certain sets of dynamical systems as simple as possible. This data will be able to be exported for further analysis. This type of searchable rich data set will save researchers countless hours of computation as well as provide a means to identify previously unknown patterns and connections.
                  </p>
                  
                  <StyledImage src="x2_29_16.jpg" alt="Dynamical System Visualization" />
                  
                  <section>
                    <h4 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>Who will Use DADs?</h4>
                    <Accordion>
                      {[
                        {
                          title: "1. Mathematicians and Researchers in Dynamical Systems",
                          content: "Mathematicians and researchers who specialize in dynamical systems may use the database to quickly find examples with certain properties or to analyze sets of dynamical systems with certain properties. This could include researchers interested in number theory, chaos theory, or discrete dynamical systems."
                        },
                        {
                          title: "2. Mathematical Physicists",
                          content: "Researchers in mathematical physics may study arithmetical dynamical systems as they are relevant to understanding certain physical phenomena. These systems may arise in the study of discrete physical models or in the analysis of mathematical structures related to physics."
                        },
                        // Add other items in the same format
                      ].map((item, index) => (
                        <Accordion.Item key={index} eventKey={index.toString()}>
                          <Accordion.Header>{item.title}</Accordion.Header>
                          <Accordion.Body>{item.content}</Accordion.Body>
                        </Accordion.Item>
                      ))}
                    </Accordion>
                  </section>
                  
                  <section style={{ marginTop: '2rem' }}>
                    <h4 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>Sample Use Cases:</h4>
                    <Tab.Container id="use-cases-tabs" defaultActiveKey="#link1">
                      <Row>
                        <Col sm={4}>
                          <ListGroup>
                            <StyledListGroupItem action href="#link1">
                              Examples or Counterexamples
                            </StyledListGroupItem>
                            <StyledListGroupItem action href="#link2">
                              Numerical Investigation of Conjectures
                            </StyledListGroupItem>
                            <StyledListGroupItem action href="#link3">
                              Statistical Analysis of Classes of Maps
                            </StyledListGroupItem>
                            <StyledListGroupItem action href="#link4">
                              Special Families of Maps
                            </StyledListGroupItem>
                          </ListGroup>
                        </Col>
                        <Col sm={8}>
                          <StyledTabContent>
                            <Tab.Pane eventKey="#link1">
                              <p>Consider the existence question: "Are there any post-critically finite polynomial endomorphisms of the projective line of degree 3 for which the critical point portrait contains a 3-cycle?" This question can be immediately answered through the database if the dataset is broad enough. The researcher can then apply the appropriate search criteria to see whether such a map exists.</p>
                            </Tab.Pane>
                            <Tab.Pane eventKey="#link2">
                              <p>Lucien Szpiro conjectured a relationship between the conductor and discriminant of an elliptic curve (two fundamental numerical invariants associated to an elliptic curve). As rational points on elliptic curves can be thought of as a special case of a dynamical system, one would hope to make a more general version of Szpiro's conjecture.</p>
                              <p>Conjecture 4.97 in Silverman's The Arithmetic of Dynamical Systems gives one such possibility looking at the powers which occur in the prime divisors of the minimal resultant of a dynamical system.</p>
                            </Tab.Pane>
                            {/* Other Tab.Panes */}
                          </StyledTabContent>
                        </Col>
                      </Row>
                    </Tab.Container>
                  </section>
                </Accordion.Body>
              </Accordion.Item>
              
              <Accordion.Item eventKey="1">
                <Accordion.Header>Mathematical Background</Accordion.Header>
                <Accordion.Body>
                  <PDFViewer />
                </Accordion.Body>
              </Accordion.Item>
              
              <Accordion.Item eventKey="2">
                <Accordion.Header>Getting Started with DynaBase</Accordion.Header>
                <Accordion.Body>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <Button 
                      variant="dark" 
                      href="https://github.com/bhutz/DynaBase"
                      style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        borderRadius: '6px'
                      }}
                    >
                      <GitHubIcon style={{ color: 'white' }} />
                      Visit our GitHub
                    </Button>
                  </div>
                  <p>
                    Search for dynamical systems with certain properties on the "Dynamical Systems" page. Refine the filters on the left-hand side of the page to narrow down your selection. Click on the label of a dynamical system in the results table to see all data on that specific system. Collected statistics on the returned results are displayed on a table on the right hand side of the page.
                  </p>
                </Accordion.Body>
              </Accordion.Item>
              
              <Accordion.Item eventKey="3">
                <Accordion.Header>About the Data</Accordion.Header>
                <Accordion.Body>
                  <p>The DADs database contains detailed records of arithmetical dynamical systems, including properties like:</p>
                  <ul>
                    <li>Degree and dimension of the systems</li>
                    <li>Automorphism group cardinality</li>
                    <li>Critical point portraits</li>
                    <li>Periodic and preperiodic point data</li>
                    <li>Field of definition information</li>
                    <li>Various standard models and representations</li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </StyledAccordion>
          </Col>
        </Row>
      </StyledContainer>
    </>
  );
}

export default AboutPage;