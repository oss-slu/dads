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
    if( modelKeys.includes("display_model")) {
	let position = modelKeys.indexOf("display_model");
	modelKeys.splice(position, 1);
    }

   const Superscript = ({ children }) => {
      return (
	<sup style={{ fontSize: '0.6em', verticalAlign: 'super' }}>
	  {children}
	</sup>
      );
    };

    const renderExponent = (expressionArray) => {
      const formattedExpressions = [];

      expressionArray.forEach((expression, index) => {
	const parts = expression.split(/(\^[\d]+)/);
	const formattedExpression = [];

	for (let i = 0; i < parts.length; i++) {
	  if (parts[i].startsWith('^')) {
	    const exponentValue = parts[i].slice(1);
	    formattedExpression.push(<Superscript key={i}>{exponentValue}</Superscript>);
	  } else {
	    formattedExpression.push(parts[i]);
	  }
	}

	formattedExpressions.push(
	  <React.Fragment key={index}>
	    {formattedExpression}
	    {index !== expressionArray.length - 1 && <span> : </span>}
	  </React.Fragment>
	);
      });

      return formattedExpressions;
    }; 
    

    function processInput(input) {
	// Remove outer braces and split by '},{' to get individual polynomial coefficient sets
	const polynomials = input.slice(2, -2).split('},{');
	
	const result = [];
	
	// Iterate over each polynomial
	for (let poly of polynomials) {
	    // Split the polynomial coefficients by ','
	    const coeffs = poly.split(',');
	    
	    // Construct the polynomial expression
	    let polynomialExpression = '';
	    for (let i = 0; i < coeffs.length; i++) {
		const coefficient = coeffs[i];
		if (coefficient !== '0') {
		    // Construct monomial expression based on index
		    let monomial = '';
		    if (i === 0) {
			monomial = 'x^' + (coeffs.length - 1);
		    } else if (i === coeffs.length - 1) {
			monomial = 'y^' + (coeffs.length - 1);
		    } else if (i === 1 && (coeffs.length - 1) === 1) {
			monomial = 'xy';
		    } else if (i === 1) {
			monomial = 'x^' + (coeffs.length - 1 - i) + 'y';
		    } else if ((coeffs.length - 1 - i) === 1) {
			monomial = 'x' + 'y^' + i;
		    } else {
			monomial = 'x^' + (coeffs.length - 1 - i) + 'y^' + i;
		    }
		    
		    // Add coefficient with monomial
		    if (coefficient === '1') {
			polynomialExpression += monomial;
		    } else if (coefficient === '-1') {
			polynomialExpression += '-' + monomial;
		    } else {
			polynomialExpression += coefficient + monomial;
		    }
		    
		    // Add '+' if not the last term and coefficient is not zero
		    // && coeffs[i + 1] !== '0'
		    if (i !== coeffs.length - 1 ) {
			polynomialExpression += '+';
		    }
		}
	    }
	    
	    // Push polynomial expression to result array
	    result.push(polynomialExpression);
	}
	
	return result;
    }

  return (
    <TableContainer className='table-component' component={Paper}>
      <h3>Models:</h3>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left"><b>Name</b></TableCell>
            <TableCell align="left"><b>Polynomials</b></TableCell>
            <TableCell align="left"><b>Resultant</b></TableCell>
            <TableCell align="left"><b>Primes of Bad Reduction</b></TableCell>
            <TableCell align="left"><b>Conjugation from Standard</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {modelKeys.map((key, index) => {
            const modelData = data[key] ? splitOutermostCommas(data[key]) : ['', '', '', '', '']; // Split data[key] or set default values if null
            return (
              <TableRow key={index}>
                <TableCell align="left">{key.replace(/_/g, ' ').replace(/ model$/, '') + " model"}</TableCell>
                <TableCell align="left">{renderExponent(processInput(modelData[0]))}</TableCell>
                <TableCell align="left">{modelData[1]}</TableCell>
                <TableCell align="left">{modelData[2]}</TableCell>
                <TableCell align="left">{modelData[5]}</TableCell>
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
