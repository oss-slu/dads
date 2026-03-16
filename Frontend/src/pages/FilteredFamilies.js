import * as React from "react";
import { useState, useEffect } from 'react';
import { get_filtered_families } from '../api/routes';
import PaginatedDataTable from "../components/PaginatedDataTable";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { useFilters } from '../context/FilterContext';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

// dreyes: this is the new family page, it allows you to filter the families based on the filters on the left 
// sidebar, and then shows the results in a table on the right, you can click on the family id to go to the family details page
function FilteredFamilies() {
    const navigate = useNavigate();
    const { filters, setFilters } = useFilters();
    const [families, setFamilies] = useState(null);
    const [pagesPer] = useState('20');
    const [page, setPage] = useState(1);
    const [triggerFetch, setTriggerFetch] = useState(false);

    // Fetch families with current filters
    const fetchFilteredFamilies = async () => {
        try {
            const result = await get_filtered_families({
                family_id: filters.family_id,
                name: filters.family_name,
                degree: filters.family_degree
            });
            setFamilies(result.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchFilteredFamilies();
    }, []);

    useEffect(() => {
        fetchFilteredFamilies();
    }, [triggerFetch]);

    // Handler for text inputs
    const handleTextChange = (filterName, value) => {
        setFilters({ ...filters, [filterName]: value });
    };

    // Handler for checkbox changes (degree)
    const handleCheckboxChange = (filterName, filterValue) => {
        const updatedFilters = filters[filterName].includes(filterValue)
            ? filters[filterName].filter(value => value !== filterValue)
            : [...filters[filterName], filterValue];
        setFilters({ ...filters, [filterName]: updatedFilters });
    };

    // Trigger filter application
    const sendFilters = () => {
        setPage(1);
        setFamilies(null);
        setTriggerFetch(prev => !prev);
    };

    // Clear all family filters
    const clearFilters = () => {
        setFilters({
            ...filters,
            family_id: "",
            family_name: "",
            family_degree: []
        });
        setTriggerFetch(prev => !prev);
        setPage(1);
    };

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

    // Toggle tree for collapsible filter sections
    const toggleTree = (event) => {
        let el = event.target;
        el.parentElement.querySelector(".nested").classList.toggle("active");
        el.classList.toggle("caret-down");
    };

    const textBoxStyle = {
        width: "100px",
        marginRight: "12px",
    };

    return (
        <>
            <div className="results-container" container>
                {/* Filter Sidebar */}
                <Grid className="sidebar" item xs={3}>
                    <div style={{ marginLeft: "10px", marginRight: "10px" }}>
                        <p className="sidebarHead">Filters</p>
                        <Divider />

                        {/* Family ID Filter */}
                        <ul id="myUL">
                            <li>
                                <span className="caret" onClick={toggleTree}>
                                    Family ID
                                </span>
                                <ul className="nested">
                                    <input
                                        type="number"
                                        style={textBoxStyle}
                                        value={filters.family_id || ''}
                                        onChange={(e) => handleTextChange("family_id", e.target.value)}
                                    />
                                    <label>ID</label>
                                    <br />
                                </ul>
                            </li>
                        </ul>

                        {/* Family Name Filter */}
                        <ul id="myUL">
                            <li>
                                <span className="caret" onClick={toggleTree}>
                                    Family Name
                                </span>
                                <ul className="nested">
                                    <input
                                        type="text"
                                        style={{ width: "150px", marginRight: "12px" }}
                                        value={filters.family_name || ''}
                                        onChange={(e) => handleTextChange("family_name", e.target.value)}
                                        placeholder="Search name..."
                                    />
                                    <br />
                                </ul>
                            </li>
                        </ul>

                        {/* Degree Filter */}
                        <ul id="myUL">
                            <li>
                                <span className="caret" onClick={toggleTree}>
                                    Degree
                                </span>
                                <ul className="nested">
                                    <input
                                        type="checkbox"
                                        checked={filters.family_degree.includes(2)}
                                        onChange={() => handleCheckboxChange("family_degree", 2)}
                                    />
                                    <label>2</label>
                                    <br />
                                    <input
                                        type="checkbox"
                                        checked={filters.family_degree.includes(3)}
                                        onChange={() => handleCheckboxChange("family_degree", 3)}
                                    />
                                    <label>3</label>
                                    <br />
                                    <input
                                        type="checkbox"
                                        checked={filters.family_degree.includes(4)}
                                        onChange={() => handleCheckboxChange("family_degree", 4)}
                                    />
                                    <label>4</label>
                                    <br />
                                </ul>
                            </li>
                        </ul>

                        <br />
                        {/* Action Buttons */}
                        <ul id="myUL">
                            <li style={{ paddingBottom: '10px' }}>
                                <Button
                                    onClick={sendFilters}
                                    variant="primary"
                                    style={{ width: '100%' }}
                                >
                                    Get Results
                                </Button>
                            </li>
                            <li>
                                <Button
                                    onClick={clearFilters}
                                    variant="danger"
                                    style={{ width: '100%' }}
                                >
                                    Clear Filters
                                </Button>
                            </li>
                        </ul>
                        <br />
                    </div>
                </Grid>

                {/* Results Table */}
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
                                            border: "None",
                                            color: "red",
                                            backgroundColor: "rgba(0, 0, 0, 0)",
                                            cursor: "pointer"
                                        }}
                                    >
                                        {x[0]}
                                    </button>,
                                    x[1],
                                    x[2],
                                ])
                        }
                        itemsPerPage={pagesPer}
                        currentPage={page}
                        setCurrentPage={setPage}
                    />
                </Grid>
            </div>
        </>
    );
}

export default FilteredFamilies;
