import * as React from "react";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import PaginatedDataTable from "../components/newDataTable";
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { get_filtered_systems, get_selected_systems} from '../api/routes';
import ReportGeneralError from '../errorreport/ReportGeneralError';
import ReportMajorError from '../errorreport/ReportMajorError';


function ExploreSystems() {
    const [stats, setStat] = useState({

        numMaps:"",
        avgAUT:"",
        numPCF:"", 
        avgHeight:"",
        avgResultant:""
    });
    const [filters, setFilters] = useState({
        dimension: [],
        degree: [],
        is_polynomial: [],
        is_Lattes: [],

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
    //add for error notice
    // State for error modals and snackbars
    const [majorError, setMajorError] = useState('');
    const [openMajorErrorModal, setOpenMajorErrorModal] = useState(false);
    const [generalError, setGeneralError] = useState('');
    const [openGeneralErrorSnackbar, setOpenGeneralErrorSnackbar] = useState(false);

    // Function to close the major error modal
    const handleMajorErrorClose = () => {
        setOpenMajorErrorModal(false);
    };

    // Function to close the general error snackbar
    const handleGeneralErrorClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenGeneralErrorSnackbar(false);
    };

    // Function to report major errors
    const reportMajorError = (message) => {
        setMajorError(message);
        setOpenMajorErrorModal(true);
    };

    // Function to report general errors
    const reportGeneralError = (message) => {
        setGeneralError(message);
        setOpenGeneralErrorSnackbar(true);
    };
    //add for error notice

    let connectionStatus = true;

    const [systems, setSystems] = useState(null);

    const downloadCSV = async () => {
        try {
            let csvSystems = await fetchDataForCSV();
            // Check if the fetched data is empty
            if (csvSystems.length == 0) {
                reportGeneralError('There is nothing to download.');
            }
            else{
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

        }catch (error) {
            reportMajorError('An error occurred while fetching the data.');
            console.error(error);
        }
    }

    //gets data with all of the columns for exporting to csv
    const fetchDataForCSV = async () => {
        let labels = []
        //check if systems is null
        if (!systems){
            return []
        }
        else if(systems){
            for (let i = 0; i < systems.length; i++) {
                labels.push(systems[i][0])
            }
        }
        try {
            //filters need to have right names to work for backend
            const result = await get_selected_systems({
                labels: labels,
            });
            return result.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const fetchFilteredSystems = async () => {
        try {
            //filters need to have right names to work for backend

            const result = await get_filtered_systems(
                {
                    degree: filters.customDegree === "" ? filters.degree : [...filters.degree, Number(filters.customDegree)], //combine the custom field with checkboxes
                    N: filters.customDimension === "" ? filters.dimension : [...filters.dimension, Number(filters.customDimension)],
                    is_polynomial: filters.is_polynomial,
                    is_Lattes: filters.is_Lattes,
                    is_Chebyshev: filters.is_Chebyshev,
                    is_Newton: filters.is_Newton,
                    is_pcf: filters.is_pcf,
		            automorphism_group_cardinality: filters.automorphism_group_cardinality,
                    base_field_label: filters.base_field_label,
                    base_field_degree: filters.base_field_degree,
                    indeterminacy_locus_dimension: filters.indeterminacy_locus_dimension
                }
            )
            console.log(result.data['results'])
            console.log(result.data['statistics'])
            console.log(result.data)
            setSystems(result.data['results']);
            setStat((previousState => {
                return { ...previousState, numMaps:result.data['statistics'][0], avgAUT:Math.round(result.data['statistics'][1]*100)/100, numPCF:result.data['statistics'][2], avgHeight:Math.round(result.data['statistics'][3]*100)/100, avgResultant:Math.round(result.data['statistics'][4]*100)/100}
              }))
        } catch (error) {
            setSystems(null);
            reportMajorError("There was an error while fetching the information requested. Please contact the system administrator.");
		    connectionStatus = false;
            console.log(error)
        }
    };

    useEffect(() => {
        fetchFilteredSystems();
     }, []); 
     
    const toggleTree = (event) => {
        let el = event.target;
        el.parentElement.querySelector(".nested").classList.toggle("active");
        el.classList.toggle("caret-down");
    };

    //used to update a boolean filter, filter is [] if false so that it doesn't matter
    //assumes defaulted to false (UNCHECKED)
    const booleanFilter = (filterName) => {
        if (filters[filterName].length === 0) {
            setFilters({ ...filters, [filterName]: [true] });
        } else {
            setFilters({ ...filters, [filterName]: [] });
        }
    };

    //used to set a filter property, replacing it with the old value
    const replaceFilter = (filterName, filterValue) => {
        setFilters({ ...filters, [filterName]: filterValue });
    };

    //used to add to a filter property that can contain multiple values
    const appendFilter = (filterName, filterValue) => {
        //remove it from list
        if (filters[filterName].includes(filterValue)) {
            setFilters({
                ...filters,
                [filterName]: filters[filterName].filter(
                    (item) => item !== filterValue
                ),
            });
        }
        //add it to list
        else {
            filters[filterName].push(filterValue);
        }
    };

    const textBoxStyle = {
        width: "60px",
        marginRight: "12px",
    };

    const buttonStyle = {
        border: "none",
        backgroundColor: "#376dc4",
        color: "white",
        cursor: "pointer",
        fontSize: "15px",
        padding: "6px 75px",
        borderRadius: "4px",
    };

    const sendFilters = () => {
        setSystems(null);
        fetchFilteredSystems();
    };
    
    const [pagesPer, setPagesPer] = useState('20');

    const [pagesDisplay, setPagesDisplay] = useState('20');

    const handlePagePerChange = (event) => {
    // Update the state with the selected value
    //need to set this to update when filtered systems are queried
    //update number of pages and current page
    if (event.target.value == 'All'){
	setPagesPer(systems.length);
	setPagesDisplay("All");
    } else {
	setPagesPer(event.target.value);
	setPagesDisplay(event.target.value);
    }
  };


    return (
        <>
            <div>
                <div className="results-container" container>
                    <Grid className="sidebar" item xs={3}>


                        <div style={{ marginLeft: "10px", marginRight: "10px" }}>
                            <p class = "sidebarHead">Filters</p>
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
                                            onClick={() =>
                                                appendFilter("dimension", 1)
                                            }
                                        />
                                        <label>
                                            P<sup>1</sup>{" "}
                                            {String.fromCharCode(8594)} P
                                            <sup>1</sup>
                                        </label>
                                        <br />
                                        <input
                                            type="checkbox"
                                            onClick={() =>
                                                appendFilter("dimension", 2)
                                            }
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
                                            onChange={(event) =>
                                                replaceFilter(
                                                    "customDimension",
                                                    event.target.value
                                                )
                                            }
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
                                            onClick={() =>
                                                appendFilter("degree", 2)
                                            }
                                        />
                                        <label>2</label>
                                        <br />
                                        <input
                                            type="checkbox"
                                            onClick={() =>
                                                appendFilter("degree", 3)
                                            }
                                        />
                                        <label>3</label>
                                        <br />
                                        <input
                                            type="checkbox"
                                            onClick={() =>
                                                appendFilter("degree", 4)
                                            }
                                        />
                                        <label>4</label>
                                        <br />
                                        <input
                                            type="number"
                                            style={textBoxStyle}
                                            onChange={(event) =>
                                                replaceFilter(
                                                    "customDegree",
                                                    event.target.value
                                                )
                                            }
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
                                        Class
                                    </span>
                                    <ul className="nested">
                                        <input type="checkbox" />
                                        <label>Function</label>
                                        <br />
                                        <input type="checkbox" />
                                        <label>Family</label>
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
                                            onClick={() =>
                                                booleanFilter("is_polynomial")
                                            }
                                        />
                                        <label>Polynomial</label>
                                        <br />
                                        <input
                                            type="checkbox"
                                            onClick={() =>
                                                booleanFilter("is_Lattes")
                                            }
                                        />
                                        <label>Lattes</label>
                                        <br />
                                        <input
                                            type="checkbox"
                                            onClick={() =>
                                                booleanFilter("is_Chebyshev")
                                            }
                                        />
                                        <label>Chebyshev</label>
                                        <br />
                                        <input
                                            type="checkbox"
                                            onClick={() =>
                                                booleanFilter("is_Newton")
                                            }
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
                                            onChange={(event) =>
                                                replaceFilter(
                                                    "base_field_degree",
                                                    event.target.value
                                                )
                                            }
                                        />
                                        <label>Degree</label>
                                        <br />
                                        <input
                                            type="text"
                                            style={textBoxStyle}
                                            onChange={(event) =>
                                                replaceFilter(
                                                    "base_field_label",
                                                    event.target.value
                                                )
                                            }
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
                                    <ul className="nested"></ul>
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
                                            onChange={(event) =>
                                                replaceFilter(
                                                    "automorphism_group_cardinality",
                                                    event.target.value
                                                )
                                            }
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
                                                onChange={() => replaceFilter('is_pcf', [true])} 
                                            />
                                            <label htmlFor="isPCFTrue">Is Postcritically Finite</label>
                                        </li>
                                        <li>
                                            <input 
                                                type="radio" 
                                                id="isPCFFalse"
                                                name="isPCF" 
                                                value="false"
                                                onChange={() => replaceFilter('is_pcf', [false])} 
                                            />
                                            <label htmlFor="isPCFFalse">Not Postcritically Finite</label>
                                        </li>
                                        <li>
                                            <input
                                                type="radio"
                                                id="showAll"
                                                name="isPCF"
                                                value="all"
                                                onChange={() => replaceFilter('is_pcf', [])}
                                                defaultChecked
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
                                        Indeterminacy Locus
                                    </span>
                                    <ul className="nested">
                                        <input
                                            type="number"
                                            style={textBoxStyle}
                                            onChange={(event) =>
                                                replaceFilter(
                                                    "indeterminacy_locus_dimension",
                                                    event.target.value
                                                )
                                            }
                                        />
                                        <label>Dimension</label>
                                    </ul>
                                </li>
                            </ul>

                            <ul id="myUL">
                                <li>
                                    <button
                                        style={buttonStyle}
                                        onClick={sendFilters}
                                    >
                                        Get Results
                                    </button>
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
                        <p style={{ textAlign: "center", marginTop: 0 }}>
                            Results
                        </p>
			<label for="pages">Results Per Page:</label>	
			<select id="pages" name="pages"  value={pagesDisplay} onChange={handlePagePerChange}>
			    <option value="10">10</option>
			    <option value="20">20</option>
			    <option value="50">50</option>
			    <option value="100">100</option>
			    <option value="All">All</option>
			</select>
			<p></p>
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
                                          <span style={{ color: "red" }}>
                                              {x[4]}
                                          </span>,
                                      ])
                            }
                            itemsPerPage={pagesPer} // You can adjust the number of items per page as needed
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
                            <p class = "sidebarHead" >RESULT STATISTICS </p>
                            <Divider />

                            <br />
                            <div className = 'statcontainer'>
                                <label>Number of Maps: </label>
                                {stats.numMaps}
                            </div>

                            <div className = "statcontainer">
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

                            <div className = "statcontainer">
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

                            <div className = 'statcontainer'>
                                <label>Average #Aut: </label>
                                {stats.avgAUT}
                            </div>
                            <div className = 'statcontainer'>
                                <label>Average Height: </label>
                                {stats.avgHeight}
                            </div>
                            <div className = 'statcontainer'>
                                <label>Avg min height: </label>
                                NA
                            </div>
                            <div className = 'statcontainer'>
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
