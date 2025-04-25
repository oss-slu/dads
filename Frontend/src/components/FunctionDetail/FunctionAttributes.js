import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import HelpBox from '../FunctionDetail/HelpBox'

export default function FunctionAttributes({ data }) {
  const Superscript = ({ children }) => (
    <sup style={{ fontSize: '0.6em', verticalAlign: 'super' }}>{children}</sup>
  );

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
  var newtonPolynomial = "N/A";
  
  // Construct the Newton Polynomial if it exists
  if (data.is_newton && data.newton_polynomial_coeffs) {
    newtonPolynomial = "";
    var coefficients = data.newton_polynomial_coeffs;
    for (let i = 0; i < coefficients.length; i++) {
      if (coefficients[i] != 0) {
        // Add coefficient if needed
        if (i > 0 && coefficients[i] != 1) {
          newtonPolynomial += coefficients[i];
        }

        // Add x variable if needed
        if (i > 0) {
          newtonPolynomial += "z";
          // Add exponents if needed
          if (i > 1) {
            newtonPolynomial += "^" + i;
          }
        }
        // Add plus sign if needed
        if (i !== coefficients.length - 1) {
          newtonPolynomial += " + ";
        }
      }
    }
    newtonPolynomial = renderExponent([newtonPolynomial]);
  }
  //For Lattes maps, the label is N.(LMFDB label).degree.M
  const lattesLink = data.is_lattes ? (
    <a href={`https://www.lmfdb.org/EllipticCurve/Q/${data.sigma_one.replace(/[()]/g, '').replace(/\./, '/').replace(/([a-z])(\d+)/, "$1/$2")}`} target="_blank" rel="noopener noreferrer">
      {data.sigma_one}
    </a>
  ) : null;

  return (
    <TableContainer component={Paper} className="table-component">
      <h3>Function Attributes</h3>
      <h6>Attributes identifying the type of conjugacy class.</h6>
      <Table aria-label="function attributes table">
        <TableBody>
          {/* Row for field labels */}
          <TableRow>
            <TableCell><b>Is Newton Function</b><HelpBox description="True if this conjugacy class represents a function from Newton’s method: f(z) = z- F(z)/F'(z)" title="Is Newton Function" /></TableCell>
            <TableCell><b>Is Polynomial</b><HelpBox description="True if this conjugacy class represents a polynomial map; i.e., if it has a totally ramified fixed point." title="Is Polynomial" /></TableCell>
            <TableCell><b>Is Postcritically Finite (PCF)</b><HelpBox description="True if every critical point is preperiodic." title="Is Postcritically Finite (PCF)" /></TableCell>
            <TableCell><b>Is Lattès Function</b><HelpBox description="True if this conjugacy class represents a Lattes function. Note that the label for Lattes maps contains the LMFDB label of the elliptic curve rather than the sigma invariants." title="Is Lattès Function" /></TableCell>
            <TableCell><b>Is Chebyshev</b></TableCell>
            {data.is_newton && <TableCell><b>Associated Polynomial</b></TableCell>}
            <TableCell><b>Automorphism Cardinality</b><HelpBox description="Shows how many elements are in the set." title="Automorphism Cardinality" /></TableCell>
          </TableRow>
          {/* Row for values */}
          <TableRow>
            <TableCell>{isNewtonFunction}</TableCell>
            <TableCell>{String(data.is_polynomial)}</TableCell>
            <TableCell>{String(data.is_pcf)}</TableCell>
            {/* <TableCell>{String(data.is_lattes)}</TableCell> */}
            <TableCell>{String(data.is_lattes)} {lattesLink}</TableCell>
            <TableCell>{String(data.is_chebyshev)}</TableCell>
            {data.is_newton && <TableCell>{newtonPolynomial}</TableCell>}
            <TableCell>{data.automorphism_group_cardinality !== undefined ? data.automorphism_group_cardinality: "N/A"}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
