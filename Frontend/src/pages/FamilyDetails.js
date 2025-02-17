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
    const toSuperscript = (num) => String(num).split("").map(digit => superscripts[digit]).join("");
    let result = coeffs.map((poly, polyIndex) => {
      let terms = [];
      let degree = poly.length - 1;
      for (let i = 0; i < poly.length; i++) {
        const coeff = poly[i];
        const xPower = degree - i;
        const yPower = i;
        if (coeff === "0") continue;
        let term = "";
        if (coeff !== "1" || (xPower === 0 && yPower === 0)) term += coeff;
        if (xPower > 0) term += "x" + (xPower > 1 ? toSuperscript(xPower) : "");
        if (yPower > 0) term += "y" + (yPower > 1 ? toSuperscript(yPower) : "");
        terms.push(term);
      }
      return terms.join(" + ") || "0";
    });
    return `[${result.join(", ")}]`;
  };

  const formatCitations = (citations) => Array.isArray(citations) ? citations.join(', ') : 'N/A';

  return (
    <>
      <TableContainer className='table-component' component={Paper}>
        <h3>General Information</h3>
        <Table>
          <TableBody>
            {[['Name', family[1]], ['Degree', family[2]], ['Model Coeffs', formatModelCoeffs(family[4])],
              ['Base Field Label', family[6]], ['Sigma One', family[8]], ['Sigma Two', family[9]]].map(([label, value]) => (
              <TableRow key={label}>
                <TableCell><b>{label}</b></TableCell>
                <TableCell align="right">{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer className='table-component' component={Paper}>
        <h3>Properties</h3>
        <Table>
          <TableBody>
            {[['Model Resultant', family[5]], ['Is Polynomial', family[12] ? 'Yes' : 'No'], 
              ['Num Critical Points', family[13]], ['Automorphism Group Cardinality', family[14]]].map(([label, value]) => (
              <TableRow key={label}>
                <TableCell><b>{label}</b></TableCell>
                <TableCell align="right">{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer className='table-component' component={Paper}>
        <h3>Citations</h3>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>{formatCitations(family[11])}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
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
