import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import { renderExponent, splitOutermostCommas, buildModelString } from './ModelsTable';
import HelpBox from '../FunctionDetail/HelpBox'
import { useEffect, useState } from 'react';
import { get_filtered_systems } from '../../api/routes';

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
// //For Lattes maps, the label is N.(LMFDB label).degree.M
//   const labelDisplay = data.is_lattes ? (
//     <a href={`https://www.lmfdb.org/EllipticCurve/Q/${data.sigma_one.replace(/[()]/g, '').replace('.', '/')}`} target="_blank" rel="noopener noreferrer">
//       {data.sigma_one}
//     </a>
//   ) : data.modelLabel; -> move to FunctionAttributes.js



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
  
  // Get information for domain
  const Domain = ({ id }) => {
    const [domainText, setDomainText] = useState(null);
  
    // Once the backend data gets received,
    // then update the domain text
    useEffect(() => {
      get_filtered_systems({N: [], function_id: id})
      .then(response => {
        // Get the system, then the second value (which is the domain)
        setDomainText(response.data.results[0][1]);
      })
      .catch(error => {
        console.error("Error fetching domain: ", error);
      });
    }, [id]);
  
    // While the domain is being retrieved, show loading text in meantime
    return <>{domainText || "Loading..."}</>;
};

  if (polynomial) {
    const modelData= splitOutermostCommas(polynomial);
    polynomialExpression= renderExponent([buildModelString(modelData[0], data.degree)]);
  }
  console.log("Standard Model Name:", standard_model);
  console.log("Model Key Used:", modelKey);
  console.log("Polynomial Data Found:", polynomial);

  // Map family_id values to there corresponding family names
  const familyMapping = {
    1: "poly_deg_2",
    2: "poly_deg_3"
  };


  return (
    <TableContainer className='table-component' component={Paper}>
      <h3>Function Details</h3>
      <h6>Basic data identifying this conjugacy class of dynamical systems.</h6>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><b>Label</b><HelpBox description="A unique identifier of the form N.S1.S2.M where N is the dimension of the domain, S1 is a hash of the sigma invariants of the fixed points, S2 is a hash of the sigma invariants of the points of period 2, and M is an ordinal to ensure uniqueness. For Lattes maps, the label is N.(LMFDB label).degree.M" title="Label" /></TableCell>
            <TableCell align="right"><b>Domain</b><HelpBox description="The ambient domain of the map; a project space" title="Domain" /></TableCell>
            <TableCell align="right"><b>Standard Model</b><HelpBox description="The typical representative polynomials of this conjugacy class." title="Standard Model" /></TableCell>
            <TableCell align="right"><b>Degree</b><HelpBox description="Degree of the homogeneous polynomials of a representative of this map." title="Degree" /></TableCell>
            <TableCell align="right"><b>Field of Definition</b><HelpBox description="The smallest field containing all coefficients of the standard representative polynomials." title="Field of Definition" /></TableCell>
            <TableCell align="right"><b>Family</b><HelpBox description="Identifier for families of maps this conjugacy class belongs to (e.g. degree 2 polynomials)." title="Family" /></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row">{data.modelLabel}</TableCell> 
            <TableCell align="right">P<sup>{<Domain id={data.function_id} />}</sup>{" "}{String.fromCharCode(8594)}{" "}P<sup>{<Domain id={data.function_id} />}</sup></TableCell>
            <TableCell align="right">{polynomialExpression}</TableCell>
            <TableCell align="right">{data.degree}</TableCell>
            <TableCell align="right">
            <a
                href={`https://www.lmfdb.org/NumberField/${data.functions_base_field_label}`}
                style={{
                  color: "blue",
                  textDecoration: "underline"
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.functions_base_field_label}
              </a>
            </TableCell>
            <TableCell align="right">
              {(data.family && data.family.length > 0) ? (
                <button
                  onClick={() => handleLinkClick(data.family)}
                  style={{
                    border: "None",
                    color: "blue",
                    textDecoration: "underline",
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    cursor: "pointer"
                  }}
                >
                  {/* Displays the mapped family name*/}
                  {familyMapping[data.family] || data.family}
                </button>
              ) : "N/A"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
