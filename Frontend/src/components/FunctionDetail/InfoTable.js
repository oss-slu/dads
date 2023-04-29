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

const rows = [
  createData('1.2.f4075c4e', 'P1 -> P1', '[16x3-21y2: 16y2]', 2, 'QQ', 'QQ', 'QQ'),
];

export default function BasicTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><b>Label</b></TableCell>
            <TableCell align="right"><b>Domain</b></TableCell>
            <TableCell align="right"><b>Standard Model</b></TableCell>
            <TableCell align="right"><b>Degree</b></TableCell>
            <TableCell align="right"><b>Field of Definition</b></TableCell>
            <TableCell align="right"><b>Min Field of Definition</b></TableCell>
            <TableCell align="right"><b>Field of Modull</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.label}
            >
              <TableCell component="th" scope="row">
                {row.label}
              </TableCell>
              <TableCell align="right">{row.domain}</TableCell>
              <TableCell align="right">{row.standardModel}</TableCell>
              <TableCell align="right">{row.degree}</TableCell>
              <TableCell align="right">{row.fieldOfDef}</TableCell>
              <TableCell align="right">{row.minFieldOfDef}</TableCell>
              <TableCell align="right">{row.fieldOfModull}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}