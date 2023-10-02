import './../../App.css'
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(name, polynomials, resultant, primes, conjugation) {
  return { name, polynomials, resultant, primes, conjugation };
}

const rows = [
  createData('Standard', '[ 16x -21y: 16y ]', '65536 = 2^16', 2, '[1 0]\n[0 1]'),
  createData('Reduced', '[ x^2-3xy: 2y^2 ]', '4 = 2^2', 2, '[2 -3]\n[0 4]'),
  createData('Monic Centered', '[ x^2-21y: 16y ]', '65536 = 2^16', 2, '[1 0]\n[0 1]'),
  createData('Numerical', '[ x^2-1.3215y: y^2 ]', 'N/A', 'N/A', 'N/A'),
  ];

export default function ModelsTable() {
  return (
    <TableContainer className='table-component' component={Paper}>
      <h3>Models:</h3>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><b>Name</b></TableCell>
            <TableCell align="right"><b>Polynomials</b></TableCell>
            <TableCell align="right"><b>Resultant</b></TableCell>
            <TableCell align="right"><b>Primes of Bad Reduction</b></TableCell>
            <TableCell align="right"><b>Conjugation from Standard</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.label}
            >
              <TableCell>{row.name}</TableCell>
              <TableCell align="right">{row.polynomials}</TableCell>
              <TableCell align="right">{row.resultant}</TableCell>
              <TableCell align="right">{row.primes}</TableCell>
              <TableCell align="right">{row.conjugation}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}