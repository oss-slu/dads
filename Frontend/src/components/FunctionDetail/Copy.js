import React, { useState } from 'react';

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

  return (
    <div>
      <button onClick={copyToClipboard}>Copy to Clipboard</button>
      {copySuccess && <span style={{marginLeft: '10px', color: 'green'}}>Copied!</span>}
    </div>
  );
};

export default Copy;

