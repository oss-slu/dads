import * as React from "react";
import { useState, useEffect } from 'react';
import {get_families } from '../api/routes';
import PaginatedDataTable from "../components/newDataTable";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";


function Families() {
    const [families, setFamilies] = useState(null);
    const [pagesPer, setPagesPer] = useState('20');
    const fetchFamilies = async () => {
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
                                    : families.map((x) => [
                                          <Link
                                              to={`/exploreSystems`}
                                              style={{
                                                  color: "red",
                                                  textDecoration: "none",
                                              }}
                                          >
                                              {x[0]}
                                          </Link>,
                                          x[1],
                                          x[2],
                                      ])
                            }
                            itemsPerPage={pagesPer} // You can adjust the number of items per page as needed
                        />
                        </Grid>
                        </div>

        </>
    );
}

export default Families;
