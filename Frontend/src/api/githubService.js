// githubService.js
import axios from 'axios';

const owner = 'slu-csci-5030';
const repo = 'dads';

const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3+json'
  }
});

export const fetchRepoIssues = async () => {
  const response = await githubApi.get(`/repos/${owner}/${repo}/issues?state=all`);
  return response.data;
};

export const fetchCommits = async () => {
  const response = await githubApi.get(`/repos/${owner}/${repo}/commits`);
  return response.data;
};
