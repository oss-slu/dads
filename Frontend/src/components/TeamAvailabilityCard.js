import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Avatar,
  Box,
  Chip,
} from '@mui/material';

const initialAvailability = [
  { name: 'Devayani', status: 'Available' },
  { name: 'Sri Ram', status: 'Busy' },
  { name: 'Vamsi', status: 'Out of Office' },
];

const statuses = ['Available', 'Busy', 'In a Meeting', 'Out of Office'];

const statusColors = {
  Available: 'success',
  Busy: 'error',
  'In a Meeting': 'warning',
  'Out of Office': 'default',
};

const TeamAvailabilityCard = () => {
  const [teamAvailability, setTeamAvailability] = useState(initialAvailability);

  const handleStatusChange = (index, newStatus) => {
    const updated = [...teamAvailability];
    updated[index].status = newStatus;
    setTeamAvailability(updated);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card
      sx={{
         marginBottom: 2,
        backgroundColor: '#fff3e0', // light blue background
        boxShadow: 3,
        borderRadius: 2,
      }}
      elevation={6}
    >
      <CardContent sx={{ paddingBottom: 2 }}>
        {/* Header aligned closer to top */}
        <Box sx={{ mb: 2, pt: 1 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ lineHeight: 4.0, color: '#5d4037' }}
          >
            🟢 Team Availability (Today)
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {teamAvailability.map((member, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              key={member.name}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                bgcolor: 'rgba(255, 255, 255, 0.7)',
                p: 2,
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <Avatar sx={{ bgcolor: '#fb8c00' }}>{getInitials(member.name)}</Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: '600', color: '#5d4037', mb: 1 }}
                >
                  {member.name}
                </Typography>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={member.status}
                    label="Status"
                    onChange={(e) => handleStatusChange(index, e.target.value)}
                    sx={{ bgcolor: 'white', borderRadius: 1 }}
                  >
                    {statuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        <Chip label={status} color={statusColors[status]} size="small" />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TeamAvailabilityCard;
