import * as React from "react";
import { useState, useEffect } from 'react';
import {get_families } from '../api/routes';
import PaginatedDataTable from "../components/PaginatedDataTable";
import Grid from "@mui/material/Grid";
import { useFilters } from '../context/FilterContext';
import { useNavigate } from 'react-router-dom';

function Families() {
    const navigate = useNavigate();
    const { filters, setFilters } = useFilters();
    const [families, setFamilies] = useState(null);
    const [pagesPer] = useState('20');
    const fetchFamilies = async () => {
        try {
            const result = await get_families()
            setFamilies(result.data)
        }
        catch (error) {
            console.log(error)
        }
     }

    const parseFamilyRecord = (family) => {
        if (Array.isArray(family)) {
            return {
                id: family[0],
                name: family[1],
                degree: family[2],
            };
        }

        return {
            id: family.family_id,
            name: family.name,
            degree: family.degree,
        };
    };
     
    useEffect(() => {
        fetchFamilies()
    }, []); 
    const updateAutocompleteSelections = (newSelections) => {
        setFilters((prevFilters) => ({
          ...prevFilters,
          family: newSelections,
        }));
      };

      const handleLinkClick = (selection) => {
        updateAutocompleteSelections([selection]);
        navigate(`/family-details/${selection}`);
    };

    return (
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
                                    : families.map((x) => {
                                          const family = parseFamilyRecord(x);
                                          return [
                                          <button
                                              onClick={() => handleLinkClick(family.id)}
                                              style={{
                                                  border:"None",
                                                  color: "red",
                                                  backgroundColor:"rgba(0, 0, 0, 0)",
                                                  cursor:"pointer"
                                
                                              }}
                                          >
                                              {family.id}
                                          </button>,
                                          family.name,
                                          family.degree,
                                      ]})
                            }
                            itemsPerPage={pagesPer}
                            currentPage={1}
                        />
                        </Grid>
                        </div>

        </>
    );
}

export default Families;
