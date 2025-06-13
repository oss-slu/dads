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
import PaginatedDataTable from "../components/PaginatedDataTable";
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { get_filtered_systems, get_selected_systems, get_systems, get_families } from '../api/routes';
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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import HelpBox from '../components/FunctionDetail/HelpBox';
import Card from "@mui/material/Card";         // <--- ADD THIS
import CardContent from "@mui/material/CardContent";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';   // <--- ADD THIS
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

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
    const [presetNameInput, setPresetNameInput] = useState('');
    const [facetOptions, setFacetOptions] = useState({});
    const [stats, setStat] = useState({
        numMaps: "",
        avgAUT: "",
        numPCF: "",
        avgHeight: "",
        avgResultant: ""
    });


    
    const [families, setFamilies] = useState([]);
    const {page, setPage} = usePage();
    // Context Hooks
    const { filters, setFilters } = useFilters();

    // Menu setup
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    
    
    const [savedPresetNames, setSavedPresetNames] = useState([]);
    const loadSavedPresets = () => {
        const presets = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('dynabaseFilterPreset_')) {
                presets.push(key.substring('dynabaseFilterPreset_'.length));
            }
        }
        setSavedPresetNames(presets);
    };

    const loadAvailableFacets = async () => { // <--- MOVE THIS ENTIRE FUNCTION UP
        setOptionsLoading(true);
        try {
            const response = await get_systems("facets");
            setFacetOptions(response.data);
        } catch (error) {
            reportMajorError(`Failed to load facet options: ${error.message}`);
        } finally {
            setOptionsLoading(false);
        }
    };

    const handleLoadPreset = (presetName) => {
        if (!presetName) { return; }
        try {
            // Define savedFiltersJson by getting the item from localStorage
            const savedFiltersJson = localStorage.getItem(`dynabaseFilterPreset_${presetName}`);
            if (savedFiltersJson) {
                const loadedFilters = JSON.parse(savedFiltersJson);
                setFilters(loadedFilters); // This updates the filters state
                sendFilters(); // This triggers a new search based on the loaded filters
                reportGeneralError(`Filters "${presetName}" loaded successfully!`);
            } else {
                reportGeneralError(`Preset "${presetName}" not found.`);
            }
        } catch (e) {
            reportMajorError('Could not load filters. Data might be corrupted.');
            console.error(e);
        }
    };

    // ... (other useState declarations) ...
    const [selectedPresetToDelete, setSelectedPresetToDelete] = useState(null); // New state for delete target

    <Autocomplete
    // ... (existing props) ...
    onChange={(event, newValue) => {
        if (newValue) {
            handleLoadPreset(newValue); // Load the selected preset
            setSelectedPresetToDelete(newValue); // <--- ADD THIS LINE: Set the selected preset for potential deletion
        } else {
            setSelectedPresetToDelete(null); // <--- ADD THIS LINE: Clear if nothing is selected
            setFilters({}); // Optionally clear filters if selection is cleared
            sendFilters(); // Optionally re-send empty filters
        }
    }}
    // ... (rest of Autocomplete props) ...
    
/>

