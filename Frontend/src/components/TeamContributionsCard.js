import React, { useEffect, useState } from 'react';
import { fetchContributions } from '../api/githubCommitsService';
import {
  Card, CardContent, Typography, List, ListItem,
  ListItemAvatar, Avatar, ListItemText, LinearProgress, Box, Tooltip, Link
} from '@mui/material';

const medalEmojis = ['🥇', '🥈', '🥉'];

const TeamContributionsCard = () => {
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    const loadContributions = async () => {
      const data = await fetchContributions();
      const sorted = [...data].sort((a, b) => b.contributions - a.contributions);
      setContributors(sorted);
    };
    loadContributions();
  }, []);

  const maxCommits = contributors.length > 0 ? contributors[0].contributions : 1;

  return (
    <Card sx={{ margin: 2, backgroundColor: '#f3f4f6' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>👥 Team Contributions</Typography>
        <List>
          {contributors.map((contributor, index) => {
            const percentage = Math.round((contributor.contributions / maxCommits) * 100);
            return (
              <ListItem key={contributor.id} alignItems="flex-start">
                <ListItemAvatar>
                  <Tooltip title={contributor.login}>
                    <Avatar alt={contributor.login} src={contributor.avatar_url} />
                  </Tooltip>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {index < 3 && <span>{medalEmojis[index]}</span>}
                      <Link
                        href={`https://github.com/${contributor.login}`}
                        target="_blank"
                        rel="noopener"
                        underline="hover"
                      >
                        {contributor.login}
                      </Link>
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {contributor.contributions} commits
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{ height: 6, borderRadius: 5, mt: 0.5 }}
                        color={percentage > 66 ? 'success' : percentage > 33 ? 'warning' : 'error'}
                      />
                    </>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
};

export default TeamContributionsCard;
