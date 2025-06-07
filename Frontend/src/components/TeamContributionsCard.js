import React, { useEffect, useState } from 'react';
import { fetchContributions } from '../api/githubCommitsService';
import { Card, CardContent, Typography, List, ListItem } from '@mui/material';

const TeamContributionsCard = () => {
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    const loadContributions = async () => {
      const data = await fetchContributions();
      setContributors(data);
    };
    loadContributions();
  }, []);

  return (
    <Card sx={{ margin: 2, backgroundColor: '#e3f2fd' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>👥 Team Contributions (Commits)</Typography>
        <List>
          {contributors.map((contributor) => (
            <ListItem key={contributor.id}>
              {contributor.login} – {contributor.contributions} commits
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default TeamContributionsCard;
