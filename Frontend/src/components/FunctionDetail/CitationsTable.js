import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function CitationsTable({ data }) {
  const hasCitations = data.citation_id != null;

  return (
    <TableContainer className='table-component' component={Paper}>
      <h3>Citations:</h3>
      <Table aria-label="simple table">
        <TableBody>
          {hasCitations ? (
              <TableRow>
                <TableCell component="th" scope="row">{data.citation}</TableCell>
              </TableRow>
          ) : (
            <TableRow>
              <TableCell colSpan={3}>No citation available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}