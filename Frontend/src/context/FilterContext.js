import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export const useFilters = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
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
        indeterminacy_locus_dimension: ""
    });

    return (
        <FilterContext.Provider value={{ filters, setFilters }}>
            {children}
        </FilterContext.Provider>
    );
};
