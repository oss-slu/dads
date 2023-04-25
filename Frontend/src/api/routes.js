import axios from 'axios';

const json = JSON.stringify({ answer: 42 });


export const getData = () => axios({
    method: "get",
    url: "http://localhost:5000/data",
})

export const getFilterData = (filters) => axios({
    method: "post",
    url: "http://localhost:5000/filterData",
    data: filters
})

export const getSystems = () => axios({
    method: "get",
    url: "http://localhost:5000/getAllSystems",
})

export const getFilteredSystems = (filters) => axios({
    method: "post",
    url: "http://localhost:5000/getFilteredSystems",
    data: filters
})
