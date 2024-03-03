import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
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
            <TableCell align="right">{"tmp"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Postcritically Finite?</b></TableCell>
            <TableCell align="right">{String(data.is_pcf)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b># Post Critical Set</b></TableCell>
            <TableCell align="right">{"tmp"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Field of Definition</b></TableCell>
            <TableCell align="right">{"tmp"}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}