import * as React from 'react';
import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { get_rational_periodic_data, get_label } from '../../api/routes'; // Import API functions

const ScrollableTableContainer = styled(TableContainer)({
  maxHeight: '400px', // Enables scrolling
  overflowY: 'auto'
});

const EntryContainer = styled('div')({
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '10px',
  marginBottom: '10px',
  backgroundColor: '#f9f9f9'
});

export default function RationalPointsTable({ data }) {
  const [rationalData, setRationalData] = useState([]);
  const [label, setLabel] = useState('');

  // Extract function_id from data
  const functionId = data?.function_id;

  // Fetch rational preperiodic data and label on mount
  useEffect(() => {
    if (functionId) {
      get_rational_periodic_data(functionId)
        .then(response => {
          setRationalData(response.data); // Store the array of results
        })
        .catch(error => {
          console.error("Error fetching rational periodic data:", error);
        });

      get_label(functionId)
        .then(response => {
          setLabel(response.data.label);
        })
        .catch(error => {
          console.error("Error fetching label:", error);
        });
    }
  }, [functionId]);

  if (!rationalData.length) return <p>Loading rational periodic data...</p>;

  return (
    <>
      <h3>Rational Points Table</h3>
      <ScrollableTableContainer component={Paper}>
        {rationalData.map((item, index) => (
          <EntryContainer key={index}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell><b>Label</b></TableCell>
                  <TableCell>{label}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Function ID</b></TableCell>
                  <TableCell>{item[1]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Field Label</b></TableCell>
                  <TableCell>{item[2]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Rational Preperiodic Points</b></TableCell>
                  <TableCell>
                    {item[3].map((point, idx) => (
                      <div key={idx}>{`(${point[0]}, ${point[1]})`}</div>
                    ))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Graph ID</b></TableCell>
                  <TableCell>{item[4]}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </EntryContainer>
        ))}
      </ScrollableTableContainer>
    </>
  );
}