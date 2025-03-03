import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import { processInput, renderExponent, splitOutermostCommas } from './ModelsTable';
import HelpBox from '../FunctionDetail/HelpBox'


export default function InfoTable({ data }) {
  const navigate = useNavigate();

  const handleLinkClick = (selection) => {
    navigate(`/family-details/${selection}`);
  };
  
  const standard_model = data.display_model;
  let polynomial;
  let modelKey;
  if (!standard_model) {
    modelKey= null;
    polynomial = null;
  }
  else if (standard_model==="monic centered"){
    modelKey= "monic_centered";
    polynomial = data.monic_centered;
  }

  else if (standard_model==="chebyshev"){
    modelKey= "original_model" // I see that polynomial of chebysev is similar in all models
    polynomial = data.original_model;
  }

  else {
    modelKey= `{standard_model}_model`; // I see in the display_model, there're only monic_centered, chebysev, and reduced
    // I do this just in case in the future we have more models
    polynomial= data[`${standard_model}_model`];
  }

  const labelDisplay = data.is_lattes ? (
    <a href={`https://www.lmfdb.org/EllipticCurve/${data.sigma_one}`} target="_blank" rel="noopener noreferrer">
      {data.sigma_one}
    </a>
  ) : data.modelLabel;



  let polynomialExpression;

  // For Newton polynomial
  if (data.is_newton) {
    const newtonPolynomial = data.newton_polynomial_coeffs;
    if (newtonPolynomial && newtonPolynomial.some(coeff => coeff !== null)) {
      //for non-null, it's just my assumption about formatting
      polynomialExpression = newtonPolynomial.map((coeff, index) => {
        const exponentX = newtonPolynomial.length - 1 - index; 
        const exponentY = index; 
        let term = '';
        if (coeff !== null && coeff !== 0) {
          if (exponentX > 0) term += `x^${exponentX}`;
          if (exponentY > 0) term += `y^${exponentY}`;
          return coeff === 1 ? term : `${coeff}*${term}`;
        }
      }).filter(Boolean).join(' + ');
    } 
  }
  
  if (polynomial) {
    const modelData= splitOutermostCommas(polynomial);
    polynomialExpression= renderExponent(processInput(modelData[0]));
  }
  console.log("Standard Model Name:", standard_model);
  console.log("Model Key Used:", modelKey);
  console.log("Polynomial Data Found:", polynomial);


  return (
    <TableContainer className='table-component' component={Paper}>
      <h3>Function Details</h3>
      <h6>The details of the function.</h6>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><b>Label</b><HelpBox description="Label" title="Label" /></TableCell>
            <TableCell align="right"><b>Domain</b><HelpBox description="Domain" title="Domain" /></TableCell>
            <TableCell align="right"><b>Standard Model</b><HelpBox description="Standard Model" title="Standard Model" /></TableCell>
            <TableCell align="right"><b>Degree</b><HelpBox description="Degree" title="Degree" /></TableCell>
            <TableCell align="right"><b>Field of Definition</b><HelpBox description="Field of Definition" title="Field of Definition" /></TableCell>
            <TableCell align="right"><b>Family</b><HelpBox description="Family" title="Family" /></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row">{labelDisplay}</TableCell> 
            <TableCell align="right">{data.base_field_label}</TableCell>
            <TableCell align="right">{polynomialExpression}</TableCell>
            <TableCell align="right">{data.degree}</TableCell>
            <TableCell align="right">
            <a
                href={`https://www.lmfdb.org/NumberField/${data.base_field_label}`}
                style={{ color: "blue", textDecoration: "underline" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.base_field_label}
              </a>
            </TableCell>
            <TableCell align="right">
              {data.family && (
                <button
                  onClick={() => handleLinkClick(data.family)}
                  style={{
                    border: "None",
                    color: "red",
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    cursor: "pointer"
                  }}
                >
                  {data.family}
                </button>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}