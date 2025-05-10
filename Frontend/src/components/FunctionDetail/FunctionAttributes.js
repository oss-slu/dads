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

        // Predefined Chebyshev polynomials for small degrees
      const getChebyshevPolynomial = (n) => {
        const predefinedPolynomials = [
          "[1 : 1]",
          "[x : y]",
          "[2x^2 - y^2 : y^2]",
          "[4x^3 - 3xy^2 : y^3]",
          "[8x^4 - 8x^2y^2 + y^4 : y^4]",
          "[16x^5 - 20x^3y^2 + 5xy^4 : y^5]",
          "[32x^6 - 48x^4y^2 + 18x^2y^4 - y^6 : y^6]",
          "[64x^7 - 112x^5y^2 + 56x^3y^4 - 7xy^6 : y^7]",
          "[128x^8 - 256x^6y^2 + 160x^4y^4 - 32x^2y^6 + y^8 : y^8]",
          "[256x^9 - 576x^7y^2 + 432x^5y^4 - 120x^3y^6 + 9xy^8 : y^9]",
          "[512x^10 - 1280x^8y^2 + 1120x^6y^4 - 400x^4y^6 + 50x^2y^8 - y^10 : y^10]"
        ];
      
        if (n <= predefinedPolynomials.length) {
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

  const isNewtonFunction = data.is_newton ? "True" : "False";
  var newtonPolynomial = "N/A";
  
  // Construct the Newton Polynomial if it exists
  if (data.is_newton && data.newton_polynomial_coeffs) {
    newtonPolynomial = "";
    var coefficients = data.newton_polynomial_coeffs;
    for (let i = 0; i < coefficients.length; i++) {
      if (Number(coefficients[i]) !== 0) {
        // Add plus or negative sign if needed
        if (newtonPolynomial !== "" && coefficients[i] > 0) {
          newtonPolynomial += "+ ";
        } else if (newtonPolynomial !== "" && coefficients[i] < 0) {
          newtonPolynomial += "- ";
        }

        // Add coefficient if needed
        if (i === 0) {
          newtonPolynomial += coefficients[i];
        } else if (coefficients[i] > 1) {
          newtonPolynomial += coefficients[i];
        } else if (coefficients[i] < -1) {
          newtonPolynomial += -(coefficients[i]);
        }

        // Add z variable if needed
        if (i > 0) {
          newtonPolynomial += "z";
          // Add exponents if needed
          if (i > 1) {
            newtonPolynomial += "^" + i;
          }
        }

        // Add space if needed
        if (i !== coefficients.length - 1) {
          newtonPolynomial += " ";
        }
      }
    }
    newtonPolynomial = renderExponent(["[" + newtonPolynomial + "]"]);
  }

    let chebyshevModel = getChebyshevPolynomial(data.degree);

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
          <TableCell>
            <b>Is Newton Function</b>
            <HelpBox description="True if this conjugacy class represents a function from Newton’s method: f(z) = z- F(z)/F'(z)" title="Is Newton Function" />
          </TableCell>
          {data.is_newton && (
            <TableCell>
              <b>Newton Polynomial</b>
            </TableCell>
          )}
          <TableCell>
            <b>Is Polynomial</b>
            <HelpBox description="True if this conjugacy class represents a polynomial map; i.e., if it has a totally ramified fixed point." title="Is Polynomial" />
          </TableCell>
          <TableCell>
            <b>Is Postcritically Finite (PCF)</b>
            <HelpBox description="True if every critical point is preperiodic." title="Is Postcritically Finite (PCF)" />
          </TableCell>
          <TableCell>
            <b>Is Lattès Function</b>
            <HelpBox description="True if this conjugacy class represents a Lattes function. Note that the label for Lattes maps contains the LMFDB label of the elliptic curve rather than the sigma invariants." title="Is Lattès Function" />
          </TableCell>
          <TableCell>
            <b>Is Chebyshev</b>
          </TableCell>
          {data.is_chebyshev && (
            <TableCell>
              <b>Chebyshev Model</b>
            </TableCell>
          )}
          <TableCell>
            <b>Automorphism Cardinality</b>
            <HelpBox description="Shows how many elements are in the set." title="Automorphism Cardinality" />
          </TableCell>
        </TableRow>

        {/* Row for values */}
        <TableRow>
          <TableCell>{isNewtonFunction}</TableCell>
          {data.is_newton && <TableCell>{newtonPolynomial}</TableCell>}
          <TableCell>{String(data.is_polynomial)}</TableCell>
          <TableCell>{String(data.is_pcf)}</TableCell>
          <TableCell>{String(data.is_lattes)} {lattesLink}</TableCell>
          <TableCell>{String(data.is_chebyshev)}</TableCell>
          {data.is_chebyshev && <TableCell>{chebyshevModel}</TableCell>}
          <TableCell>{data.automorphism_group_cardinality !== undefined ? data.automorphism_group_cardinality : "N/A"}</TableCell>
        </TableRow>
      </TableBody>
      </Table>
    </TableContainer>
  );
}
