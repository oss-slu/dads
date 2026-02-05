import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext(); // Creates a new context for managing filter state across the application.

export const useFilters = () => useContext(FilterContext); // Custom hook to access the filter context easily within components.

export const FilterProvider = ({ children }) => { // Provider component that wraps around parts of the app that need access to filter state.
    const [filters, setFilters] = useState({
        dimension: [],
        degree: [],
        is_polynomial: [],
        is_Lattes: [],
        family:[],
        is_Chebyshev:  [],
        is_Newton:  [],
        is_pcf: [],
        customDegree: "",
        customDimension: "",
        automorphism_group_cardinality: "",
        base_field_label: "",
        base_field_degree: "",
        indeterminacy_locus_dimension: "",
        cp_cardinality: "",
        periodic_cycles: "",
        sigma_one: "",
        sigma_two: "",
        model_label: "",
        journal_label: ""
    });

    return ( // Provides the filter state and updater function to its children components.
        <FilterContext.Provider value={{ filters, setFilters }}>
            {children}
        </FilterContext.Provider>
    );
};
