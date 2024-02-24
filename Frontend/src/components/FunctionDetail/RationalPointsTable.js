import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function RationalPointsTable({ data }) {
  return (
    <TableContainer className='table-component' component={Paper}>
      <h3>Rational Preperiodic Points</h3>
      <Table aria-label="simple table">
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row"><b>Cardinality</b></TableCell>
            <TableCell align="right">{data[0]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Cycle Sizes</b></TableCell>
            <TableCell align="right">{data[0]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Component Sizes</b></TableCell>
            <TableCell align="right">{data[1]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>As Directed Graph</b></TableCell>
            <TableCell align="right">{data[1]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Adjacency Matrix</b></TableCell>
            <TableCell align="right">{data[1]}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
