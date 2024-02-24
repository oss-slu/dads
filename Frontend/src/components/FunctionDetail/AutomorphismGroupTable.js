import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function AutomorphismGroupTable({ data }) {
  return (
    <TableContainer className='table-component' component={Paper}>
      <h3>Automorphism Group</h3>
      <Table aria-label="simple table">
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row"><b>Cardinality</b></TableCell>
            <TableCell align="right">{data[18]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Structure</b></TableCell>
            <TableCell align="right">{data[0]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>As Matrices</b></TableCell>
            <TableCell align="right">{data[1]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Field of Definition</b></TableCell>
            <TableCell align="right">{data[1]}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
