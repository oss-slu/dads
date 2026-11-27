import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { get_family } from '../api/routes';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function FamilyDetailsTable({ family }) {
  const formatModelCoeffs = (coeffs) => {
    const superscripts = {"0": "\u2070",
      "1": "\u00B9",
      "2": "\u00B2",
      "3": "\u00B3",
      "4": "\u2074",
      "5": "\u2075",
      "6": "\u2076",
      "7": "\u2077",
      "8": "\u2078",
      "9": "\u2079"};

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

  const formatCitations = (citations) => {
    // Separate array, return single string, or show None
    if (Array.isArray(citations)) {
      return citations.join(', ');
    } else if (typeof citations === 'string') {
      return citations;
    } else {
      return 'None';
    }
  };

  return (
    <>
      <TableContainer className='table-component' component={Paper}>
        <h3>General Information</h3>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Degree</b></TableCell>
              <TableCell><b>Model Coeffs</b></TableCell>
              <TableCell><b>Base Field Label</b></TableCell>
              <TableCell><b>Sigma One</b></TableCell>
              <TableCell><b>Sigma Two</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{family.name}</TableCell>
              <TableCell>{family.degree}</TableCell>
              <TableCell>{formatModelCoeffs(family.model_coeffs)}</TableCell>
              <TableCell>{family.base_field_label}</TableCell>
              <TableCell>{family.sigma_one}</TableCell>
              <TableCell>{family.sigma_two}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer className='table-component' component={Paper}>
        <h3>Mathematical Properties</h3>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Model Resultant</b></TableCell>
              <TableCell><b>Is Polynomial</b></TableCell>
              <TableCell><b>Num Critical Points</b></TableCell>
              <TableCell><b>Automorphism Group Cardinality</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{family.model_resultant}</TableCell>
              <TableCell>{family.is_polynomial ? 'Yes' : 'No'}</TableCell>
              <TableCell>{family.num_critical_points}</TableCell>
              <TableCell>{family.automorphism_group_cardinality}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer className='table-component' component={Paper}>
        <h3>Citations</h3>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>{formatCitations(family.citation)}</TableCell>
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
