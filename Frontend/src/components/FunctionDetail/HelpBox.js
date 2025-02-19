import * as React from 'react';
import { Tooltip, IconButton, Typography } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

export default function HelpBox({description, title}) {
    return (
        <Tooltip title = {
            <div>
                {title && <Typography variant='subtitle1'><b>{title}</b></Typography>}
                <Typography variant='body2'>{description}</Typography>
            </div>
        }
        arrow enterTouchDelay={0} leaveTouchDelay={300000}>
            <IconButton>
                <HelpIcon/>
            </IconButton>
        </Tooltip>
    );
}
