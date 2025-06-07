import React, { useEffect, useState } from 'react';
import { fetchRepoIssues, fetchCommits } from '../api/githubService';
import { Card, Typography, Box, Grid, Divider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import SpeedIcon from '@mui/icons-material/Speed';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import TeamContributionsCard from '../components/TeamContributionsCard';
import ImprovementNotesCard from '../components/ImprovementNotesCard';
import TeamAvailabilityCard from '../components/TeamAvailabilityCard';
import CelebrationCard from '../components/CelebrationCard';

const InfoCard = ({ title, value, description, icon, color }) => (
  <Card sx={{ p: 3, boxShadow: 3, borderLeft: `6px solid ${color}` }}>
    <Grid container alignItems="center" spacing={2}>
      <Grid item>{icon}</Grid>
      <Grid item xs>
        <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
        <Typography variant="h5" fontWeight="bold">{value}</Typography>
        <Typography variant="body2" color="text.secondary">{description}</Typography>
      </Grid>
    </Grid>
  </Card>
);

const InformationRadiator = () => {
  const [openIssues, setOpenIssues] = useState(0);
  const [closedIssues, setClosedIssues] = useState(0);
  const [sprintProgress, setSprintProgress] = useState(0);
  const [teamHealth, setTeamHealth] = useState("Unknown");
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const issues = await fetchRepoIssues();
        const open = issues.filter(issue => issue.state === "open").length;
        const closed = issues.filter(issue => issue.state === "closed").length;
        const total = open + closed;

        setOpenIssues(open);
        setClosedIssues(closed);
        setSprintProgress(total > 0 ? Math.round((closed / total) * 100) : 0);

        const commits = await fetchCommits();
        setTeamHealth(commits.length > 10 ? "Green" : "Amber");

        const now = new Date().toLocaleString();
        setLastUpdated(now);
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ marginTop: 10, padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        🧭 Project Information Radiator
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        <AccessTimeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
        Last Updated: {lastUpdated}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            title="Sprint Progress"
            value={`${sprintProgress}%`}
            description="Completed tasks in current sprint."
            icon={<SpeedIcon color="primary" fontSize="large" />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            title="Open Issues"
            value={openIssues}
            description="Issues remaining to resolve."
            icon={<ErrorOutlineIcon color="error" fontSize="large" />}
            color="#d32f2f"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            title="Closed Issues"
            value={closedIssues}
            description="Issues resolved so far."
            icon={<CheckCircleIcon color="success" fontSize="large" />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            title="Team Health"
            value={teamHealth}
            description="Based on commit activity."
            icon={<HealthAndSafetyIcon color="secondary" fontSize="large" />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Grid container spacing={3}>
  {/* Left Column: Team Contributions */}
  <Grid item xs={12} md={6}>
    <TeamContributionsCard />
  </Grid>

  {/* Right Column: Stack of other cards */}
  <Grid item xs={12} md={6}>
    <Box display="flex" flexDirection="column" gap={2}>
      <ImprovementNotesCard />
      <TeamAvailabilityCard />
      <CelebrationCard />
    </Box>
  </Grid>
</Grid>

    </Box>
  );
};

export default InformationRadiator;
