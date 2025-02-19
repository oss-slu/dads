import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import HelpBox from '../FunctionDetail/HelpBox'

export default function AutomorphismGroupTable({ data }) {
  return (
    <TableContainer className='table-component' component={Paper}>
      <h3>Automorphism Group</h3>
      <h6>The groups of the function.</h6>
      <Table aria-label="simple table">
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row">
              <b>Cardinality</b>
              <HelpBox description="Shows how many elements are in the set." title="Cardinality" />
            </TableCell>
            <TableCell align="right">
              {data.automorphism_group_cardinality !== undefined 
              ? data.automorphism_group_cardinality 
              : "N/A"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              <b>Structure</b>
              <HelpBox description="The structure of the function." title="Structure" />
            </TableCell>
            <TableCell align="right">{"trivial"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              <b>As Matrices</b>
              <HelpBox description="The matrix." title="As Matrices" />
            </TableCell>
            <TableCell align="right">{"link"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              <b>Field of Definition</b>
              <HelpBox description="HD or 1080p" title="Field of Definition" />
            </TableCell>
            <TableCell align="right">{"QQ"}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}