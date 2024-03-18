import axios from 'axios';

export const get_systems = () => axios({
    method: "get",
    url: "http://127.0.0.1:5000/get_all_systems",
})

export const get_system = (label) => axios({
    method: "post",
    url: "http://127.0.0.1:5000/get_system",
    data: label
})
    
export const get_selected_systems = (labels) => axios({
    method: "post",
    url: "http://127.0.0.1:5000/get_selected_systems",
    data: labels
})

export const get_filtered_systems = (filters) => axios({
    method: "post",
    url: "http://127.0.0.1:5000/get_filtered_systems",
    data: filters
})

export const get_statistics = (filters) => axios({
    method: "post",
    url: "http://127.0.0.1:5000/get_statistics",
    data: filters
})
