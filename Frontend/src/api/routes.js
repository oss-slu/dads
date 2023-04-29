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

export const getFilteredSystems = (filters) => axios({
    method: "post",
    url: "http://localhost:5000/getFilteredSystems",
    data: filters
})
