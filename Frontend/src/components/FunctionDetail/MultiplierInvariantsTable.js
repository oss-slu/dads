/* DEPRECATED: This component is no longer used. If it is updated, please change export function name to MultiplierInvariantsTable().

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import HelpBox from '../FunctionDetail/HelpBox'

function createData(period, invariants) {
  return { period, invariants };
}

const rows = [
  createData(1, '[ 2, -21/4, 0 ]'),
  createData(2, '[ 12, -57/8, -185/4, 11025/256, 0 ]'),
  createData(3, '[ 56, 12243/16, 78533/8, 115410379/2048, 168851865/512, 7771042363/65536, -18732748229/32768, -421723143224271/16777216, 0 ]'),
];

export default function InfoTable() {
  return (
    <TableContainer className='table-component' component={Paper}>
      <h3>Multiplier Invariants (Sigma)</h3>
      <h6>Invariants of the function.</h6>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right"><b>Period</b><HelpBox description="Period" title="Period" /></TableCell>
            <TableCell align="right"><b>Invariants</b><HelpBox description="Invariants" title="Invariants" /></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.label}
            >
              <TableCell align="right">{row.period}</TableCell>
              <TableCell align="right">{row.invariants}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

*/