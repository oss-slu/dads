// components/CelebrationCard.js
import { Card, CardContent, Typography, List, ListItem, ListItemIcon } from '@mui/material';
import CelebrationIcon from '@mui/icons-material/Celebration';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function CelebrationCard() {
  const highlights = [
    { text: "Devayani successfully ran the rerum and working on rerum integration.", icon: <CelebrationIcon color="primary" /> },
    { text: "Vamsi fixed MongoDB sync issue.", icon: <CheckCircleIcon color="success" /> },
    { text: "Sri Ram enabled CI/CD pipeline.", icon: <CheckCircleIcon color="success" /> },
  ];

  return (
    <Card
      sx={{
        marginBottom: 2,
        backgroundColor: '#e3f2fd', // light blue background
        boxShadow: 3,
        borderRadius: 2,
      }}
      elevation={6}
    >
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          🎉 Team Highlights
        </Typography>
        <List sx={{ pl: 1 }}>
          {highlights.map(({ text, icon }, index) => (
            <ListItem
              key={index}
              sx={{
                mb: 1.5,
                borderRadius: 1,
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                boxShadow: 1,
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                {icon}
              </ListItemIcon>
              <Typography variant="body1" color="textPrimary">
                {text}
              </Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
