import axios from 'axios';

export const getSystems = () => axios({
    method: "get",
    url: "http://localhost:5000/getAllSystems",
})

export const getFilteredSystems = (filters) => axios({
    method: "post",
    url: "http://localhost:5000/getFilteredSystems",
    data: filters
})
