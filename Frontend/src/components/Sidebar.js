import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import CalculateIcon from '@mui/icons-material/Calculate';
import FunctionsIcon from '@mui/icons-material/Functions';

import { Link } from "react-router-dom";





const PageLink = ({ link, text, icon }) => {
    return (
        <>
            <Link to={link} style={{ color: "black", textDecoration: "none" }}>
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



export default function Sidebar({width}) {
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <Drawer
                variant="permanent"
                sx={{
                    width: width,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: width, boxSizing: 'border-box' },
                }}
            >

                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <PageLink text="Home" link="/" icon={<HomeIcon />} />
                        {/* <PageLink text="Family" link="/page1" icon={<CalculateIcon />} /> */}
                        <PageLink text="Dynamical Systems" link="/page2" icon={<FunctionsIcon />} />
                    </List>
                </Box>
            </Drawer>

        </Box>
    );
}