import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export const renderExponent = (expressionArray) => {
	const Superscript = ({ children }) => (
		<sup style={{ fontSize: '0.6em', verticalAlign: 'super' }}>{children}</sup>
	  );
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

export function processInput(input) {
	const polynomials = input.slice(2, -2).split('},{');
	const formattedPolynomials = polynomials.map(poly => {
	const coeffs = poly.split(',');
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
		.join(' + ')
		.replace(/\+ -/g, '- ') // Ensures correct spacing for negatives
		.replace(/\+$/, ''); // Remove trailing + symbol

	return formattedPoly;
	});
  
    // Return as an array containing one string (wrapped in brackets)
    return [`[${formattedPolynomials.join(' : ')}]`];
  }

export const splitOutermostCommas = (str) => {
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
  
export default function ModelsTable({ data }) {

    // Predefined Chebyshev polynomials for small degrees
    const chebyshevPolynomials = {
      0: "T₀(x) = 1",
      1: "T₁(x) = x",
      2: "T₂(x) = 2x² - 1",
      3: "T₃(x) = 4x³ - 3x",
      4: "T₄(x) = 8x⁴ - 8x² + 1",
      5: "T₅(x) = 16x⁵ - 20x³ + 5x",
      6: "T₆(x) = 32x⁶ - 48x⁴ + 18x² - 1",
      7: "T₇(x) = 64x⁷ - 112x⁵ + 56x³ - 7x",
      8: "T₈(x) = 128x⁸ - 256x⁶ + 160x⁴ - 32x² + 1",
      9: "T₉(x) = 256x⁹ - 576x⁷ + 432x⁵ - 120x³ + 9x"
    };

    const computeChebyshev = (n) => {
      if (n in chebyshevPolynomials) return chebyshevPolynomials[n];
  
      let T_prev = "x"; // T₁(x)
      let T_curr = "2x² - 1"; // T₂(x)
  
      for (let i = 2; i < n; i++) {
        let T_next = `2x(${T_curr}) - (${T_prev})`;
        T_prev = T_curr;
        T_curr = T_next;
      }
  
      return `T_${n}(x) = ${T_curr}`;
    };
  
    // Determine Chebyshev model
    let chebyshevModel = "Not Chebyshev";
    if (data.is_chebyshev) {
      chebyshevModel = data.degree < 10 ? chebyshevPolynomials[data.degree] : computeChebyshev(data.degree);
    }

	const modelKeys = Object.keys(data).filter(
		key => key.includes('_model') && key !== 'display_model'
		);
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
            <TableCell><b>Chebyshev Model</b></TableCell>
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
                <TableCell>{chebyshevModel}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}