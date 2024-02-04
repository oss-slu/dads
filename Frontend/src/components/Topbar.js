import * as React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


export default function Topbar() {
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <AppBar style={{ background: '#2E3B55' }}
                position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography style = {{textAlign: "center"}}variant="h7" noWrap component="div">
                        Arithmetic Dynamical <br></br>Systems
                    </Typography>

                    <Typography style = {{marginLeft: "40px"}}variant="h7" noWrap component="div">
                        Explore Dynamical Systems
                    </Typography>
                </Toolbar>
            </AppBar>

        </Box>
    );
}