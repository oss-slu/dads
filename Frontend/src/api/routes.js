import axios from 'axios';

const json = JSON.stringify({ answer: 42 });

export const getData = () => axios.get('http://localhost:5000/data');

// export const getFilteredData = (newPost) => axios.post(postUrl, newPost);