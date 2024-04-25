import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';

export default function AdjacencyMatrix({ modalTitle, edges }) {

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
    
    

    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const matrix = generateAdjacencyMatrix(edges);
    const string = formatAdjacencyMatrix(matrix);
    
    
    return (
       <>
            <button className="custom-btn" onClick={handleShow}>
                Show
            </button>

            {showModal && (
                <div className="custom-modal" tabIndex="-1" role="dialog">
                    <div className="custom-modal-dialog" role="document">
                        <div className="custom-modal-content">
                            <div className="custom-modal-header">
                                <h5 className="custom-modal-title">{modalTitle}</h5>
                                <button type="button" className="custom-close" onClick={handleClose} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="custom-modal-body">
                                {/* Modal Body Content */}
                                <pre>{string}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
