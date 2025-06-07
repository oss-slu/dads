import React, { useState } from 'react';
import {
  Card, CardContent, Typography, MenuItem, Select, FormControl, InputLabel, Grid
} from '@mui/material';

const initialAvailability = [
  { name: "Devayani", status: "Available" },
  { name: "Sri Ram", status: "Busy" },
  { name: "Vamsi", status: "Out of Office" }
];

const statuses = ["Available", "Busy", "In a Meeting", "Out of Office"];

const TeamAvailabilityCard = () => {
  const [teamAvailability, setTeamAvailability] = useState(initialAvailability);

  const handleStatusChange = (index, newStatus) => {
    const updated = [...teamAvailability];
    updated[index].status = newStatus;
    setTeamAvailability(updated);
  };

  return (
    <Card sx={{ margin: 2, backgroundColor: '#fff3e0' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>🟢 Team Availability (Today)</Typography>
        <Grid container spacing={2}>
          {teamAvailability.map((member, index) => (
            <Grid item xs={12} sm={6} key={member.name}>
              <Typography variant="subtitle1">{member.name}</Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={member.status}
                  label="Status"
                  onChange={(e) => handleStatusChange(index, e.target.value)}
                >
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TeamAvailabilityCard;
