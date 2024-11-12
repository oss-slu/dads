import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';

export default function InfoTable({ data }) {
  const navigate = useNavigate();

  const handleLinkClick = (selection) => {
    navigate(`/family-details/${selection}`);
  };

  return (
    <TableContainer className='table-component' component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><b>Label</b></TableCell>
            <TableCell align="right"><b>Domain</b></TableCell>
            <TableCell align="right"><b>Standard Model</b></TableCell>
            <TableCell align="right"><b>Degree</b></TableCell>
            <TableCell align="right"><b>Field of Definition</b></TableCell>
            <TableCell align="right"><b>Family</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row">{data.modelLabel}</TableCell>
            <TableCell align="right">{data.base_field_label}</TableCell>
            <TableCell align="right">{data.display_model}</TableCell>
            <TableCell align="right">{data.degree}</TableCell>
            <TableCell align="right">{data.base_field_label}</TableCell>
            <TableCell align="right">
              {data.family && (
                <button
                  onClick={() => handleLinkClick(data.family)}
                  style={{
                    border: "None",
                    color: "red",
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    cursor: "pointer"
                  }}
                >
                  {data.family}
                </button>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}