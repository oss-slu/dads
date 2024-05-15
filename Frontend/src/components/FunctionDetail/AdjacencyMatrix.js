import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function AdjacencyMatrix({ modalTitle, edges }) {
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const generateAdjacencyMatrix = (adjacencyString) => {
        const adjacencyList = adjacencyString.replace(/\[|\]/g, '').split(', ');
        const numVertices = adjacencyList.length;
        const adjacencyMatrix = Array.from({ length: numVertices }, () => Array(numVertices).fill(0));

        for (let i = 0; i < adjacencyList.length; i++) {
            const adjacentVertex = parseInt(adjacencyList[i], 10);
            adjacencyMatrix[i][adjacentVertex] = 1;
        }

        return adjacencyMatrix;
    }

    const formatAdjacencyMatrix = (adjacencyMatrix) => {
        let formattedString = '';
        for (let i = 0; i < adjacencyMatrix.length; i++) {
            for (let j = 0; j < adjacencyMatrix[i].length; j++) {
                formattedString += `${adjacencyMatrix[i][j]} `;
            }
            formattedString += '\n'; // Newline after each row
        }
        return formattedString;
    }

    const matrix = generateAdjacencyMatrix(edges);
    const string = formatAdjacencyMatrix(matrix);

    return (
        <>
            <Button variant='dark' onClick={handleShow}>
                Show
            </Button>

            <Modal show={showModal} onHide={handleClose} centered >
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{maxHeight:'60vh',overflow:'scroll'}}>
                    <pre>{string}</pre>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
           
        </>
    );
}
