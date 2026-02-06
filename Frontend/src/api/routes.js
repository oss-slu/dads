import axios from 'axios';

export const get_systems = () => axios({ // Function to fetch all systems from the backend API.
    method: "get",
    url: "http://127.0.0.1:5000/get_all_systems",
})

export const get_system = (label) => axios({ // Function to fetch a specific system by its label from the backend API.
    method: "post",
    url: "http://127.0.0.1:5000/get_system",
    data: label
})
    
export const get_selected_systems = (labels) => axios({ // Function to fetch multiple systems based on a list of labels from the backend API.
    method: "post",
    url: "http://127.0.0.1:5000/get_selected_systems",
    data: labels
})

export const get_filtered_systems = (filters) => axios({ // Function to fetch systems that match specific filter criteria from the backend API.
    method: "post",
    url: "http://127.0.0.1:5000/get_filtered_systems",
    data: filters
})

export const get_statistics = (filters) => axios({ // Function to fetch statistical data based on current filters from the backend API.
    method: "post",
    url: "http://127.0.0.1:5000/get_statistics",
    data: filters
})

export const get_families= () => axios({ // Function to fetch all families from the backend API.
    method: "get",
    url: "http://127.0.0.1:5000/get_all_families",
})

export const get_family = (familyId) => axios({ // Function to fetch a specific family by its ID from the backend API.
    method: "post",
    url: "http://127.0.0.1:5000/get_family",
    data: { id: familyId }
})

export const get_rational_periodic_data = (functionId) => axios({ // Function to fetch rational periodic data for a specific function ID from the backend API.
    method: "post",
    url: "http://127.0.0.1:5000/get_rational_periodic_data",
    data: { function_id: functionId }
});

export const get_label = (functionId) => axios({ // Function to fetch the label for a specific function ID from the backend API.
    method: "post",
    url: "http://127.0.0.1:5000/get_label",
    data: { function_id: functionId }
});

export const get_graph_data = (graphId) => axios({ // Function to fetch graph data for a specific graph ID from the backend API.
    method: "post",
    url: "http://127.0.0.1:5000/get_graph_data",
    data: { graph_id: graphId }
});

export const get_graph_metadata = (graphId) => axios({ // Function to fetch metadata for a specific graph ID from the backend API.
    method: "post",
    url: "http://127.0.0.1:5000/get_graph_metadata",
    data: { graph_id: graphId }
});