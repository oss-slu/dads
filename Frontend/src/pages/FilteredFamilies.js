import * as React from "react";
import { useState, useEffect } from 'react';
import { get_filtered_families } from '../api/routes';
import PaginatedDataTable from "../components/PaginatedDataTable";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { useFilters } from '../context/FilterContext';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import HelpBox from "../components/FunctionDetail/HelpBox"; //dreyes: renders tooltips for labels.
import ActiveFiltersBanner from '../components/ActiveFiltersBanner'; //dreyes: shows active filters above the results table, only renders if there are active filters

// dreyes: this is the new family page, it allows you to filter the families based on the filters on the left 
// sidebar, and then shows the results in a table on the right, you can click on the family id to go to the family details page
function FilteredFamilies() {
    const navigate = useNavigate();
    const { filters, setFilters } = useFilters();
    const [families, setFamilies] = useState(null);
    const [pagesPer] = useState('20');
    const [page, setPage] = useState(1);
    const [triggerFetch, setTriggerFetch] = useState(false);
    const [filtersApplied, setFiltersApplied] = useState([]);

    // Fetch families with current filters
    const fetchFilteredFamilies = async () => {
        try {
            const familyFilters = {
                family_id: filters.family_id,
                name: filters.family_name,
                degree: filters.family_degree,

                dimension: filters.family_custom_dimension === ""
                    ? filters.family_dimension
                    : [...filters.family_dimension, Number(filters.family_custom_dimension)],
                is_polynomial: filters.family_is_polynomial,
                base_field_label: filters.family_base_field_label
            };
            const result = await get_filtered_families(familyFilters);
            setFamilies(result.data);
            setFiltersApplied({ ...familyFilters });
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
            family_degree: [],
            family_dimension: [],
            family_custom_dimension: "",
            family_is_polynomial: [],
            family_base_field_label: ""
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

    const smallStyles = {
        inlineHelpLabel: {
            fontSize: "0.9rem",
            whiteSpace: "nowrap",
            display: "inline-block",
            verticalAlign: "middle"
        }
    };

    const buildMonomials = (degree) => {
        const mon = [];
        for (let i = 0; i <= degree; i++) {
            if (i === 0) mon.push(`x^${degree}`);
            else if (i === degree) mon.push(`y^${degree}`);
            else if (degree - i === 1 && i === 1) mon.push("xy");
            else if (i === 1) mon.push(`x^${degree - i}y`);
            else if (degree - i === 1) mon.push(`xy^${i}`);
            else mon.push(`x^${degree - i}y^${i}`);
        }
        return mon;
    };

    const formatFamilyPolynomial = (coeffs, degree) => {
        if (!Array.isArray(coeffs) || coeffs.length < 2 || !Number.isInteger(Number(degree))) {
            return "N/A";
        }

        const d = Number(degree);
        const mon = buildMonomials(d);

        const formatOnePoly = (polyCoeffs) => {
            if (!Array.isArray(polyCoeffs)) return "N/A";
            let out = "";
            let firstTerm = true;

            for (let i = 0; i <= d && i < polyCoeffs.length; i++) {
                const c = String(polyCoeffs[i]);
                if (c === "0") continue;

                if (!firstTerm && !c.startsWith("-")) out += "+";
                if (c === "1") out += mon[i];
                else if (c === "-1") out += `-${mon[i]}`;
                else out += `${c}${mon[i]}`;
                firstTerm = false;
            }

            return out || "0";
        };

        const left = formatOnePoly(coeffs[0]);
        const right = formatOnePoly(coeffs[1]);
        return `[${left} : ${right}]`;
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

                        {/* Dimension Filter */}
                        <ul id="myUL">
                            <li>
                                <span className="caret" onClick={toggleTree}>
                                    Dimension
                                </span>
                                <ul className="nested">
                                    <input
                                        type="checkbox"
                                        checked={filters.family_dimension.includes(1)}
                                        onChange={() => handleCheckboxChange("family_dimension", 1)}
                                    />
                                    <label>
                                        P<sup>1</sup> {String.fromCharCode(8594)} P<sup>1</sup>
                                    </label>
                                    <br />
                                    <input
                                        type="checkbox"
                                        checked={filters.family_dimension.includes(2)}
                                        onChange={() => handleCheckboxChange("family_dimension", 2)}
                                    />
                                    <label>
                                        P<sup>2</sup> {String.fromCharCode(8594)} P<sup>2</sup>
                                    </label>
                                    <br />
                                    <input
                                        type="number"
                                        style={textBoxStyle}
                                        value={filters.family_custom_dimension || ""}
                                        onChange={(e) => handleTextChange("family_custom_dimension", e.target.value)}
                                    />
                                    <label>Custom</label>
                                </ul>
                            </li>
                        </ul>

                        {/* Polynomial Type Filter */}
                        <ul id="myUL">
                            <li>
                                <span className="caret" onClick={toggleTree}>
                                    Type
                                </span>
                                <ul className="nested">
                                    <input
                                        type="checkbox"
                                        checked={filters.family_is_polynomial.includes(true)}
                                        onChange={() => handleCheckboxChange("family_is_polynomial", true)}
                                    />
                                    <label>Polynomial</label>
                                </ul>
                            </li>
                        </ul>

                        {/* Field Label Filter */}
                        <ul id="myUL">
                            <li>
                                <span className="caret" onClick={toggleTree}>
                                    Field of Definition
                                </span>
                                <ul className="nested">
                                    <input
                                        type="text"
                                        style={textBoxStyle}
                                        value={filters.family_base_field_label || ""}
                                        onChange={(e) => handleTextChange("family_base_field_label", e.target.value)}
                                    />
                                    <label>Field</label>
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
                    {filtersApplied && <ActiveFiltersBanner filters={filtersApplied} />}
                    <PaginatedDataTable
                        labels={[
                            <><span style={smallStyles.inlineHelpLabel}>Family Id</span><HelpBox description="Unique identifier for a family record in the database." title="Family Id" /></>,
                            <><span style={smallStyles.inlineHelpLabel}>Family Name</span><HelpBox description="Descriptive name of the family of maps." title="Family Name" /></>,
                            <><span style={smallStyles.inlineHelpLabel}>Degree</span><HelpBox description="Degree of the representative maps in this family." title="Degree" /></>,
                            <><span style={smallStyles.inlineHelpLabel}>Domain</span><HelpBox description="The ambient domain of the map; a projective space" title="Domain" /></>,
                            <><span style={smallStyles.inlineHelpLabel}>Polynomial</span><HelpBox description="Representative polynomials for this family model." title="Polynomials" /></>,
                            <><span style={smallStyles.inlineHelpLabel}>Field</span><HelpBox description="The field label attached to the family definition." title="Field" /></>
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
                                    <>
                                        P<sup>1</sup> {String.fromCharCode(8594)} P<sup>1</sup>
                                    </>,
                                    formatFamilyPolynomial(x[4], x[2]),
                                    x[6]
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
