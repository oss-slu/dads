import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function CriticalPointPortraitTable({ data }) {
  return (
    <TableContainer className='table-component' component={Paper}>
      <h3>Critical Point Portrait</h3>
      <Table aria-label="simple table">
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row"><b>Cardinality</b></TableCell>
            <TableCell align="right">{"tmp"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Cycle Sizes</b></TableCell>
            <TableCell align="right">{"tmp"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>As Directed Graph</b></TableCell>
            <TableCell align="right">{"tmp"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Adjacency Matrix</b></TableCell>
            <TableCell align="right">{"tmp"}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
