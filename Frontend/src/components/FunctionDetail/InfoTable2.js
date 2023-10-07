import './../../App.css'

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(label, domain, standardModel, degree, fieldOfDef, minFieldOfDef, fieldOfModull) {
  return { label, domain, standardModel, degree, fieldOfDef, minFieldOfDef, fieldOfModull };
}

const familiesRows = [
  createData('1.2.09adbd9d.1', '[x + ty : y ]'),
];

const twistsRows = [
  createData(' ', ' '),
];

export default function InfoTable2() {
  return (
    <TableContainer className='table-component' component={Paper}>
      <h4>Keywords: Quadratic Polynomial</h4>
      <h4>Member of families: 1</h4>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><b>Label</b></TableCell>
            <TableCell align="right"><b>Model</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {familiesRows.map((row) => (
            <TableRow
              key={row.label}
            >
              <TableCell component="th" scope="row">
                {row.label}
              </TableCell>
              <TableCell align="right">{row.domain}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <h4>Rational Twists: None</h4>
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><b>Label</b></TableCell>
            <TableCell align="right"><b>Model</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {twistsRows.map((row) => (
            <TableRow
              key={row.label}
            >
              <TableCell component="th" scope="row">
                {row.label}
              </TableCell>
              <TableCell align="right">{row.domain}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}