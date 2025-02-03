import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';

const Superscript = ({ children }) => {
  return (
    <sup style={{ fontSize: '0.6em', verticalAlign: 'super' }}>
      {children}
    </sup>
  );
};

const renderExponent = (expressionArray) => {
  return expressionArray.map((expression, index) => {
    const parts = expression.split(/(\^[\d]+)/);
    const formattedExpression = parts.map((part, i) =>
      part.startsWith('^') ? <Superscript key={i}>{part.slice(1)}</Superscript> : part
    );

    return (
      <React.Fragment key={index}>
        {formattedExpression}
        {index !== expressionArray.length - 1 && <span> : </span>}
      </React.Fragment>
    );
  });
};

function processInput(input) {
  if (!input) return [];

  const polynomials = input.slice(2, -2).split('},{');
  return polynomials.map((poly) => {
    const coeffs = poly.split(',');
    let expression = '';

    coeffs.forEach((coefficient, i) => {
      if (coefficient !== '0') {
        let monomial = '';
        const d = coeffs.length - 1;
        
        if (i === 0) monomial = `x^${d}`;
        else if (i === d) monomial = `y^${d}`;
        else if (i === 1 && d === 1) monomial = 'xy';
        else if (i === 1) monomial = `x^${d - i}y`;
        else if (d - i === 1) monomial = `x y^${i}`;
        else monomial = `x^${d - i} y^${i}`;

        expression += coefficient === '1' ? monomial :
                      coefficient === '-1' ? `-${monomial}` :
                      `${coefficient}${monomial}`;

        if (i !== d) expression += '+';
      }
    });

    return expression;
  });
}


export default function InfoTable({ data }) {
  const navigate = useNavigate();

  const handleLinkClick = (selection) => {
    navigate(`/family-details/${selection}`);
  };
  console.log(data.display_model);
  return (
    <TableContainer className='table-component' component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><b>Label</b></TableCell>
            <TableCell align="right"><b>Domain</b></TableCell>
            <TableCell align="right"><b>Standard Model</b></TableCell>
            <TableCell align="right"><b>Degree</b></TableCell>
            <TableCell align="right"><b>Field of Definition</b></TableCell>
            <TableCell align="right"><b>Family</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row">{data.modelLabel}</TableCell>
            <TableCell align="right">{data.base_field_label}</TableCell>
            <TableCell align="right">
              {data.is_polynomial && data.models?.[data.display_model]?.polys_val
                ? renderExponent(processInput(data.models[data.display_model].polys_val[0]))
                : data.reduced_model || "N/A"}   
       
            </TableCell>
            <TableCell align="right">{data.degree}</TableCell>
            <TableCell align="right">
            <a
                href={`https://www.lmfdb.org/NumberFields/${data.base_field_label}`}
                style={{ color: "red", textDecoration: "none" }}
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