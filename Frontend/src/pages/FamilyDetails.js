import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { get_family } from '../api/routes';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';

function FamilyDetailsTable({ family }) {
  const formatModelCoeffs = (coeffs) => {
    const superscripts = {
      "0": "\u2070",
      "1": "\u00B9",
      "2": "\u00B2",
      "3": "\u00B3",
      "4": "\u2074",
      "5": "\u2075",
      "6": "\u2076",
      "7": "\u2077",
      "8": "\u2078",
      "9": "\u2079"
    };
  
    // Helper function to convert a number to superscript
    const toSuperscript = (num) => {
      return String(num).split("").map(digit => superscripts[digit]).join("");
    };
  
    // For your example input [[1,0,t], [0,0,1]], we want to form [x² + ty², y²]
    let result = coeffs.map((poly, polyIndex) => {
      let terms = [];
      let degree = poly.length - 1;
  
      for (let i = 0; i < poly.length; i++) {
        const coeff = poly[i];
        const xPower = degree - i;
        const yPower = i;  // y power increases as x power decreases
  
        // Skip terms with coefficient "0"
        if (coeff === "0") continue;
  
        let term = "";
        
        // Handle coefficient
        if (coeff !== "1" || (xPower === 0 && yPower === 0)) {
          term += coeff;
        }
  
        // Add x term if needed
        if (xPower > 0) {
          term += "x";
          if (xPower > 1) {
            term += toSuperscript(xPower);
          }
        }
  
        // Add y term if needed
        if (yPower > 0) {
          term += "y";
          if (yPower > 1) {
            term += toSuperscript(yPower);
          }
        }
  
        terms.push(term);
      }
  
      return terms.join(" + ") || "0";
    });
  
    // Wrap the result in square brackets
    return `[${result.join(", ")}]`;
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
        console.error('Error fetching family details:', error);
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