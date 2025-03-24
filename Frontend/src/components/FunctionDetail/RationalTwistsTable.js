import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function RationalTwistsTable({ data }) {
  console.log(data);

  return (
    <TableContainer component={Paper} className="table-component">
      <h3>Rational Twists</h3>
      <Table aria-label="rational twists table">
        <TableBody>
          {/* Header Row */}
          <TableRow>
            <TableCell><b>Function ID</b></TableCell>
            <TableCell><b>Rational Twists</b></TableCell>
          </TableRow>
          {/* Data Row */}
          <TableRow>
            <TableCell>{data.modelLabel}</TableCell>
            <TableCell>
              {data.rational_twists && data.rational_twists.length > 0 ? (
                data.rational_twists.map((id, index) => (
                  <React.Fragment key={id}>
                    <a href={`http://localhost:3000/system/${id}/`} target="_blank" rel="noopener noreferrer">
                      {id}
                    </a>
                    {index < data.rational_twists.length - 1 && ", "}
                  </React.Fragment>
                ))
              ) : "None"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}