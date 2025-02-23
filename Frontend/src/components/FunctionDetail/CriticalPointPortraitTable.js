import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AdjacencyMatrix from '../FunctionDetail/AdjacencyMatrix'
import Copy from '../FunctionDetail/Copy'
import HelpBox from '../FunctionDetail/HelpBox'

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
        <h6>The critical points of the portrait.</h6>
        <Table aria-label="simple table">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                <b>Cardinality</b>
                <HelpBox description="The cardinality shows how many elements are there." title="Cardinality" />
              </TableCell>
              <TableCell align="right">{formatData("cardinality")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <b>Size of Post Critical Set</b>
                <HelpBox description="Shows how many elements are in the post critical set." title="Size of Post Critical Set" />
              </TableCell>
              <TableCell align="right">{formatData("positive_in_degree")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <b>As Directed Graph</b>
                <HelpBox description="Shows the data as a graph." title="As Directed Graph" />
              </TableCell>
              <TableCell align="right">
                  <Copy edges={formatData("edges")} type={2} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <b>Adjacency Matrix</b>
                <HelpBox description="Generates a matrix based on the given data." title="Adjancency Matrix" />
              </TableCell>
              <TableCell align="right">
                  <Copy edges={formatData("edges")} type={1} />
                  <br>
                  </br>
                  <AdjacencyMatrix modalTitle={"Adjacency Matrix"} edges={formatData("edges")} />
                </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <b>Cycle Lengths</b>
                <HelpBox description="Shows how many times you can go around in a cycle." title="Cycle Lengths" />
              </TableCell>
              <TableCell align="right">{formatData("periodic_cycles")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <b>Component Sizes</b>
                <HelpBox description="The size of the matrix idk." title="Component Sizes" />
              </TableCell>
              <TableCell align="right">{formatData("preperiodic_components")}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
 }
}