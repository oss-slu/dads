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
            <TableCell align="right">{data.cardinality}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Field Label</b></TableCell>
            <TableCell align="right">{data.base_field_label}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Preperiodic Components</b></TableCell>
            <TableCell align="right">{data.preperiodic_components && data.preperiodic_components.length > 0 ? `[${data.preperiodic_components.join(', ')}]` : '[]'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Rational Preperiodic Points</b></TableCell>
            <TableCell align="right">{data.rational_periodic_points && data.rational_periodic_points.length > 0 ? `[${data.rational_periodic_points[0].join(', ')}]` : '[]'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>As Directed Graph</b></TableCell>
            <TableCell align="right">{"link"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Adjacency Matrix</b></TableCell>
            <TableCell align="right">{"link"}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}