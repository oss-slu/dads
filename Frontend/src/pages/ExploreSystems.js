/*
This is the main page of the web application. 
It is responsible for allowing the user to select filters to search for system,
displaying the selected systems, and providing statistics about the selected systems.
This page saves the table pagination and filter state when navigating to the SystemDetails page,
but resets them when the page is refreshed or the filters are changed. This is handled through the 
pageContext and filterContext. 
*/

import * as React from "react";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import PaginatedDataTable from "../components/newDataTable";
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { get_filtered_systems, get_selected_systems, get_families } from '../api/routes';
import ReportGeneralError from '../errorreport/ReportGeneralError';
import ReportMajorError from '../errorreport/ReportMajorError';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useFilters } from '../context/FilterContext'; 
import ActiveFiltersBanner from '../components/ActiveFiltersBanner'; 
import { usePage } from '../context/PageContext'; 
import Button from 'react-bootstrap/Button';



function ExploreSystems() {

    // State Hooks
    const [optionsLoading, setOptionsLoading] = useState(true);
    const [systems, setSystems] = useState(null);
    const [pagesPer, setPagesPer] = useState('20');
    const [pagesDisplay, setPagesDisplay] = useState('20');
    const [triggerFetch, setTriggerFetch] = useState(false);
    const [majorError, setMajorError] = useState('');
    const [openMajorErrorModal, setOpenMajorErrorModal] = useState(false);
    const [generalError, setGeneralError] = useState('');
    const [openGeneralErrorSnackbar, setOpenGeneralErrorSnackbar] = useState(false);
    const [filtersApplied, setFiltersApplied] = useState([]);
    const [stats, setStat] = useState({
        numMaps: "",
        avgAUT: "",
        numPCF: "",
        avgHeight: "",
        avgResultant: ""
    });

    const [families, setFamilies] = useState([]);
    console.log('families first',families)
    const {page, setPage} = usePage();
    // Context Hooks
    const { filters, setFilters } = useFilters();
    console.log('filters first',filters)

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    useEffect(() => {
        const savedFilters = sessionStorage.getItem('filters');
        const savedPage = sessionStorage.getItem('currentPage');
        const savedResultsPerPage = sessionStorage.getItem('resultsPerPage');

        if (savedFilters) {
            const parsedFilters = JSON.parse(savedFilters);
            setFilters(parsedFilters);
        }

        if (savedPage) {
          setPage(Number(savedPage));
        }

        if (savedResultsPerPage) {
            setPagesPer(savedResultsPerPage);
            setPagesDisplay(savedResultsPerPage === systems?.length.toString() ? 'All' : savedResultsPerPage);
        }

        fetchFilteredSystems();
        fetchFamilies();
    }, []);

    useEffect(() => {
        fetchFilteredSystems();
        fetchFamilies();
    }, [triggerFetch]);

    // Handler Functions
    const handleAutocompleteChange = (event, value) => {
        const selectedIds = value.map((option) => option.id);
        setFilters((prevFilters) => ({
          ...prevFilters,
          family: selectedIds,
        }));
      };
    
    const handleCheckboxChange = (filterName, filterValue) => {
        const updatedFilters = filters[filterName].includes(filterValue)
            ? filters[filterName].filter(value => value !== filterValue)
            : [...filters[filterName], filterValue];

        setFilters({ ...filters, [filterName]: updatedFilters });
    };

    const handleRadioChange = (filterName, value) => {
        const updatedValue = value === '' ? [] : [String(value)];
        setFilters({ ...filters, [filterName]: updatedValue });
    };

    const handleTextChange = (filterName, value) => {
        setFilters({ ...filters, [filterName]: value });
    };

    const handlePagePerChange = (event) => {
        const value = event.target.value === 'All' ? systems?.length.toString() : event.target.value;
        setPagesPer(value);
        setPagesDisplay(event.target.value === 'All' ? 'All' : value);
        sessionStorage.setItem('resultsPerPage', value);
    };

    const handleMajorErrorClose = () => {
        setOpenMajorErrorModal(false);
    };
    const handleGeneralErrorClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenGeneralErrorSnackbar(false);
    };

    const sendFilters = () => {
        setPage(1);
        setSystems(null);
        fetchFilteredSystems();
        setTriggerFetch(prev => !prev);
    };

    const clearFilters = () => {
        setFilters(defaultFilters);
        setTriggerFetch(prev => !prev);
        setPage(1);
    };

    // API Call Functions
    const fetchFamilies = async () => {
        try {
            const result = await get_families()
            const autocompleteOptions = result.data.map((family) => ({
                id: family[0], // Use the first element as id
                name: family[1], // Use the second element as label
            }));
            console.log('family Options before', families)
            setFamilies(autocompleteOptions)
            console.log('auto', autocompleteOptions)
            console.log('family Options', families)
            setOptionsLoading(false)
        }
        catch (error) {
            console.log(error)
            setOptionsLoading(false);
        }
    }
    const fetchFilteredSystems = async () => {
        try {
            const result = await get_filtered_systems(
                {
                    degree: filters.customDegree === "" ? filters.degree : [...filters.degree, Number(filters.customDegree)],
                    N: filters.customDimension === "" ? filters.dimension : [...filters.dimension, Number(filters.customDimension)],
                    is_polynomial: filters.is_polynomial,
                    is_Lattes: filters.is_Lattes,
                    is_Chebyshev: filters.is_Chebyshev,
                    is_Newton: filters.is_Newton,
                    is_pcf: filters.is_pcf,
                    automorphism_group_cardinality: filters.automorphism_group_cardinality,
                    base_field_label: filters.base_field_label,
                    base_field_degree: filters.base_field_degree,
                    indeterminacy_locus_dimension: filters.indeterminacy_locus_dimension,
                    family: filters.family,
                    preperiodic_cardinality: filters.rationalPreperiodicCardinality,
                    num_components: filters.rationalPreperiodicComponents,
                    max_tail: filters.rationalPreperiodicLongestTail
                }
            )
            setSystems(result.data['results']);
            setFiltersApplied({...filters})
            setStat((previousState => {
                return { ...previousState, numMaps: result.data['statistics'][0], avgAUT: Math.round(result.data['statistics'][1] * 100) / 100, numPCF: result.data['statistics'][2], avgHeight: Math.round(result.data['statistics'][3] * 100) / 100, avgResultant: Math.round(result.data['statistics'][4] * 100) / 100 }
            }))
        } catch (error) {
            setSystems(null);
            reportMajorError("There was an error while fetching the information requested. Please contact the system administrator.");
            connectionStatus = false;
            console.log(error)
        }
    };
    const fetchDataForCSV = async () => {
        let labels = []
        if (!systems) {
            return []
        }
        else if (systems) {
            for (let i = 0; i < systems.length; i++) {
                labels.push(systems[i][0])
            }
        }
        try {
            const result = await get_selected_systems({
                labels: labels,
            });
            return result.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    // Utility Functions
    const reportMajorError = (message) => {
        setMajorError(message);
        setOpenMajorErrorModal(true);
    };

    const reportGeneralError = (message) => {
        setGeneralError(message);
        setOpenGeneralErrorSnackbar(true);
    };

    const toggleTree = (event) => {
        let el = event.target;
        el.parentElement.querySelector(".nested").classList.toggle("active");
        el.classList.toggle("caret-down");
    };
    const downloadCSV = async () => {
        try {
            let csvSystems = await fetchDataForCSV();
            if (csvSystems.length == 0) {
                reportGeneralError('There is nothing to download.');
            }
            else {
                // For handing non-empty data
                let csvData = 'degree,N,keywords,base_field_type,base_field_label,base_field_latex,base_field_degree,sigma_inv_1,sigma_inv_2,sigma_inv_3,label,citations,family,models_original_polys_vars,models_original_polys_val,models_original_polys_latex,models_original_resultant,models_original_name,models_original_bad_primes,models_original_height,models_original_base_field_label,models_original_base_field_latex,models_original_num_parameters,models_original_conjugation_from_original_latex,models_original_conjugation_from_original_val,models_original_conjugation_from_original_base_field_label,models_original_conjugation_from_original_num_parameters,display_model,is_morphism,indeterminacy_locus_dimension,is_polynomial,models.monic_centered_polys_vars,models.monic_centered_polys_val,models.monic_centered_polys_latex,models.monic_centered_resultant,models.monic_centered_name,models.monic_centered_num_parameters,models.monic_centered_bad_primes,models.monic_centered_height,models.monic_centered_conjugation_from_original_latex,models.monic_centered_conjugation_from_original_val,models.monic_centered_conjugation_from_original_base_field_label,models.monic_centered_conjugation_from_original_base_field_emb,models.monic_centered_base_field_label,models.monic_centered_base_field_emb,models.monic_centered_base_field_latex,models.Chebyshev_polys_vars,models.Chebyshev_polys_val,models.Chebyshev_polys_latex,models.Chebyshev_name,models.Chebyshev_height,models.Chebyshev_resultant,models.Chebyshev_conjugation_from_original_latex,models.Chebyshev_conjugation_from_original_val,models.Chebyshev_conjugation_from_original_base_field_label,models.Chebyshev_conjugation_from_original_base_field_emb,models.Chebyshev_conjugation_from_original_num_parameters,models.Chebyshev_base_field_label,models.Chebyshev_base_field_emb,models.Chebyshev_base_field_latex,models.Chebyshev_num_parameters,is_Chebyshev,is_Newton,is_Lattes,is_pcf,automorphism_group_cardinality,automorphism_group_matrices\n'
                for (let i = 0; i < csvSystems.length; i++) {
                    for (let j = 0; j < csvSystems[i].length; j++) {
                        if (isNaN(csvSystems[i][j])) {
                            csvData += "\"" + csvSystems[i][j] + "\"" + ","
                        }
                        else {
                            csvData += csvSystems[i][j] + ","
                        }
                    }
                    csvData += '\n'
                }

                const blob = new Blob([csvData], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.setAttribute('href', url)
                a.setAttribute('download', 'results.csv');
                a.click()
            }

        } catch (error) {
            reportMajorError('An error occurred while fetching the data.');
            console.error(error);
        }
    }

    // True Constants
    const defaultFilters = {
        dimension: [],
        degree: [],
        is_polynomial: [],
        is_Lattes: [],
        family: [],
        is_Chebyshev: [],
        is_Newton: [],
        is_pcf: [],
        customDegree: "",
        customDimension: "",
        automorphism_group_cardinality: "",
        base_field_label: "",
        base_field_degree: "",
        indeterminacy_locus_dimension: "",
        preperiodic_cardinality: "",
        num_components: "",
        max_tail: ""
    };

    let connectionStatus = true;

    const textBoxStyle = {
        width: "60px",
        marginRight: "12px",
    };

    return (
        <>
            <div>
                <div className="results-container" container>
                    <Grid className="sidebar" item xs={3}>
                        <div style={{ marginLeft: "10px", marginRight: "10px" }}>
                            <p class="sidebarHead">Filters</p>
                            <Divider />

                            <ul id="myUL">
                                <li>
                                    <span
                                        className="caret"
                                        onClick={toggleTree}
                                    >
                                        Dimension
                                    </span>
                                    <ul className="nested">
                                        <input
                                            type="checkbox"
                                            checked={filters.dimension.includes(1)}
                                            onChange={() => handleCheckboxChange("dimension", 1)}
                                        />
                                        <label>
                                            P<sup>1</sup>{" "}
                                            {String.fromCharCode(8594)} P
                                            <sup>1</sup>
                                        </label>
                                        <br />
                                        <input
                                            type="checkbox"
                                            checked={filters.dimension.includes(2)}
                                            onChange={() => handleCheckboxChange("dimension", 2)}
                                        />
                                        <label>
                                            P<sup>2</sup>{" "}
                                            {String.fromCharCode(8594)} P
                                            <sup>2</sup>
                                        </label>
                                        <br />
                                        <input
                                            type="number"
                                            style={textBoxStyle}
                                            value={filters.customDimension}
                                            onChange={(e) => handleTextChange("customDimension", e.target.value)}
                                        />
                                        <label>Custom</label>
                                        <br />
                                    </ul>
                                </li>
                            </ul>

                            <ul id="myUL">
                                <li>
                                    <span
                                        className="caret"
                                        onClick={toggleTree}
                                    >
                                        Degree
                                    </span>
                                    <ul className="nested">
                                        <input
                                            type="checkbox"
                                            checked={filters.degree.includes(2)}
                                            onChange={() => handleCheckboxChange("degree", 2)}
                                        />
                                        <label>2</label>
                                        <br />
                                        <input
                                            type="checkbox"
                                            checked={filters.degree.includes(3)}
                                            onChange={() => handleCheckboxChange("degree", 3)}
                                        />
                                        <label>3</label>
                                        <br />
                                        <input
                                            type="checkbox"
                                            checked={filters.degree.includes(4)}
                                            onChange={() => handleCheckboxChange("degree", 4)}
                                        />
                                        <label>4</label>
                                        <br />
                                        <input
                                            type="number"
                                            style={textBoxStyle}
                                            value={filters.customDegree || ''}
                                            onChange={(e) => handleTextChange("customDegree", e.target.value)}
                                        />
                                        <label>Custom</label>
                                        <br />
                                    </ul>
                                </li>
                            </ul>

                            <ul id="myUL">
                                <li>
                                    <span
                                        className="caret"
                                        onClick={toggleTree}
                                    >
                                        Type
                                    </span>
                                    <ul className="nested">
                                        <input
                                            type="checkbox"
                                            checked={filters.is_polynomial.includes(true)}
                                            onChange={() => handleCheckboxChange("is_polynomial", true)}
                                        />
                                        <label>Polynomial</label>
                                        <br />
                                        <input
                                            type="checkbox"
                                            checked={filters.is_Lattes.includes(true)}
                                            onChange={() => handleCheckboxChange("is_Lattes", true)}
                                        />
                                        <label>Lattes</label>
                                        <br />
                                        <input
                                            type="checkbox"
                                            checked={filters.is_Chebyshev.includes(true)}
                                            onChange={() => handleCheckboxChange("is_Chebyshev", true)}
                                        />
                                        <label>Chebyshev</label>
                                        <br />
                                        <input
                                            type="checkbox"
                                            checked={filters.is_Newton.includes(true)}
                                            onChange={() => handleCheckboxChange("is_Newton", true)}
                                        />
                                        <label>Newton</label>
                                        <br />
                                    </ul>
                                </li>
                            </ul>

                            <ul id="myUL">
                                <li>
                                    <span
                                        className="caret"
                                        onClick={toggleTree}
                                    >
                                        Field of Definition
                                    </span>
                                    <ul className="nested">
                                        <input
                                            type="number"
                                            style={textBoxStyle}
                                            value={filters.base_field_degree || ''}
                                            onChange={(e) => handleTextChange("base_field_degree", e.target.value)}
                                        />
                                        <label>Degree</label>
                                        <br />
                                        <input
                                            type="text"
                                            style={textBoxStyle}
                                            value={filters.base_field_label || ''}
                                            onChange={(e) => handleTextChange("base_field_label", e.target.value)}
                                        />
                                        <label>Label</label>
                                        <br />
                                    </ul>
                                </li>
                            </ul>

                            <ul id="myUL">
                                <li>
                                    <span
                                        className="caret"
                                        onClick={toggleTree}
                                    >
                                        Rational Periodic Points
                                    </span>
                                    <ul className="nested">
                                        <input
                                            type="text"
                                            style={textBoxStyle}
                                        />
                                        <label>Cardinality</label>
                                        <br />
                                        <input
                                            type="text"
                                            style={textBoxStyle}
                                        />
                                        <label>Largest Cycle</label>
                                        <br />
                                    </ul>
                                </li>
                            </ul>

                            <ul id="myUL">
                                <li>
                                    <span
                                        className="caret"
                                        onClick={toggleTree}
                                    >
                                        Rational Preperiodic Points
                                    </span>
                                    <ul className="nested">
                                        <li>
                                            <input
                                                type="number"
                                                style={textBoxStyle}
                                                value={filters.rationalPreperiodicCardinality || ''}
                                                onChange={(e) => handleTextChange("rationalPreperiodicCardinality", e.target.value)}
                                            />
                                            <label>Cardinality</label>
                                        </li>
                                        <li>
                                            <input
                                                type="number"
                                                style={textBoxStyle}
                                                value={filters.rationalPreperiodicComponents || ''}
                                                onChange={(e) => handleTextChange("rationalPreperiodicComponents", e.target.value)}
                                            />
                                            <label>No of Connected Components</label>
                                        </li>
                                        <li>
                                            <input
                                                type="number"
                                                style={textBoxStyle}
                                                value={filters.rationalPreperiodicLongestTail || ''}
                                                onChange={(e) => handleTextChange("rationalPreperiodicLongestTail", e.target.value)}
                                            />
                                            <label>Longest Tail</label>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
 
                            <ul id="myUL">
                                <li>
                                    <span
                                        className="caret"
                                        onClick={toggleTree}
                                    >
                                        Automorphism Group
                                    </span>
                                    <ul className="nested">
                                        <input
                                            type="number"
                                            style={textBoxStyle}
                                            value={filters.automorphism_group_cardinality || ''}
                                            onChange={(e) => handleTextChange("automorphism_group_cardinality", e.target.value)}
                                        />
                                        <label>Cardinality</label>
                                        <br />
                                    </ul>
                                </li>
                            </ul>

                            <ul id="myUL">
                                <li>
                                    <span className="caret" onClick={toggleTree}>Postcritically Finite</span>
                                    <ul className="nested">
                                        <li>
                                            <input
                                                type="radio"
                                                id="isPCFTrue"
                                                name="isPCF"
                                                value="true"
                                                checked={filters.is_pcf.includes("true")}
                                                onChange={() => handleRadioChange('is_pcf', true)}
                                            />
                                            <label htmlFor="isPCFTrue">Is Postcritically Finite</label>
                                        </li>
                                        <li>
                                            <input
                                                type="radio"
                                                id="isPCFFalse"
                                                name="isPCF"
                                                value="false"
                                                checked={filters.is_pcf.includes("false")}
                                                onChange={() => handleRadioChange('is_pcf', false)}
                                            />
                                            <label htmlFor="isPCFFalse">Not Postcritically Finite</label>
                                        </li>
                                        <li>
                                            <input
                                                type="radio"
                                                id="showAll"
                                                name="isPCF"
                                                value="all"
                                                checked={filters.is_pcf.length === 0}
                                                onChange={() => handleRadioChange('is_pcf', '')}
                                            />
                                            <label htmlFor="showAll">Show all</label>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                            <ul id="myUL">
                                <li>
                                    <span
                                        className="caret"
                                        onClick={toggleTree}
                                    >
                                        Family
                                    </span>
                                    <ul className="nested">
                                    {optionsLoading ? (
                                        <div>Loading...</div>
                                      ) : (<Autocomplete
                                            multiple
                                            id="checkboxes-tags-demo"
                                            options={families}
                                            disableCloseOnSelect
                                            getOptionLabel={(option) => option.name}
                                            renderOption={(props, option, { selected }) => (
                                                <li {...props}>
                                                    <Checkbox
                                                        icon={icon}
                                                        checkedIcon={checkedIcon}
                                                        style={{ marginRight: 8 }}
                                                        checked={selected}
                                                    />
                                                    {option.name}
                                                </li>
                                            )}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Checkboxes" placeholder="Families" />
                                            )}
                                            value={filters.family.map((id) => families.find((option) => option.id === id))}
                                            onChange={handleAutocompleteChange}
                                        />)}
                                        <br></br>
                                    </ul>
                                </li>
                            </ul>
                            <ul id="myUL">
                              <li  style={{ paddingBottom: '10px' }}>
                                    <Button
                                        onClick={sendFilters}
                                        variant="primary"
                                        style={{width:'100%'}}
                                    >
                                        Get Results 
                                    </Button>
                                </li>
                                <li>
                                    <Button onClick={clearFilters} variant="danger" style={{width:'100%'}}>
                                        Clear Filters
                                    </Button>
                                </li>
                            </ul>
                            <br />
                        </div>
                    </Grid>

                    <Grid className="results-table" item xs={6}>
                        <span
                            style={{
                                float: "right",
                                color: "red",
                                cursor: "pointer",
                            }}
                            onClick={() => downloadCSV()}
                        >
                            Download
                        </span>
			<label for="pages">Results Per Page:</label>	
			<select id="pages" name="pages"  value={pagesDisplay} onChange={handlePagePerChange}>
			    <option value="10">10</option>
			    <option value="20">20</option>
			    <option value="50">50</option>
			    <option value="100">100</option>
			    <option value="All">All</option>
			</select>
            {filtersApplied && <ActiveFiltersBanner filters={filtersApplied} />}
                        <PaginatedDataTable
                            labels={[
                                "Label",
                                "Domain",
                                "Degree",
                                "Polynomials",
                                "Field",
                            ]}
                            data={
                                systems === null
                                    ? []
                                    : systems.map((x) => [
                                          <Link
                                              to={`/system/${x[5]}/`}
                                              style={{
                                                  color: "red",
                                                  textDecoration: "none",
                                              }}
                                          >
                                              {x[0]}
                                          </Link>,
                                          <>
                                              P<sup>{x[1]}</sup>{" "}
                                              {String.fromCharCode(8594)} P
                                              <sup>{x[1]}</sup>
                                          </>,
                                          x[2],
                                          x[3],
                                          <Link
                                              to={`https://www.lmfdb.org/NumberField/${x[4]}`}
                                              style={{
                                                  color: "red",
                                                  textDecoration: "none",
                                              }}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                          >
                                              {x[4]}
                                          </Link>,
                                      ])
                            }
                            itemsPerPage={pagesPer}
                            currentPage={page} 
                            setCurrentPage={setPage}
                        />

                        {connectionStatus === false ? (
                            <p style={{ color: "red" }}>
                                DATABASE CONNECTION ERROR
                            </p>
                        ) : (
                            <></>
                        )}
                        {systems != null && systems.length === 0 ? (
                            <p>No data meets that criteria</p>
                        ) : (
                            <></>
                        )}
                    </Grid>

                    <Grid className="sidebar" item xs={3}>
                        <div style={{ marginLeft: "10px", marginRight: "10px" }}>
                            <p class="sidebarHead" >RESULT STATISTICS </p>
                            <Divider />

                            <br />
                            <div className='statcontainer'>
                                <label>Number of Maps: </label>
                                {stats.numMaps}
                            </div>

                            <div className="statcontainer">
                                <ul id="myUL">
                                    <li>
                                        <label className="caret" onClick={toggleTree}>Number PCF</label>

                                        <ul className="nested">
                                            <label>Average Size of PC Set</label>
                                            <br />
                                            <label>Largest PC Set</label>
                                            <br />
                                        </ul>
                                    </li>
                                </ul>
                                {stats.numPCF}
                            </div>

                            <div className="statcontainer">
                                <ul id="myUL">
                                    <li><span className="caret" onClick={toggleTree}>Average #Periodic</span>
                                        <ul className="nested">
                                            <label>Most Periodic</label>
                                            <br />
                                            <label>Largest Cycle</label>
                                            <br />
                                        </ul>
                                    </li>
                                </ul>
                            </div>

                            <div className='statcontainer'>
                                <ul id="myUL">
                                    <li><span className="caret" onClick={toggleTree}>Average #Preperiodic</span>
                                        <ul className="nested">
                                            <label>Most Preperiodic </label>
                                            <br />
                                            <label>Largest Comp.</label>
                                            <br />
                                        </ul>
                                    </li>
                                </ul>
                            </div>

                            <div className='statcontainer'>
                                <label>Average #Aut: </label>
                                {stats.avgAUT}
                            </div>
                            <div className='statcontainer'>
                                <label>Average Height: </label>
                                {stats.avgHeight}
                            </div>
                            <div className='statcontainer'>
                                <label>Avg min height: </label>
                                NA
                            </div>
                            <div className='statcontainer'>
                                <label>Average Resultant: </label>
                                {stats.avgResultant}
                            </div>
                            <br />
                        </div>
                    </Grid>
                </div>
            </div>
            <ReportMajorError
                open={openMajorErrorModal}
                onClose={handleMajorErrorClose}
                errorMessage={majorError}
            />
            <ReportGeneralError
                open={openGeneralErrorSnackbar}
                onClose={handleGeneralErrorClose}
                errorMessage={generalError}
            />
        </>
    );
}

export default ExploreSystems;
