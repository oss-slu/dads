import React, { useState, useEffect } from 'react';
import { get_all_families } from '../api/routes';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function FamilyDetails() {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        const result = await get_all_families();
        setFamilies(result.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching families:', error);
        setError('Failed to fetch families. Please try again later.');
        setLoading(false);
      }
    };

    fetchFamilies();
  }, []);

  // Function to format the model_coeffs array
  const formatModelCoeffs = (coeffs) => {
    if (!Array.isArray(coeffs)) return 'N/A';
    return coeffs.map(row => `[${row.join(', ')}]`).join(', ');
  };

  // Function to format the citations array
  const formatCitations = (citations) => {
    if (!Array.isArray(citations)) return 'N/A';
    return citations.join(', ');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="family-details">
      <h1>Family Details</h1>
      <div className="info-container">
        <div className="row">
          <TableContainer className='table-component' component={Paper}>
            <Table aria-label="families table">
              <TableHead>
                <TableRow>
                  <TableCell><b>Family ID</b></TableCell>
                  <TableCell><b>Name</b></TableCell>
                  <TableCell><b>Degree</b></TableCell>
                  <TableCell><b>Num Parameters</b></TableCell>
                  <TableCell><b>Model Coeffs</b></TableCell>
                  <TableCell><b>Model Resultant</b></TableCell>
                  <TableCell><b>Base Field Label</b></TableCell>
                  <TableCell><b>Base Field Degree</b></TableCell>
                  <TableCell><b>Sigma One</b></TableCell>
                  <TableCell><b>Sigma Two</b></TableCell>
                  <TableCell><b>Ordinal</b></TableCell>
                  <TableCell><b>Citations</b></TableCell>
                  <TableCell><b>Is Polynomial</b></TableCell>
                  <TableCell><b>Num Critical Points</b></TableCell>
                  <TableCell><b>Automorphism Group Cardinality</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {families.map((family) => (
                  <TableRow key={family[0]}>
                    <TableCell>{family[0]}</TableCell>
                    <TableCell>{family[1]}</TableCell>
                    <TableCell>{family[2]}</TableCell>
                    <TableCell>{family[3]}</TableCell>
                    <TableCell>{formatModelCoeffs(family[4])}</TableCell>
                    <TableCell>{family[5]}</TableCell>
                    <TableCell>{family[6]}</TableCell>
                    <TableCell>{family[7]}</TableCell>
                    <TableCell>{family[8]}</TableCell>
                    <TableCell>{family[9]}</TableCell>
                    <TableCell>{family[10]}</TableCell>
                    <TableCell>{formatCitations(family[11])}</TableCell>
                    <TableCell>{family[12] ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{family[13]}</TableCell>
                    <TableCell>{family[14]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

export default FamilyDetails;