const handleDeletePreset = () => { // No need for 'presetName' parameter here, we'll use state
    if (!selectedPresetToDelete) {
        reportGeneralError("Please select a preset to delete first.");
        return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete the preset "${selectedPresetToDelete}"?`);
    if (!confirmDelete) {
        return;
    }

    try {
        localStorage.removeItem(`dynabaseFilterPreset_${selectedPresetToDelete}`);
        loadSavedPresets(); // Refresh the list of presets
        setSelectedPresetToDelete(null); // Clear the selected preset after deletion
        setFilters({}); // Optionally clear filters after deleting the active preset
        sendFilters(); // Optionally re-run search with cleared filters
        reportGeneralError(`Preset "${selectedPresetToDelete}" deleted successfully.`);
    } catch (e) {
        reportMajorError(`Failed to delete preset "${selectedPresetToDelete}".`);
        console.error(e);
    }
};
    useEffect(() => {
        sendFilters();
        loadAvailableFacets(); // This call will now find the function
        loadSavedPresets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSaveFilters = (presetName) => {
    if (presetName.trim() === '') {
        reportGeneralError('Preset name cannot be empty.');
        return;
    }
    try {
        localStorage.setItem(`dynabaseFilterPreset_${presetName}`, JSON.stringify(filters));
        // You'll need to refresh the list of available presets
        loadSavedPresets(); // Call a new function to update the dropdown/list
        reportGeneralError(`Filters saved as "${presetName}"!`);
    } catch (e) {
        reportMajorError('Could not save filters. Browser storage might be full or blocked.');
        console.error(e);
    }
};

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
            setFamilies(autocompleteOptions)
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
                    periodic_cardinality: filters.periodic_cardinality,
                    periodic_cycles: (filters.periodic_cycles),
                    automorphism_group_cardinality: filters.automorphism_group_cardinality,
                    base_field_label: filters.base_field_label,
                    base_field_degree: filters.base_field_degree,
                    indeterminacy_locus_dimension: filters.indeterminacy_locus_dimension,
                    family: filters.family,
                    preperiodic_cardinality: filters.rationalPreperiodicCardinality,
                    num_components: filters.rationalPreperiodicComponents,
                    max_tail: filters.rationalPreperiodicLongestTail,
                    cp_cardinality: filters.cp_cardinality,
                    positive_in_degree: filters.positive_in_degree,
                    sigma_one: filters.sigma_one,
                    sigma_two: filters.sigma_two,
                    model_label: filters.model_label,
                    journal_label: filters.journal_label
                }
            )
            setSystems(result.data['results']);
            setFiltersApplied({...filters})
            setStat((previousState => {
                return { ...previousState, 
                        numMaps: result.data['statistics'][0], 
                        avgAUT: Math.round(result.data['statistics'][1] * 100) / 100, 
                        numPCF: result.data['statistics'][2], 
                        avgHeight: Math.round(result.data['statistics'][3] * 100) / 100, 
                        avgResultant: Math.round(result.data['statistics'][4] * 100) / 100, 
                        avgPCSet: Math.round(result.data['statistics'][5] * 100) / 100, 
                        largestPCSet: result.data['statistics'][6],
                        avgNumPeriodic: Math.round(result.data['statistics'][7] * 100) / 100,
                        mostPeriodic: result.data['statistics'][8],
                        largestPeriodicCycle: result.data['statistics'][9],
                        avgNumPrePeriodic: Math.round(result.data['statistics'][10] * 100) / 100,
                        mostPreperiodic: result.data['statistics'][11],
                        largestComp: result.data['statistics'][12]
                    }
            }))
        } catch (error) {
            setSystems(null);
            reportMajorError("There was an error while fetching the information requested. Please contact the system administrator.");
            connectionStatus = false;
            console.log(error)
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

    const createCSV = (csvSystems, fileName) => {
        try {
            if (csvSystems.length == 0) {
                reportGeneralError('There is nothing to download.');
            }
            else {
                // For handing non-empty data
                let csvData = 'model_label,newton_polynomial_coeffs,base_field_label,automorphism_group_cardinality,base_field_degree,citations,cp_cardinality,cp_field_of_defn,critical_portrait_graph_id,degree,display_model,family,function_id,is_chebyshev,is_lattes,is_newton,is_pcf,is_polynomial,monic_centered.coeffs,monic_centered.resultant,monic_centered.bad_primes,monic_centered.height,monic_centered.base_field_label,ordinal,original_model.coeffs,original_model.resultant,original_model.bad_primes,original_model.height,original_model.base_field_label,rational_twists,reduced_model.coeffs,reduced_model.resultant,reduced_model.bad_primes,reduced_model.height,reduced_model.base_field_label,sigma_one,sigma_two\n'
                for (let i = 0; i < csvSystems.length; i++) {
                    // Going one data entry (one row) at a time
                    csvData += "\"" + String("1." + csvSystems[i].sigma_one + "." + csvSystems[i].sigma_two + "." + csvSystems[i].ordinal).replace(/"/g, '') + "\"" + ","
                    csvData += "\"" + String(csvSystems[i].newton_polynomial_coeffs).replace(/"/g, '') + "\"" + ","
                    csvData += "\"" + String(csvSystems[i].base_field_label).replace(/"/g, '') + "\"" + ","
                    csvData += "\"" + String(csvSystems[i].automorphism_group_cardinality).replace(/"/g, '') + "\"" + ","
                    csvData += "\"" + String(csvSystems[i].base_field_degree).replace(/"/g, '') + "\"" + ","
                    csvData += "\"" + String(csvSystems[i].citations).replace(/"/g, '') + "\"" + ","
                    csvData += "\"" + String(csvSystems[i].cp_cardinality).replace(/"/g, '') + "\"" + ","
                    csvData += "\"" + String(csvSystems[i].cp_field_of_defn).replace(/"/g, '') + "\"" + ","
                    csvData += "\"" + String(csvSystems[i].critical_portrait_graph_id).replace(/"/g, '') + "\"" + ","
                    csvData += "\"" + String(csvSystems[i].degree).replace(/"/g, '') + "\"" + ","
                    csvData += "\"" + String(csvSystems[i].display_model).replace(/"/g, '') + "\"" + ","
                    csvData += "\"" + String(csvSystems[i].family).replace(/"/g, '') + "\"" + ","
                    csvData += "\"" + String(csvSystems[i].function_id).replace(/"/g, '') + "\"" + ","
                    csvData += "\"" + String(csvSystems[i].is_chebyshev).replace(/"/g, '') + "\"" + ","
                    csvData += "\"" + String(csvSystems[i].is_lattes).replace(/"/g, '') + "\"" + ","
                    csvData += "\"" + String(csvSystems[i].is_newton).replace(/"/g, '') + "\"" + ","
                    csvData += "\"" + String(csvSystems[i].is_pcf).replace(/"/g, '') + "\"" + ","
                    csvData += "\"" + String(csvSystems[i].is_polynomial).replace(/"/g, '') + "\"" + ","
                    csvData += "\"" + getEntryFromModelString(csvSystems[i].monic_centered, 0).replace(/"/g, '').replace(/{/g, "[").replace(/}/g, "]") + "\"" + ","
                    csvData += "\"" + getEntryFromModelString(csvSystems[i].monic_centered, 1).replace(/"/g, '').replace(/{/g, "[").replace(/}/g, "]") + "\"" + ","
                    csvData += "\"" + getEntryFromModelString(csvSystems[i].monic_centered, 2).replace(/"/g, '').replace(/{/g, "[").replace(/}/g, "]") + "\"" + ","
                    csvData += "\"" + getEntryFromModelString(csvSystems[i].monic_centered, 3).replace(/"/g, '').replace(/{/g, "[").replace(/}/g, "]") + "\"" + ","
                    csvData += "\"" + getEntryFromModelString(csvSystems[i].monic_centered, 4).replace(/"/g, '').replace(/{/g, "[").replace(/}/g, "]") + "\"" + ","
                    csvData += "\"" + String(csvSystems[i].ordinal).replace(/"/g, '') + "\"" + ","
                    csvData += "\"" + getEntryFromModelString(csvSystems[i].original_model, 0).replace(/"/g, '').replace(/{/g, "[").replace(/}/g, "]") + "\"" + ","
                    csvData += "\"" + getEntryFromModelString(csvSystems[i].original_model, 1).replace(/"/g, '').replace(/{/g, "[").replace(/}/g, "]") + "\"" + ","
                    csvData += "\"" + getEntryFromModelString(csvSystems[i].original_model, 2).replace(/"/g, '').replace(/{/g, "[").replace(/}/g, "]") + "\"" + ","
                    csvData += "\"" + getEntryFromModelString(csvSystems[i].original_model, 3).replace(/"/g, '').replace(/{/g, "[").replace(/}/g, "]") + "\"" + ","
                    csvData += "\"" + getEntryFromModelString(csvSystems[i].original_model, 4).replace(/"/g, '').replace(/{/g, "[").replace(/}/g, "]") + "\"" + ","
                    csvData += "\"" + String(csvSystems[i].rational_twists).replace(/"/g, '') + "\"" + ","
                    csvData += "\"" + getEntryFromModelString(csvSystems[i].reduced_model, 0).replace(/"/g, '').replace(/{/g, "[").replace(/}/g, "]") + "\"" + ","
                    csvData += "\"" + getEntryFromModelString(csvSystems[i].reduced_model, 1).replace(/"/g, '').replace(/{/g, "[").replace(/}/g, "]") + "\"" + ","
                    csvData += "\"" + getEntryFromModelString(csvSystems[i].reduced_model, 2).replace(/"/g, '').replace(/{/g, "[").replace(/}/g, "]") + "\"" + ","
                    csvData += "\"" + getEntryFromModelString(csvSystems[i].reduced_model, 3).replace(/"/g, '').replace(/{/g, "[").replace(/}/g, "]") + "\"" + ","
                    csvData += "\"" + getEntryFromModelString(csvSystems[i].reduced_model, 4).replace(/"/g, '').replace(/{/g, "[").replace(/}/g, "]") + "\"" + ","
                    csvData += "\"" + String(csvSystems[i].sigma_one).replace(/"/g, '') + "\"" + ","
                    csvData += "\"" + String(csvSystems[i].sigma_two).replace(/"/g, '') + "\"" + ","
                    csvData += "\n";
                }

                const blob = new Blob([csvData], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.setAttribute('href', url)
                a.setAttribute('download', fileName + '.csv');
                a.click()
            }

        } catch (error) {
            reportMajorError('An error occurred while fetching the data.');
            console.error(error);
        }
    }

    const downloadSageCode = () => {
        const link = document.createElement('a');
        link.href = '/sage.py'; // Path to your file in public/
        link.download = 'sage.py'; // Desired filename
        link.click();
    };

    const downloadSearchResults = async () => {
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
            createCSV(result.data, "searchResults");
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    function getEntryFromModelString(modelString, index) {
        if (!modelString) {
            return "N/A";
        }

        modelString = modelString.slice(1, -1);

        // Using ugly regex, we will split the model string into an array by separating
        // by commas not inside quotes
        var parsedData = modelString.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);

        if (index >= 0 && index < parsedData.length && parsedData[index] != "") {
            return parsedData[index];
        } else {
            return "N/A";
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
        periodic_cardinality: "",
        periodic_cycles: "",
        preperiodic_cardinality: "",
        num_components: "",
        max_tail: "",
        cp_cardinality: "",
        positive_in_degree: "",
        sigma_one: "",
        sigma_two: "",
        model_label: "",
        journal_label: ""
    };

    let connectionStatus = true;

    const textBoxStyle = {
        width: "60px",
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

    return (
        <>
            <div>
                <div className="results-container" container>
                    <Grid className="sidebar" item xs={3}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '8px', boxShadow: 3 }}>
                            <CardContent>
                        <       div style={{ marginLeft: "10px", marginRight: "10px" }}>
                                <p className="sidebarHead">Filters</p>
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
                                        <label>Field</label>
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
                                            type="number"
                                            style={textBoxStyle}
                                            value={filters.periodic_cardinality || ""}
                                            onChange={(e) => handleTextChange('periodic_cardinality', e.target.value)}
                                        />
                                        <label>Cardinality</label>
                                        <br />
                                        <input
                                            type="number"
                                            style={textBoxStyle}
                                            value={filters.periodic_cycles || ""}
                                            onChange={(e) => handleTextChange('periodic_cycles', e.target.value)}
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
                                    <span className="caret" onClick={toggleTree}>Critical Points</span>
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
                                        <li>
                                        <input
                                            type="number"
                                            style={textBoxStyle}
                                            value={filters.positive_in_degree || ''}
                                            onChange={(e) => handleTextChange("positive_in_degree", e.target.value)}
                                        />
                                        <label>Post Critical Cardinality</label>
                                        </li>
                                        <li>
                                        <input
                                            type="number"
                                            style={textBoxStyle}
                                            value={filters.cp_cardinality || ''}
                                            onChange={(e) => handleTextChange("cp_cardinality", e.target.value)}
                                        />
                                        <label>Num. Critical Points</label>
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
                                        <li className="filter-item"></li>
                                        
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
                                                <TextField {...params} label="Select Families" placeholder="Families" />
                                            )}
                                            value={
                                                    Array.isArray(filters.family) && families.length > 0
                                                        ? filters.family
                                                              .map((id) => families.find((option) => option.id === id))
                                                              .filter(Boolean)
                                                        : []
                                                }
                                                onChange={handleAutocompleteChange}
                                        />)}
                                    </ul>
                                </li>
                            </ul>

                            <ul id="myUL">
                                <li>
                                    <span
                                        className="caret"
                                        onClick={toggleTree}
                                    >
                                        Other Map Properties
                                    </span>
                                    <ul className="nested">
                                        <li>
                                        <label>Sigma 1</label>
                                            <input
                                                type="text"
                                                // style={textBoxStyle} if we want to apply the same style for all text boxes, we can adjust textBoxStyle
                                                style={{ width: "150px", marginRight: "12px" }}
                                                value={filters.sigma_one || ''}
                                                onChange={(e) => handleTextChange("sigma_one", e.target.value)}
                                            />
                                            
                                        </li>
                                        <li>
                                        <label>Sigma 2</label>
                                            <input
                                                type="text"
                                                // style={textBoxStyle}
                                                style={{ width: "150px", marginRight: "12px" }}
                                                value={filters.sigma_two || ''}
                                                onChange={(e) => handleTextChange("sigma_two", e.target.value)}
                                            />
                                        </li>
                                        <li>
                                        <label>Label</label>
                                        {/* <label style={{ display: "block", marginBottom: "5px" }}>Label</label> */}
                                            <input
                                                type="text"
                                                // style={textBoxStyle}
                                                style={{ width: "150px", marginLeft: "22px",marginRight: "12px" }}
                                                value={filters.model_label || ''}
                                                onChange={(e) => handleTextChange("model_label", e.target.value)}
                                            />
                                        </li>
                                         <li></li>   
                                    </ul>
                                </li>
                            </ul>

                            <br></br>
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
                                <li style={{ paddingBottom: '10px' }}>
                                <Button
                                    onClick={() => {
                                        // You might want to open a modal/dialog here to get the preset name
                                        const name = prompt("Enter a name for this filter preset:");
                                        if (name) {
                                            handleSaveFilters(name);
                                        }
                                    }}
                                    variant="success" // A different color for "Save"
                                    style={{width:'100%'}}
                                >
                                    Save Filters
                                </Button>
                            </li>

                            <li style={{ paddingBottom: '10px' }}>
                            {/* REPLACE THIS EXISTING AUTOCOMPLETE BLOCK with the one you cut */}
                            <Autocomplete
                                disablePortal
                                id="load-filter-preset-autocomplete"
                                options={savedPresetNames} // Use the state from loadSavedPresets()
                                sx={{ width: '100%', marginBottom: '10px' }} // Adjusted width and margin
                                renderInput={(params) => <TextField {...params} label="Load Filter Preset" />}
                                onChange={(event, newValue) => {
                                    // When an option is selected, call handleLoadPreset
                                    if (newValue) {
                                        handleLoadPreset(newValue);
                                        setSelectedPresetToDelete(newValue); // <-- This line should be here now
                                        console.log("Autocomplete onChange - selectedPresetToDelete set to:", newValue); // <-- Your debug log
                                    } else {
                                        setSelectedPresetToDelete(null); // <-- This line should be here now
                                        setFilters({}); // Optionally clear filters if selection is cleared
                                        sendFilters(); // Optionally re-send empty filters
                                        console.log("Autocomplete onChange - selectedPresetToDelete cleared."); // <-- Your debug log
                                    }
                                }}
                                    // Optional: Add a clear button or manage selected value state
                                />
                                {/* Optional: Add a Delete button for selected preset */}
                                {/* <Button onClick={() => handleDeletePreset(selectedPreset)} variant="secondary" style={{width:'100%'}}>Delete Selected Preset</Button> */}
                                
                                <Button
                                    onClick={handleDeletePreset}
                                    variant="danger"
                                    style={{ width: '100%', marginTop: '10px' }}
                                    disabled={!selectedPresetToDelete} // This keeps the button disabled until a preset is selected
                                >
                                    Delete Selected Preset
                                </Button>
                            </li>


                            </ul>
                            <br />
                        </div>
                        </CardContent>
                        </Card>
                    </Grid>

                    <Grid className="results-table" item xs={6}>
                        <span
                            style={{
                                float: "right",
                                color: 'blue',
                                textDecoration: 'underline',
                                cursor: 'pointer'
                            }}

                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}>
                        Download
                    </span>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                        'aria-labelledby': 'basic-button',
                        }}
                    >
                            <MenuItem onClick={() => {downloadSearchResults(); handleClose();}}>Download Search Results</MenuItem>
                            <MenuItem onClick={() => {downloadSageCode(); handleClose();}}>Download Sage Code</MenuItem>
                    </Menu>
			<label htmlFor="pages">Results Per Page:</label>	
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
                                <><span style={smallStyles.inlineHelpLabel}>Label</span><HelpBox description="A unique identifier of the form N.S1.S2.M where N is the dimension of the domain, S1 is a hash of the sigma invariants of the fixed points, S2 is a hash of the sigma invariants of the points of period 2, and M is an ordinal to ensure uniqueness." title="Label" /></>,
                                <><span style={smallStyles.inlineHelpLabel}>Domain</span><HelpBox description="The ambient domain of the map; a projective space" title="Domain" /></>,
                                <><span style={smallStyles.inlineHelpLabel}>Degree</span><HelpBox description="Degree of the homogeneous polynomials of a representative of this map." title="Degree" /></>,
                                <><span style={smallStyles.inlineHelpLabel}>Polynomial</span><HelpBox description="Representative polynomials in the selected standard model." title="Polynomials" /></>,
                                <><span style={smallStyles.inlineHelpLabel}>Field</span><HelpBox description="The smallest field containing all coefficients of the standard representative polynomials." title="Field" /></>
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
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '8px', boxShadow: 3 }}>
                            <CardContent>
                        <div style={{ marginLeft: "10px", marginRight: "10px" }}>
                            <p className="sidebarHead" >RESULT STATISTICS </p>
                            <Divider sx={{mb: 2}} />

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
                                            <label>Avg Size of PC Set: </label>
                                            {stats.avgPCSet}
                                            <br />
                                            <label>Largest PC Set: </label>
                                            {stats.largestPCSet}
                                            <br />
                                        </ul>
                                    </li>
                                </ul>
                                {stats.numPCF}
                            </div>

                            <div className="statcontainer">
                                <ul id="myUL">
                                    <li><span className="caret" onClick={toggleTree}>Avg #Periodic: {stats.avgNumPeriodic}</span>
                                        <ul className="nested">
                                            <label>Most Periodic: {stats.mostPeriodic}</label>
                                            <br />
                                            <label>Largest Cycle: {stats.largestPeriodicCycle}</label>
                                            <br />
                                        </ul>
                                    </li>
                                </ul>
                            </div>

                            <div className='statcontainer'>
                                <ul id="myUL">
                                    <li><span className="caret" onClick={toggleTree}>Avg #Preperiodic: {stats.avgNumPrePeriodic}</span>
                                        <ul className="nested">
                                            <label>Most Preperiodic: {stats.mostPreperiodic} </label>
                                            <br />
                                            <label>Largest Comp.: {stats.largestComp}</label>
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
                        </CardContent>
                        </Card>
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