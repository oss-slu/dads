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
  createData('Label', '1.2.f4075c4e'),
  createData('Domain', 'P1 -> P1'),
  createData('Standard Model', '[16x3-21y2: 16y2]'),
  createData('Degree', '2'),
  createData('Field of Definition', 'QQ'),
  createData('Min Field of Definition', 'QQ'),
  createData('Field of Modull', 'QQ'),
];

export default function InfoTable3() {
  return (
    <TableContainer className='table-component' component={Paper}>
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
