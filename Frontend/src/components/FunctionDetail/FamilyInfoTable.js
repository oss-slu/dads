import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function FamilyInfoTable({ data }) {
    return (
        <TableContainer className='table-component' component={Paper}>
            <Table aria-label="family info table">
                <TableHead>
                    <TableRow>
                        <TableCell><b>Family ID</b></TableCell>
                        <TableCell><b>Name</b></TableCell>
                        <TableCell><b>Degree</b></TableCell>
                        <TableCell><b>Number of Parameters</b></TableCell>
                        <TableCell><b>Base Field Label</b></TableCell>
                        <TableCell><b>Base Field Degree</b></TableCell>
                        <TableCell><b>Is Polynomial</b></TableCell>
                        <TableCell><b>Automorphism Group Cardinality</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>{data.family_id}</TableCell>
                        <TableCell>{data.name}</TableCell>
                        <TableCell>{data.degree}</TableCell>
                        <TableCell>{data.num_parameters}</TableCell>
                        <TableCell>{data.base_field_label}</TableCell>
                        <TableCell>{data.base_field_degree}</TableCell>
                        <TableCell>{data.is_polynomial ? 'Yes' : 'No'}</TableCell>
                        <TableCell>{data.automorphism_group_cardinality}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}