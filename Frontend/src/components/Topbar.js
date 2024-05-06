import * as React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import FunctionsIcon from '@mui/icons-material/Functions';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { Link } from "react-router-dom";

const PageLink = ({ link, text, icon }) => {
    return (
        <>
            <Link to={link} style={{ color: "white", textDecoration: "none" }}>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            {icon}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItemButton>
                </ListItem>
            </Link>
        </>)
}

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
		    
			<PageLink text="Home" link="/" icon={<HomeIcon />} />
			<PageLink text="Dynamical Systems" link="/exploreSystems" icon={<FunctionsIcon />} />

		    </Toolbar>
                </AppBar>
        </Box>
    );
}
