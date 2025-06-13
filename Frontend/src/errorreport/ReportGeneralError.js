// src/errorreport/ReportGeneralError.js
import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const ReportGeneralError = ({ open, onClose, errorMessage, severity = 'error' }) => {
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
            <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
                {errorMessage}
            </Alert>
        </Snackbar>
    );
};

export default ReportGeneralError;