import React, { useEffect, useState } from 'react';
import { fetchRepoIssues, fetchCommits } from '../api/githubService';
import { Card, Typography, Box } from '@mui/material';
import TeamContributionsCard from '../components/TeamContributionsCard';
import ImprovementNotesCard from '../components/ImprovementNotesCard';
import TeamAvailabilityCard from '../components/TeamAvailabilityCard';
//import DeploymentStatusCard from '../components/DeploymentStatusCard';
import CelebrationCard from '../components/CelebrationCard';
const InfoCard = ({ title, value, description }) => (
  <Card sx={{ padding: 2, marginBottom: 2 }}>
    <Typography variant="h6">{title}</Typography>
    <Typography variant="h5"><b>{value}</b></Typography>
    <Typography variant="body2">{description}</Typography>
  </Card>
);

const InformationRadiator = () => {
  const [openIssues, setOpenIssues] = useState(0);
  const [closedIssues, setClosedIssues] = useState(0);
  const [sprintProgress, setSprintProgress] = useState(0);
  const [teamHealth, setTeamHealth] = useState("Unknown");

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

        // Mock logic: team health based on recent commit count
        const commits = await fetchCommits();
        setTeamHealth(commits.length > 10 ? "Green" : "Amber");
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ marginTop: 10, padding: 4 }}>
      <InfoCard title="Sprint Progress" value={`${sprintProgress}%`} description="Completed tasks in current sprint." />
      <InfoCard title="Open Issues" value={openIssues} description="Issues remaining to resolve." />
      <InfoCard title="Closed Issues" value={closedIssues} description="Issues resolved so far." />
      <InfoCard title="Team Health" value={teamHealth} description="Based on commit activity." />4
      <TeamContributionsCard />
      <ImprovementNotesCard />
      <TeamAvailabilityCard />
      <CelebrationCard />

    </Box>
  );
};

export default InformationRadiator;
