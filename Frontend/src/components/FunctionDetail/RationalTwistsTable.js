import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { get_label } from '../../api/routes';

export default function RationalTwistsTable({ data }) {
  console.log(data);

  const ModelLabel = ({ id }) => {
    const [modelLabel, setModelLabel] = useState(null);
  
    // Once the backend data gets received,
    // then update the text with the label
    useEffect(() => {
      get_label(id)
      .then(response => {
        setModelLabel(response.data.label);
      })
      .catch(error => {
        console.error("Error fetching label:", error);
      });
    }, [id]);
  
    // While the label is being retrieved, show function ID in the meantime
    return <>{modelLabel || "Function ID: " + id}</>;
  };

  return (
    <TableContainer component={Paper} className="table-component">
      <h3>Rational Twists</h3>
      <Table aria-label="rational twists table">
        <TableBody>
          {/* Header Row */}
          <TableRow>
            <TableCell><b>Label</b></TableCell>
            <TableCell><b>Rational Twists</b></TableCell>
          </TableRow>
          {/* Data Row */}
          <TableRow>
            <TableCell>{data.modelLabel}</TableCell>
            <TableCell>
              {data.rational_twists && data.rational_twists.length > 0 ? (
                data.rational_twists.map((id, index) => (
                  <React.Fragment key={id}>
                    <a href={`http://localhost:3000/system/${id}/`} target="_blank" rel="noopener noreferrer">
                      {<ModelLabel id={id} />}
                    </a>
                    <br></br>
                  </React.Fragment>
                ))
              ) : "None"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}