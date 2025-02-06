import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AdjacencyMatrix from '../FunctionDetail/AdjacencyMatrix'
import Copy from '../FunctionDetail/Copy'

export default function CriticalPointPortraitTable({ data }) {
  const formatData = (key) => {
    const value = data[key];
  
    if (value === null || value === undefined) {
      return 'N/A';
    }
  
    if (Array.isArray(value)) {
      if (value.length > 0) {
        if (Array.isArray(value[0])) {
          return `[${value[0].join(', ')}]`;
        } else {
          return `[${value.join(', ')}]`;
        }
      }
      return '[]'; // Return '[]' for empty arrays
    } else {
      return value;
    }
  };
  
  if (data.is_pcf) {
    return (
      <TableContainer className='table-component' component={Paper}>
        <h3>Critical Point Portrait</h3>
        <Table aria-label="simple table">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row"><b>Cardinality</b></TableCell>
              <TableCell align="right">{formatData("cardinality")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row"><b>Size of Post Critical Set</b></TableCell>
              <TableCell align="right">{formatData("positive_in_degree")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row"><b>As Directed Graph</b></TableCell>
              <TableCell align="right">
                  <Copy edges={formatData("edges")} type={2} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row"><b>Adjacency Matrix</b></TableCell>
              <TableCell align="right">
                  <Copy edges={formatData("edges")} type={1} />
                  <br>
                  </br>
                  <AdjacencyMatrix modalTitle={"Adjacency Matrix"} edges={formatData("edges")} />
                </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row"><b>Cycle Lengths</b></TableCell>
              <TableCell align="right">{formatData("periodic_cycles")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row"><b>Component Sizes</b></TableCell>
              <TableCell align="right">{formatData("preperiodic_components")}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
 }
}