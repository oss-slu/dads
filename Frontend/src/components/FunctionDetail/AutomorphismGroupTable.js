import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function AutomorphismGroupTable({ data }) {
function createData(label, value) {
  return { label, value };
}

const rows = [
  createData('Cardinality', 1),
  createData('Structure', 'trivial'),
  createData('As Matrices', 'link'),
  createData('Field of Definition', 'QQ'),
];

export default function InfoTable3() {
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
            <TableCell align="right">{"trivial"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>As Matrices</b></TableCell>
            <TableCell align="right">{"link"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Field of Definition</b></TableCell>
            <TableCell align="right">{"QQ"}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
