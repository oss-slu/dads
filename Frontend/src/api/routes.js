import axios from 'axios';

export const getSystems = () => axios({
    method: "get",
    url: "http://localhost:5000/getAllSystems",
})

export const getSystem = (label) => axios({
    method: "post",
    url: "http://localhost:5000/getSystem",
    data: label
})

export const getSelectedSystems = (labels) => axios({
    method: "post",
    url: "http://localhost:5000/getSelectedSystems",
    data: labels
})

export const getFilteredSystems = (filters) => axios({
    method: "post",
    url: "http://localhost:5000/getFilteredSystems",
    data: filters
})

export const getStatistics = (filters) => axios({
    method: "post",
    url: "http://localhost:5000/getStatistics",
    data: filters
})