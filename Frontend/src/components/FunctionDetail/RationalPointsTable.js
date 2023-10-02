import './../../App.css'
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(label, domain, standardModel, degree, fieldOfDef, minFieldOfDef, fieldOfModull) {
  return { label, domain, standardModel, degree, fieldOfDef, minFieldOfDef, fieldOfModull };
}

const rows = [
  createData('Cardinality', 9),
  createData('Cycle Sizes', 'P1 -> P1'),
  createData('Component Sizes', '[16x3-21y2: 16y2]'),
  createData('As Directed Graph', '2'),
  createData('Adjacency Matrix', 'QQ'),
];

export default function RationalPointsTable() {
  return (
    <TableContainer className='table-component' component={Paper}>
      <h3>Rational Preperiodic Points</h3>
      <Table aria-label="simple table">
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.label}
            >
              <TableCell component="th" scope="row">
                <b>{row.label}</b>
              </TableCell>
              <TableCell align="right">{row.domain}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
