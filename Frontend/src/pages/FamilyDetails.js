import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { get_family } from '../api/routes';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';

function FamilyDetailsTable({ family }) {
  const Superscript = ({ children }) => {
    return (
      <sup style={{ fontSize: '0.6em'}}>
        {children}
      </sup>
    );
  };

  const renderExponent = (expression) => {
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
    return formattedExpression;
  };

  const formatModelCoeffs = (coeffs) => {
    if (!Array.isArray(coeffs)) return 'N/A';
    
    const formatSinglePolynomial = (poly) => {
      if (!Array.isArray(poly)) return '';
      
      let terms = [];
      
      // Process each coefficient
      poly.forEach((coeff, index) => {
        // More robust zero checking
        if (coeff === "0" || coeff === 0 || coeff === "0.0" || coeff === 0.0) {
          console.log(`Skipping zero coefficient: ${coeff} (type: ${typeof coeff})`);
          return;
        }
        
        let term = '';
        
        // Handle coefficient part
        if (typeof coeff === 'string') {
          // For parametric coefficients like 't'
          term = coeff;
        } else if (coeff === 1) {
          // Only show coefficient 1 if it's the constant term (index 0)
          term = index === 0 ? '1' : '';
        } else if (coeff === -1) {
          term = '-';
        } else {
          term = coeff.toString();
        }
        
        // Add variable and power if needed
        if (index > 0) {
          if (term === '') {
            term = 'x';
          } else if (term === '-') {
            term = '-x';
          } else {
            term += 'x';
          }
          
          if (index > 1) {
            term += `^${index}`;
          }
        }
        
        terms.push(term);
      });
      
      // If no terms (all zeros), return 0
      if (terms.length === 0) return '0';
      
      // Join terms with proper plus signs
      return terms.reduce((acc, term, idx) => {
        if (idx === 0) return term;
        return term.startsWith('-') ? `${acc}${term}` : `${acc}+${term}`;
      }, '');
    };
    
    // Format both polynomials and combine with : between them
    const firstPoly = formatSinglePolynomial(coeffs[0]);
    const secondPoly = formatSinglePolynomial(coeffs[1]);
    return <>[{renderExponent(firstPoly)} : {renderExponent(secondPoly)}]</>;
  };

  const formatCitations = (citations) => {
    if (!Array.isArray(citations)) return 'N/A';
    return citations.join(', ');
  };

  return (
    <TableContainer className='table-component' component={Paper}>
      <h3>Family Details</h3>
      <Table aria-label="family details table">
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row"><b>Family ID</b></TableCell>
            <TableCell align="right">{family[0]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Name</b></TableCell>
            <TableCell align="right">{family[1]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Degree</b></TableCell>
            <TableCell align="right">{family[2]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Num Parameters</b></TableCell>
            <TableCell align="right">{family[3]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Model Coeffs</b></TableCell>
            <TableCell align="right">{formatModelCoeffs(family[4])}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Model Resultant</b></TableCell>
            <TableCell align="right">{family[5]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Base Field Label</b></TableCell>
            <TableCell align="right">{family[6]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Base Field Degree</b></TableCell>
            <TableCell align="right">{family[7]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Sigma One</b></TableCell>
            <TableCell align="right">{family[8]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Sigma Two</b></TableCell>
            <TableCell align="right">{family[9]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Ordinal</b></TableCell>
            <TableCell align="right">{family[10]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Citations</b></TableCell>
            <TableCell align="right">{formatCitations(family[11])}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Is Polynomial</b></TableCell>
            <TableCell align="right">{family[12] ? 'Yes' : 'No'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Num Critical Points</b></TableCell>
            <TableCell align="right">{family[13]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"><b>Automorphism Group Cardinality</b></TableCell>
            <TableCell align="right">{family[14]}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function FamilyDetails() {
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { familyId } = useParams();

  useEffect(() => {
    const fetchFamily = async () => {
      try {
        const result = await get_family(familyId);
        setFamily(result.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch family details. Please try again later.');
        setLoading(false);
      }
    };

    fetchFamily();
  }, [familyId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!family) return <div>No family found with the given ID.</div>;

  return (
    <div className="family-details">
      <div className="info-container">
        <div className="row">
          <FamilyDetailsTable family={family} />
        </div>
      </div>
    </div>
  );
}

export default FamilyDetails;