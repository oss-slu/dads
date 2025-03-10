import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import HelpBox from '../FunctionDetail/HelpBox'

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
    const getChebyshevPolynomial = (n) => {
      const predefinedPolynomials = {
        2: "[2x^2 - y^2, y^2] 4 [2]",
        3: "[4x^3 - 3xy^2, y^3] 64 [2]",
        4: "[8x^4 - 8x^2y^2 + y^4, y^4] 4096 [2]",
        5: "[16x^5 - 20x^3y^2 + 5xy^4, y^5] 1048576 [2]",
        6: "[32x^6 - 48x^4y^2 + 18x^2y^4 - y^6, y^6] 1073741824 [2]",
        7: "[64x^7 - 112x^5y^2 + 56x^3y^4 - 7xy^6, y^7] 4398046511104 [2]",
        8: "[128x^8 - 256x^6y^2 + 160x^4y^4 - 32x^2y^6 + y^8, y^8] 72057594037927936 [2]",
        9: "[256x^9 - 576x^7y^2 + 432x^5y^4 - 120x^3y^6 + 9xy^8, y^9] 4722366482869645213696 [2]"
      };
    
      if (predefinedPolynomials[n]) {
        return renderExponent([predefinedPolynomials[n]]);
      }
    
      // Dynamically compute for higher degrees if not predefined
      let T_prev = "x"; // T₁(x)
      let T_curr = "2*x^2 - 1"; // T₂(x)
    
      for (let i = 2; i < n; i++) {
        let T_next = `2*x*(${T_curr}) - (${T_prev})`;
        T_prev = T_curr;
        T_curr = T_next;
      }
    
      return renderExponent([`T_${n}(x) = ${T_curr}`]);
    };
    
    // Usage within the table or elsewhere
    let chebyshevModel = "Not Chebyshev";
    if (data.is_chebyshev) {
      chebyshevModel = getChebyshevPolynomial(data.degree);
    }

	const modelKeys = Object.keys(data).filter(
		key => (key.includes('_model') && key !== 'display_model') || key === 'monic_centered'
		);
	// Filter out models that have no data to display
	const relevantModels = modelKeys.filter(key => {
	const modelData = data[key] ? splitOutermostCommas(data[key]) : [];
	return modelData.some(value => (value && value.trim() !== ''));
	});

  return (
    <TableContainer className='table-component' component={Paper}>
      <h3>Models:</h3>
      <h6>Several different representatives of this conjugacy class. May include: monic centered, reduced, and the original model found in the literature.</h6>
      <Table aria-label='models table'>
        <TableHead>
          <TableRow>
            <TableCell><b>Name</b><HelpBox description="Name of the representative model" title="Name" /></TableCell>
            <TableCell><b>Polynomials</b><HelpBox description="The defining polynomials of the representative model" title="Polynomials" /></TableCell>
            <TableCell><b>Resultant</b><HelpBox description="The resultant of the defining polynomials of the representative model" title="Resultant" /></TableCell>
            <TableCell><b>Primes of Bad Reduction</b><HelpBox description="The primes when the representative model has bad reduction, i.e., the primes dividing the resultant" title="Primes of Bad Reduction" /></TableCell>
            <TableCell><b>Field of Definition</b><HelpBox description="The smallest field containing all coefficients of this representative model" title="Field of Definition" /></TableCell>
            <TableCell><b>Chebyshev model</b></TableCell>
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
