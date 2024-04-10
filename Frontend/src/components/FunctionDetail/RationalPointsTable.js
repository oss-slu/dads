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
    

    function adjacencyListToMatrix(singleDegreeList) {
	const numNodes = singleDegreeList.length;
	const adjacencyMatrix = Array.from({ length: numNodes }, () => Array(numNodes).fill(0));
	for (let node = 0; node < numNodes; node++) {
	    const adjacentNode = singleDegreeList[node];
	    adjacencyMatrix[node][adjacentNode] = 1;
	}
	return adjacencyMatrix;
    }
  return (
    <TableContainer className='table-component' component={Paper}>
      <h3>Rational Preperiodic Points</h3>
      <Table aria-label="simple table">
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
            <TableCell align="right">{adjacencyListToMatrix(data.edges}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
