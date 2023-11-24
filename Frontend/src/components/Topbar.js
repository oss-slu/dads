import * as React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import CalculateIcon from '@mui/icons-material/Calculate';
import FunctionsIcon from '@mui/icons-material/Functions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Drawer from '@mui/material/Drawer';

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
		    position="" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
		    <Toolbar>
			<Typography style = {{textAlign: "center"}}variant="h7" noWrap component="div">
			    Arithmetic Dynamical <br></br>Systems
			</Typography>
		    
			<PageLink text="Home" link="/" icon={<HomeIcon />} />
		        {/* <PageLink text="Family" link="/page1" icon={<CalculateIcon />} /> */}
			<PageLink text="Dynamical Systems" link="/exploreSystems" icon={<FunctionsIcon />} />

		    </Toolbar>
                </AppBar>
        </Box>
    );
}
