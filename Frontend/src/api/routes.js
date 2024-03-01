import axios from 'axios';

const BASEURL = process.env.BACKEND_URL;
const BASEURL_PORT = process.env.BACKEND_PORT;

export const getSystems = () => axios({
    method: "get",
    url: `http://${BASEURL}:${BASEURL_PORT}/getAllSystems`,
})

export const getSystem = (label) => axios({
    method: "post",
    url: `http://${BASEURL}:5000/getSystem`,
    data: label
})
    
export const getSelectedSystems = (labels) => axios({
    method: "post",
    url: `http://${BASEURL}:5000/getSelectedSystems`,
    data: labels
})

export const getFilteredSystems = (filters) => axios({
    method: "post",
    url: `http://${BASEURL}:5000/getFilteredSystems`,
    data: filters
})

export const getStatistics = (filters) => axios({
    method: "post",
    url: `http://${BASEURL}:5000/getStatistics`,
    data: filters
})
