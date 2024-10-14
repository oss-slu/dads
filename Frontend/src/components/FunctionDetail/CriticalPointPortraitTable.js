import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function CriticalPointPortraitTable({ data }) {
  
  const formatData = (key) => {
    const value = data[key];
  
    if (value === null || value === undefined) {
      return 'N/A';
    }
  
    if (Array.isArray(value)) {
      if (value.length > 0) {
        if (Array.isArray(value[0])) {
          return `[${value[0].join(', ')}]`;
        } else {
          return `[${value.join(', ')}]`;
        }
      }
      return '[]'; // Return '[]' for empty arrays
    }
      return 'N/A';
  };

  return (
    <TableContainer className='table-component' component={Paper}>
      <h3>Critical Point Portrait</h3>
      <Table aria-label="simple table">
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row"><b>Cardinality</b></TableCell>
            <TableCell align="right">{formatData(data.critical_portrait_cardinality)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>As Directed Graph (graph ID for now)</b></TableCell>
            <TableCell align="right">{formatData(data.critical_portrait_graph_id)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Adjacency Matrix</b></TableCell>
            <TableCell align="right">{"link"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Components</b></TableCell>
            <TableCell align="right">{formatData(data.critical_portrait_components)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Structure</b></TableCell>
            <TableCell align="right">{formatData(data.critical_portrait_structure)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
