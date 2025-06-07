// components/CelebrationCard.js
import { Card, CardContent, Typography, List, ListItem } from '@mui/material';

export default function CelebrationCard() {
    return (
        <Card sx={{ marginBottom: 2 }}>
            <CardContent>
                <Typography variant="h6">🎉 Team Highlights</Typography>
                <List>
                    <ListItem> Devayani, successfully runned the rerum. She working on rerum integration. </ListItem>
                    <ListItem> Vamsi fixed MongoDB sync issue</ListItem>
                    <ListItem> Sri Ram enabled CI/CD pipeline</ListItem>
                </List>
            </CardContent>
        </Card>
    );
}
