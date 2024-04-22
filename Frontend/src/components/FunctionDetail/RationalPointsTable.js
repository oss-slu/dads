import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function RationalPointsTable({ data }) {
  
  const formatData = (key) => {
    const items = data[key];
    if (items && items.length > 0) {
      if (Array.isArray(items[0])) {
        return `[${items[0].join(', ')}]`;
      } else {
        return `[${items.join(', ')}]`;
      }
    }
    return '[]';
  };
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

    //const list = formatData('edges');


  return (
    <TableContainer className='table-component' component={Paper}>
      <h3>Rational Preperiodic Points</h3>
      <Table aria-label="simple table">:
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row"><b>Cardinality</b></TableCell>
            <TableCell align="right">{data.cardinality}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Field Label</b></TableCell>
            <TableCell align="right">{data.base_field_label}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Preperiodic Components</b></TableCell>
            <TableCell align="right">{formatData('preperiodic_components')}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Rational Preperiodic Points</b></TableCell>
            <TableCell align="right">{formatData('rational_periodic_points')}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>As Directed Graph</b></TableCell>
            <TableCell align="right">{"link"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Adjacency Matrix</b></TableCell>
            <TableCell align="right">{data.edges}
		<Button variant="primary" onClick={handleShow}>
		    Open Modal
		</Button>
	    </TableCell>
	    <MyModal
		showModal={showModal}
		handleClose={handleClose}
		modalTitle="Adjacency Matrix"
		edges = {data.edges}
		saveChangesText="Save Changes"
	    />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
