import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function ModelsTable({ data }) {
  // Extracting keys containing "_model" from the data object
  const modelKeys = Object.keys(data).filter(key => key.includes("_model"));

  return (
    <TableContainer className='table-component' component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><b>Name</b></TableCell>
            <TableCell align="right"><b>Polynomials</b></TableCell>
            <TableCell align="right"><b>Resultant</b></TableCell>
            <TableCell align="right"><b>Primes of Bad Reduction</b></TableCell>
            <TableCell align="right"><b>Conjugation from Standard</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {modelKeys.map((key, index) => {
            const modelData = data[key] ? splitOutermostCommas(data[key]) : ['', '', '', '', '']; // Split data[key] or set default values if null
            return (
              <TableRow key={index}>
                <TableCell align="right"><b>{key}</b></TableCell>
                <TableCell align="right"><b>{modelData[0]}</b></TableCell>
                <TableCell align="right"><b>{modelData[1]}</b></TableCell>
                <TableCell align="right"><b>{modelData[2]}</b></TableCell>
                <TableCell align="right"><b>{modelData[3]}</b></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// Function to split the string at the outermost commas
const splitOutermostCommas = (str) => {
  const parts = [];
  let temp = '';
  let openBrackets = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '{') openBrackets++;
    else if (str[i] === '}') openBrackets--;
    if (str[i] === ',' && openBrackets === 0) {
      parts.push(temp.trim().replace(/["()]/g, '')); // Remove parentheses, curly braces, and double quotes
      temp = '';
    } else {
      temp += str[i];
    }
  }
  parts.push(temp.trim().replace(/["()]/g, '')); // Push the last part and remove characters
  return parts;
};

