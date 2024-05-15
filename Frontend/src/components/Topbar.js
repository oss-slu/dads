import * as React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import GrainIcon from '@mui/icons-material/Grain';
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
            <Link style={{textDecoration:'None'}} to={'/'}>
			<Typography style = {{textAlign: "center",fontWeight:"bolder",fontFamily:"monospace", color:"white"}} variant="h5" noWrap component="div">
			    DynaBase
			</Typography>
            </Link>

			<PageLink text="Information" link="/" icon={<HomeIcon style={{color:'white'}} />} />
			<PageLink text="Dynamical Systems" link="/exploreSystems" icon={<FunctionsIcon style={{color:'white'}}/>} />
      <PageLink text="Families" link="/families" icon={<GrainIcon style={{color:'white'}}/>} />} />

		    </Toolbar>
                </AppBar>
        </Box>
    );
}
