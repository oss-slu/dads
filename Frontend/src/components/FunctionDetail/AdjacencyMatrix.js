import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { generateAdjacencyMatrix } from './graphEdges';

export default function AdjacencyMatrix({ modalTitle, edges }) {
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

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
                    {matrix.length === 0
                        ? <p>This graph is empty.</p>
                        : <pre>{string}</pre>}
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
