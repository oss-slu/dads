import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function CriticalPointsTable({ data }) {
  return (
    <TableContainer className='table-component' component={Paper}>
      <h3>Critical Points</h3>
      <Table aria-label="simple table">
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row"><b>Postcritically Finite?</b></TableCell>
            <TableCell align="right">{String(data.is_pcf)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Critical Points Cardinality</b></TableCell>
            <TableCell align="right">{data.cp_cardinality || "N/A"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Field of Definition</b></TableCell>
            <TableCell align="right">{data.cp_field_of_defn || "N/A"}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}