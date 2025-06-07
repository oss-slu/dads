import axios from 'axios';

const repoOwner = 'slu-csci-5030';
const repoName = 'dads';

export const fetchContributions = async () => {
  try {
    const response = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/contributors`);
    return response.data;
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return [];
  }
};
