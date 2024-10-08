import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { get_family } from '../api/routes';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

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
  if (!family) return <div>No family found with the given ID.</div>;

  return (
    <div className="family-details">
      <h1>Family Details: {family[1]}</h1>
      <div className="info-container">
        <div className="row">
          <TableContainer className='table-component' component={Paper}>
            <Table aria-label="family details table">
              <TableBody>
                <TableRow>
                  <TableCell><b>Family ID</b></TableCell>
                  <TableCell>{family[0]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Name</b></TableCell>
                  <TableCell>{family[1]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Degree</b></TableCell>
                  <TableCell>{family[2]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Num Parameters</b></TableCell>
                  <TableCell>{family[3]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Model Coeffs</b></TableCell>
                  <TableCell>{formatModelCoeffs(family[4])}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Model Resultant</b></TableCell>
                  <TableCell>{family[5]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Base Field Label</b></TableCell>
                  <TableCell>{family[6]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Base Field Degree</b></TableCell>
                  <TableCell>{family[7]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Sigma One</b></TableCell>
                  <TableCell>{family[8]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Sigma Two</b></TableCell>
                  <TableCell>{family[9]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Ordinal</b></TableCell>
                  <TableCell>{family[10]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Citations</b></TableCell>
                  <TableCell>{formatCitations(family[11])}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Is Polynomial</b></TableCell>
                  <TableCell>{family[12] ? 'Yes' : 'No'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Num Critical Points</b></TableCell>
                  <TableCell>{family[13]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Automorphism Group Cardinality</b></TableCell>
                  <TableCell>{family[14]}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

export default FamilyDetails;