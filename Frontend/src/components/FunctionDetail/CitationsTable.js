import './table.css'

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(name, description, link) {
  return { name, description, link };
}

const rows = [
  createData(
    'Bjorn Poonen',
    'The complete classificiation of rational preperiodic points of quadratic polynomials over Q: a refined conjecture.',
    'MathSciNet'
    ),
];

export default function CitationsTable() {
  return (
    <TableContainer className='table-component' component={Paper}>
        <h3>Citations:</h3>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.label}
            >
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.description}</TableCell>
              <TableCell align="right">{row.link}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}