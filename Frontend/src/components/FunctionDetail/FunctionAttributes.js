import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function FunctionAttributes({ data }) {
  const Superscript = ({ children }) => (
    <sup style={{ fontSize: '0.6em', verticalAlign: 'super' }}>{children}</sup>
  );

  const processInput = (input) => {
    const polynomialPart = input.match(/{{.*?}}/);
    if (!polynomialPart) return [];

    const polynomials = polynomialPart[0].slice(2, -2).split('},{');
    const result = [];

    for (let poly of polynomials) {
      const coeffs = poly.split(',');
      let polynomialExpression = '';
      for (let i = 0; i < coeffs.length; i++) {
        const coefficient = coeffs[i];
        if (coefficient !== '0') {
          let monomial = '';
          if (i === 0) monomial = 'x^' + (coeffs.length - 1);
          else if (i === coeffs.length - 1) monomial = 'y^' + (coeffs.length - 1);
          else if (i === 1 && (coeffs.length - 1) === 1) monomial = 'xy';
          else if (i === 1) monomial = 'x^' + (coeffs.length - 1 - i) + 'y';
          else if ((coeffs.length - 1 - i) === 1) monomial = 'x' + 'y^' + i;
          else monomial = 'x^' + (coeffs.length - 1 - i) + 'y^' + i;

          if (coefficient === '1') polynomialExpression += monomial;
          else if (coefficient === '-1') polynomialExpression += '-' + monomial;
          else polynomialExpression += coefficient + monomial;

          if (i !== coeffs.length - 1) polynomialExpression += '+';
        }
      }
      result.push(polynomialExpression);
    }

    return result;
  };

  const renderExponent = (expressionArray) => {
    return expressionArray.map((expression, index) => (
      <React.Fragment key={index}>
        {expression.split(/(\^[\d]+)/).map((part, i) =>
          part.startsWith('^') ? <Superscript key={i}>{part.slice(1)}</Superscript> : part
        )}
        {index < expressionArray.length - 1 && <span> : </span>}
      </React.Fragment>
    ));
  };

  const isNewtonFunction = data.is_newton ? "True" : "False";
  const newtonPolynomial = data.is_newton && data.newton_model
    ? renderExponent(processInput(data.newton_model))
    : "N/A";

  return (
    <TableContainer component={Paper} className="table-component">
      <h3>Function Attributes</h3>
      <Table aria-label="function attributes table">
        <TableBody>
          {/* Row for field labels */}
          <TableRow>
            <TableCell><b>Is Newton Function</b></TableCell>
            <TableCell><b>Is Polynomial</b></TableCell>
            <TableCell><b>Is Postcritically Finite (PCF)</b></TableCell>
            <TableCell><b>Is Lattès Function</b></TableCell>
            <TableCell><b>Is Chebyshev</b></TableCell>
            {data.is_newton && <TableCell><b>Associated Polynomial</b></TableCell>}
          </TableRow>
          {/* Row for values */}
          <TableRow>
            <TableCell>{isNewtonFunction}</TableCell>
            <TableCell>{String(data.is_polynomial)}</TableCell>
            <TableCell>{String(data.is_pcf)}</TableCell>
            <TableCell>{String(data.is_lattes)}</TableCell>
            <TableCell>{String(data.is_chebyshev)}</TableCell>
            {data.is_newton && <TableCell>{newtonPolynomial}</TableCell>}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
