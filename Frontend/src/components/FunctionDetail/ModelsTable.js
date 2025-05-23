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

  export function buildModelString(originalModelString, degree) {
    var monomialList = [];

    if (!degree) {
      return "";
    }

    // Build homogenized variables (based from Dr. Hutz written function)
    for (let i = 0; i <= degree; i++) {
        if (i === 0) {
            monomialList.push("x^" + degree);
        } else if (i === degree) {
            monomialList.push("y^" + degree);
        } else {
            if ((degree - i) === 1 && i === 1) {
                monomialList.push("xy");
            } else if (i === 1) {
                monomialList.push("x^" + (degree - i) + "y");
            } else if ((degree - i) === 1) {
                monomialList.push("x" + "y^" + i);
            } else {
                monomialList.push("x^" + (degree - i) + "y^" + i);
            }
        }
    }

    // The cofficient list is created by removing outer braces, splitting by inner braces, and 
    // then creating an array of numbers by splitting by commas
    // This list should have 2 rows
    var coefficientList = originalModelString.slice(2, -2).split('},{').map(entry => entry.split(','));

    // The following code formats the polynomial correctly
    // I tried to handle all cases (e.g. negative coefficients, + -)
    let formattedPolynomial = '[';

    for (let i = 0; i < 2; i++) {
        let isFirstTerm = true;

        for (let j = 0; j <= degree; j++) {
            const coefficient = coefficientList[i][j];

            if (coefficient !== "0") {
                // Adds plus or minus signs
                if (!isFirstTerm && !coefficient.startsWith('-')) {
                    formattedPolynomial += " + ";
                } else if (!isFirstTerm && coefficient.startsWith('-')) {
                  formattedPolynomial += " - ";
                } else if (isFirstTerm && coefficient.startsWith('-')) {
                  formattedPolynomial += "-";
                }

                // Adds coefficients correctly
                if (coefficient === "1" || coefficient === "-1") {
                    formattedPolynomial += monomialList[j];
                } else if (coefficient.startsWith("-")) {
                    formattedPolynomial += coefficient.slice(1) + monomialList[j];
                } else {
                    formattedPolynomial += coefficient + monomialList[j];
                }

                isFirstTerm = false;
            }
        }

        if (i === 0) {
            formattedPolynomial += " : ";
        }
    }

    formattedPolynomial += "]";
    return formattedPolynomial;
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
    // Retrieve all valid model strings to parse through
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
      <Table aria-label='models table' data-testid="models-table">
        <TableHead>
          <TableRow>
            <TableCell><b>Name</b><HelpBox description="Name of the representative model" title="Name" /></TableCell>
            <TableCell><b>Polynomials</b><HelpBox description="The defining polynomials of the representative model" title="Polynomials" /></TableCell>
            <TableCell><b>Resultant</b><HelpBox description="The resultant of the defining polynomials of the representative model" title="Resultant" /></TableCell>
            <TableCell><b>Primes of Bad Reduction</b><HelpBox description="The primes when the representative model has bad reduction, i.e., the primes dividing the resultant" title="Primes of Bad Reduction" /></TableCell>
            <TableCell><b>Field of Definition</b><HelpBox description="The smallest field containing all coefficients of this representative model" title="Field of Definition" /></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {relevantModels.map((key, index) => {
            const modelData = data[key] ? splitOutermostCommas(data[key]) : ['', '', '', '', ''];
            return (
              <TableRow key={index}>
                <TableCell>{key.replace(/_/g, ' ').replace(/ model$/, '') + ' model'}</TableCell>
                <TableCell>{renderExponent([buildModelString(modelData[0], data.degree)])}</TableCell>
                <TableCell>{modelData[1]}</TableCell>
                <TableCell>{modelData[2]}</TableCell>
                <TableCell>{data.cp_field_of_defn ? (
                <a
                  href={`https://www.lmfdb.org/NumberField/${data.cp_field_of_defn}`}
                  style={{
                    color: "blue",
                    textDecoration: "underline"
                  }}
                  target="_blank"
                  rel="noopener noreferrer">
                    {data.cp_field_of_defn}
                </a>): ('N/A')}
                </TableCell>
              </TableRow>

            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}