import * as React from 'react';
import Button from 'react-bootstrap/Button';


function AdjacencyMatrix({ modalTitle, edges }) {

    const generateAdjacencyMatrix = (adjacencyList) => {
	const numVertices = Math.max(...adjacencyList) + 1; // Determine the number of vertices
	const adjacencyMatrix = Array.from({ length: numVertices }, () => Array(numVertices).fill(0));

    // Populate the adjacency matrix based on the adjacency list
	for (let i = 0; i < adjacencyList.length; i++) {
	    const adjacentVertex = adjacencyList[i];
	    adjacencyMatrix[i][adjacentVertex] = 1;
	}

	return adjacencyMatrix;
    }

    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const matrix = generateAdjacencyMatrix(edges);
    
    
    return (
	<Button variant="primary" onClick={handleShowModal}>
	    {modalTitle}
	</Button>

	<Modal show={handleShow} onHide={handleCloseModal}>
	    <Modal.Header closeButton>
		<Modal.Title>{modalTitle}</Modal.Title>
	    </Modal.Header>
	    <Modal.Body>
	    </Modal.Body>
	    <Modal.Footer>
		<Button variant="secondary" onClick={handleCloseModal}>
		    Close
		</Button>
		<Button variant="primary" onClick={handleCloseModal}>
		    {saveChangesText}
		</Button>
	    </Modal.Footer>
	</Modal>
    );
}

