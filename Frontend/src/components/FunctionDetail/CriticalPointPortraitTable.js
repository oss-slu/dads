import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function CriticalPointPortraitTable({ data }) {
  console.log(JSON.stringify(data));
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
  };
  if (data.is_pcf == true) {
  return (
    <TableContainer className='table-component' component={Paper}>
      <h3>Critical Point Portrait</h3>
      <Table aria-label="simple table">
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row"><b>Cardinality</b></TableCell>
            <TableCell align="right">{data.cardinality || "N/A"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Size of Post Critical Set</b></TableCell>
            <TableCell align="right">{data.positive_in_degree || "N/A"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>As Directed Graph</b></TableCell>
            <TableCell align="right">{"test"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Adjacency Matrix</b></TableCell>
            <TableCell align="right">{"test"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Cycle Lengths</b></TableCell>
            <TableCell align="right">{data.periodic_cycles || "N/A"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Component Sizes</b></TableCell>
            <TableCell align="right">{data.preperiodic_components || "N/A"}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
}
