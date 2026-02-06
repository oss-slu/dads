import * as React from "react";
import { useState, useEffect } from 'react';
import {get_families } from '../api/routes';
import PaginatedDataTable from "../components/PaginatedDataTable";
import Grid from "@mui/material/Grid";
import { useFilters } from '../context/FilterContext';
import { useNavigate } from 'react-router-dom';

function Families() { // Component that displays a list of families with pagination. Fetches family data from the backend API and allows navigation to detailed views of each family.
    const navigate = useNavigate();
    const { filters, setFilters } = useFilters();
    const [families, setFamilies] = useState(null);
    const [pagesPer] = useState('20');
    const fetchFamilies = async () => { // Asynchronous function to fetch family data from the backend API.
        try {
            const result = await get_families()
            setFamilies(result.data)
        }
        catch (error) {
            console.log(error)
        }
     }
     
    useEffect(() => {
        fetchFamilies()
    }, []); 
    const updateAutocompleteSelections = (newSelections) => { // Function to update the filter context with new family selections.
        setFilters((prevFilters) => ({
          ...prevFilters,
          family: newSelections,
        }));
      };

      const handleLinkClick = (selection) => { // Function to handle clicks on family links. Updates the filter context and navigates to the family details page.
        updateAutocompleteSelections([selection]);
        navigate(`/family-details/${selection}`);
    };

    return ( // Renders the families in a paginated data table with clickable links for each family ID.
        <>
        <div className="results-container" container>
        <Grid className="results-table" item xs={6}>
            <PaginatedDataTable
                            labels={[
                                "Family Id",
                                "Family Name",
                                "Degree",
                            ]}
                            data={
                                families === null
                                    ? []
                                    : families.map((x) => [
                                          <button
                                              onClick={() => handleLinkClick(x[0])}
                                              style={{
                                                  border:"None",
                                                  color: "red",
                                                  backgroundColor:"rgba(0, 0, 0, 0)",
                                                  cursor:"pointer"
                                
                                              }}
                                          >
                                              {x[0]}
                                          </button>,
                                          x[1],
                                          x[2],
                                      ])
                            }
                            itemsPerPage={pagesPer}
                            currentPage={1}
                        />
                        </Grid>
                        </div>

        </>
    );
}

export default Families; // Exports the Families component as the default export of this module, allowing it to be imported and used in other parts of the application.
