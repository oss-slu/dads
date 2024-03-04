import axios from 'axios';

export const getSystems = () => axios({
    method: "get",
    url: "http://127.0.0.1:5000/getAllSystems",
})

export const getSystem = (label) => axios({
    method: "post",
    url: "http://127.0.0.1:5000/getSystem",
    data: label
})
    
export const getSelectedSystems = (labels) => axios({
    method: "post",
    url: "http://127.0.0.1:5000/getSelectedSystems",
    data: labels
})

export const getFilteredSystems = (filters) => axios({
    method: "post",
    url: "http://127.0.0.1:5000/getFilteredSystems",
    data: filters
})

export const getStatistics = (filters) => axios({
    method: "post",
    url: "http://127.0.0.1:5000/getStatistics",
    data: filters
})
export const getModel = (model) => axious({
    mehod: "post"
    url: "https://127.0.0.1:5000/getModel"
    data: model
)}
