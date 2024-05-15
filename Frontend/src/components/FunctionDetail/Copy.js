import React, { useState } from 'react';
import {Button } from 'react-bootstrap';
import SageMathCell from './SageMathCell';
import Modal from 'react-bootstrap/Modal';

const Copy = ({ edges, type }) => {

    const generateAdjacencyMatrix = (adjacencyString) => {
	const adjacencyList = adjacencyString.replace(/\[|\]/g, '').split(', ');

	const adjacencyListInt = adjacencyList.map(Number);
	console.log('adjacencyListInt:', adjacencyListInt);


	const numVertices = adjacencyList.length;
	console.log('numVertices:', numVertices);

	const adjacencyMatrix = Array.from({ length: numVertices }, () => Array(numVertices).fill(0));
	console.log('adjacencyMatrix:', adjacencyMatrix);

	for (let i = 0; i < adjacencyListInt.length; i++) {
	    const adjacentVertex = adjacencyListInt[i];
	    adjacencyMatrix[i][adjacentVertex] = 1;
	}

	console.log('adjacencyMatrix after population:', adjacencyMatrix);

	return adjacencyMatrix;
    }
    
    const matrix = generateAdjacencyMatrix(edges);
    const dimNum = matrix.length;

  const [copySuccess, setCopySuccess] = useState(false);
  let stringToCopy = "";

  // Set stringToCopy based on the type
  switch (type) {
    case 1:
      stringToCopy = "Matrix(QQ, " + dimNum +","  + dimNum + ", [" + matrix + "])";
      break;
    case 2:
      stringToCopy = "DiGraph(Matrix(QQ, " + dimNum +","  + dimNum + ", [" + matrix + "]))";
      break;
    default:
      stringToCopy = "ERROR";
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(stringToCopy)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => {
          setCopySuccess(false);
        }, 2000); // Reset success message after 2 seconds
      })
      .catch(err => console.error('Failed to copy:', err));
  };
  
  const [showGraphModal, setShowGraphModal] = useState(false);
	const [edgesCommand, setEdgesCommand] = useState('');
    const handleCloseGraph = () => setShowGraphModal(false);
    const handleShowGraph = () => {
        setShowGraphModal(true);
        setEdgesCommand(stringToCopy);
    };

  return (
    <>
    <Modal show={showGraphModal} onHide={handleCloseGraph} centered >
                <Modal.Header closeButton>
                    <Modal.Title>Directed Graph</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{maxHeight:'60vh',overflow:'scroll'}}>
					<SageMathCell
					command={edgesCommand}
					></SageMathCell>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseGraph}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
    <div>
      <Button variant='dark' onClick={copyToClipboard}>Copy Sage Command</Button><span>  </span>
      {copySuccess && <span style={{marginLeft: '10px', color: 'green'}}>Copied!</span>}
      {type==2&&<Button variant='dark' onClick={handleShowGraph}>
									Show
			</Button>}
    </div>
    </>
  );
};

export default Copy;

