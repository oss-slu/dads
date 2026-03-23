import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

const api = axios.create({
    baseURL: API_BASE_URL
});

export const get_systems = () => api.get("/get_all_systems");

export const get_system = (label) => api.post("/get_system", label);
    
export const get_selected_systems = (labels) => api.post("/get_selected_systems", labels);

export const get_filtered_systems = (filters) => api.post("/get_filtered_systems", filters);

export const get_statistics = (filters) => api.post("/get_statistics", filters);

export const get_families = () => api.get("/get_all_families");

export const get_family = (familyId) => api.post("/get_family", { id: familyId });

// dreyes: used to filter families based on the filters selected in the UI
export const get_filtered_families = (filters) => api.post("/get_filtered_families", filters);

export const get_rational_periodic_data = (functionId) => 
    api.post("/get_rational_periodic_data", { function_id: functionId });

export const get_label = (functionId) => 
    api.post("/get_label", { function_id: functionId });

export const get_graph_data = (graphId) => 
    api.post("/get_graph_data", { graph_id: graphId });

export const get_graph_metadata = (graphId) => 
    api.post("/get_graph_metadata", { graph_id: graphId });