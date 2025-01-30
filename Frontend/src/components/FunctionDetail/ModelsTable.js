import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function ModelsTable({ data }) {
  // Filter relevant model keys, excluding 'display_model'
const modelKeys = Object.keys(data).filter(
    key => key.includes('_model') && key !== 'display_model'
  );

  const Superscript = ({ children }) => (
    <sup style={{ fontSize: '0.6em', verticalAlign: 'super' }}>{children}</sup>
  );

  const renderExponent = (expressionArray) => {
    return expressionArray.map((expression, index) => {
      const parts = expression.split(/(\^[\d]+)/);
      return (
        <React.Fragment key={index}>
          {parts.map((part, i) =>
            part.startsWith('^') ? (
              <Superscript key={i}>{part.slice(1)}</Superscript>
            ) : (
              part
            )
          )}
          {index !== expressionArray.length - 1 && <span> : </span>}
        </React.Fragment>
      );
    });
  };

  function processInput(input) {
    const polynomials = input.slice(2, -2).split('},{');
    return polynomials.map(poly => {
      const coeffs = poly.split(',');
      // Format polynomial expression: remove trailing '+' and wrap in parentheses
const formattedPoly = coeffs
        .map((coefficient, i) => {
          if (coefficient === '0') return '';
          const exponentX = coeffs.length - 1 - i;
          const exponentY = i;
          let monomial = '';
          if (exponentX > 0) monomial += `x^${exponentX}`;
          if (exponentY > 0) monomial += `y^${exponentY}`;
          return coefficient === '1' ? monomial : `${coefficient}${monomial}`;
        })
        .filter(Boolean)
        .join('+')
        .replace(/\+$/, ''); // Remove trailing + symbol // Remove trailing + symbol
      // Ensure polynomial expressions are enclosed in parentheses
return formattedPoly ? `(${formattedPoly})` : ''; // Add surrounding parentheses
    });
  }

  const splitOutermostCommas = (str) => {
    const parts = [];
    let temp = '';
    let openBrackets = 0;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === '{') openBrackets++;
      else if (str[i] === '}') openBrackets--;
      if (str[i] === ',' && openBrackets === 0) {
        parts.push(temp.trim().replace(/["()]/g, ''));
        temp = '';
      } else {
        temp += str[i];
      }
    }
    parts.push(temp.trim().replace(/["()]/g, ''));
    return parts;
  };

  // Filter out models that have no data to display
const relevantModels = modelKeys.filter(key => {
    const modelData = data[key] ? splitOutermostCommas(data[key]) : [];
    return modelData.some(value => value && value.trim() !== '');
  });

  return (
    <TableContainer className='table-component' component={Paper}>
      <h3>Models:</h3>
      <Table aria-label='models table'>
        <TableHead>
          <TableRow>
            <TableCell><b>Name</b></TableCell>
            <TableCell><b>Polynomials</b></TableCell>
            <TableCell><b>Resultant</b></TableCell>
            <TableCell><b>Primes of Bad Reduction</b></TableCell>
            <TableCell><b>Conjugation from Standard</b></TableCell>
            <TableCell><b>Field of Definition</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {relevantModels.map((key, index) => {
            const modelData = data[key] ? splitOutermostCommas(data[key]) : ['', '', '', '', ''];
            return (
              <TableRow key={index}>
                <TableCell>{key.replace(/_/g, ' ').replace(/ model$/, '') + ' model'}</TableCell>
                <TableCell>{renderExponent(processInput(modelData[0]))}</TableCell>
                <TableCell>{modelData[1]}</TableCell>
                <TableCell>{modelData[2]}</TableCell>
                <TableCell>{modelData[5]}</TableCell>
                <TableCell>{data.cp_field_of_defn || 'N/A'}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
