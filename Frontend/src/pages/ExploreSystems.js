import * as React from 'react';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import DataTable from '../components/DataTable';
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { getFilteredSystems, getSelectedSystems } from '../api/routes';

function ExploreSystems({ width }) {

    const [filters, setFilters] = useState({
        dimension: [],
        degree: [],
        is_polynomial: [],
        is_Lattes: [],
        is_Chebyshev:  [],
        is_Newton:  [],
        customDegree: "",
        customDimension: "",
        base_field_label: "",
        base_field_degree: ""
    });

    const [systems, setSystems] = useState(null);



    const downloadCSV = async () => {
        let csvSystems = await fetchDataForCSV()
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

    //gets data with all of the columns for exporting to csv
    const fetchDataForCSV = async () => {
        let labels = []
        for (let i = 0; i < systems.length; i++) {
            labels.push(systems[i][0])
        }
        try {

            //filters need to have right names to work for backend
            const result = await getSelectedSystems(
                {
                    labels: labels
                }
            )
            return result.data

        } catch (error) {
            console.log(error)
            return []
        }
    };

    const fetchFilteredSystems = async () => {
        try {
            //filters need to have right names to work for backend
            const result = await getFilteredSystems(
                {
                    degree: filters.customDegree === "" ? filters.degree : [...filters.degree, Number(filters.customDegree)], //combine the custom field with checkboxes
                    N: filters.customDimension === "" ? filters.dimension : [...filters.dimension, Number(filters.customDimension)],
                    is_polynomial: filters.is_polynomial,
                    is_Lattes: filters.is_Lattes,
                    is_Chebyshev: filters.is_Chebyshev,
                    is_Newton: filters.is_Newton,
                    base_field_label: filters.base_field_label,
                    base_field_degree: filters.base_field_degree
                }
            )
            setSystems(result.data);
        } catch (error) {
            setSystems(null)
            alert("Error: CANNOT CONNECT TO DATABASE: Make sure Docker is running correctly")
            console.log(error)
        }
    };


    useEffect(() => {
        fetchFilteredSystems();

    }, [filters]); //TODO only gets called when removing a filter and not adding it


    const toggleTree = (event) => {
        let el = event.target;
        el.parentElement.querySelector(".nested").classList.toggle("active");
        el.classList.toggle("caret-down");
    }


    //used to update a boolean filter, filter is [] if false so that it doesn't matter
    //assumes defaulted to false (UNCHECKED)
    const booleanFilter = (filterName) => {
        if (filters[filterName].length === 0) {
            setFilters({ ...filters, [filterName]: [true] })
        }
        else {
            setFilters({ ...filters, [filterName]: [] })
        }
        setSystems(null)
        fetchFilteredSystems();
    }

    //used to set a filter property, replacing it with the old value
    const replaceFilter = (filterName, filterValue) => {
        setFilters({ ...filters, [filterName]: filterValue })
        setSystems(null)
        fetchFilteredSystems();
    }

    //used to add to a filter property that can contain multiple values
    const appendFilter = (filterName, filterValue) => {

        //remove it from list
        if (filters[filterName].includes(filterValue)) {
            setFilters({ ...filters, [filterName]: filters[filterName].filter(item => item !== filterValue) })
        }
        //add it to list
        else {
            filters[filterName].push(filterValue)
        }
        setSystems(null)
        fetchFilteredSystems(); //calling fetch data here probably isn't best practice... might want to fix use effect
    }


    const textBoxStyle = {
        width: "60px",
        marginRight: "12px"
    }

    return (
        <>
            <div style={{ marginLeft: width }}>

                <div className="results-container" container>

                    <Grid className="sidebar" item xs={3}>

                        <div style={{ marginLeft: "10px", marginRight: "10px" }}>
                            <p>Filters</p>
                            <Divider />


                            <ul id="myUL">
                                <li><span className="caret" onClick={toggleTree}>Dimension</span>
                                    <ul className="nested">
                                        <input type="checkbox" onClick={() => appendFilter('dimension', 1)} />
                                        <label>P<sup>1</sup> {String.fromCharCode(8594)} P<sup>1</sup></label>
                                        <br />
                                        <input type="checkbox" onClick={() => appendFilter('dimension', 2)} />
                                        <label>P<sup>2</sup> {String.fromCharCode(8594)} P<sup>2</sup></label>
                                        <br />
                                        <input type="number" style={textBoxStyle}
                                            onChange={(event) => replaceFilter('customDimension', event.target.value)} />
                                        <label>Custom</label>
                                        <br />
                                    </ul>
                                </li>
                            </ul>



                            <ul id="myUL">
                                <li><span className="caret" onClick={toggleTree}>Degree</span>
                                    <ul className="nested">
                                        <input type="checkbox" onClick={() => appendFilter('degree', 2)} />
                                        <label>2</label>
                                        <br />
                                        <input type="checkbox" onClick={() => appendFilter('degree', 3)} />
                                        <label>3</label>
                                        <br />
                                        <input type="checkbox" onClick={() => appendFilter('degree', 4)} />
                                        <label>4</label>
                                        <br />
                                        <input type="number" style={textBoxStyle}
                                            onChange={(event) => replaceFilter('customDegree', event.target.value)} />
                                        <label>Custom</label>
                                        <br />
                                    </ul>
                                </li>
                            </ul>



                            <ul id="myUL">
                                <li><span className="caret" onClick={toggleTree}>Class</span>
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
                                <li><span className="caret" onClick={toggleTree}>Type</span>
                                    <ul className="nested">
                                        <input type="checkbox" onClick={() => booleanFilter('is_polynomial')} />
                                        <label>Polynomial</label>
                                        <br />
                                        <input type="checkbox" onClick={() => booleanFilter('is_Lattes')}/>
                                        <label>Lattes</label>
                                        <br />
                                        <input type="checkbox" onClick={() => booleanFilter('is_Chebyshev')}/>
                                        <label>Chebyshev</label>
                                        <br />
                                        <input type="checkbox" onClick={() => booleanFilter('is_Newton')} />
                                        <label>Newton</label>
                                        <br />
                                    </ul>
                                </li>
                            </ul>

                            <ul id="myUL">
                                <li><span className="caret" onClick={toggleTree}>Field of Definition</span>
                                    <ul className="nested">
                                    <input 
                                        type="number" 
                                        style={textBoxStyle} 
                                        onChange={(event) => replaceFilter('base_field_degree', event.target.value)}
                                    />
                                    <label>Degree</label>
                                    <br />
                                    <input 
                                        type="text" 
                                        style={textBoxStyle} 
                                        onChange={(event) => replaceFilter('base_field_label', event.target.value)}
                                    />
                                    <label>Label</label>
                                    <br />
                                    </ul>
                                </li>
                            </ul>

                            <ul id="myUL">
                                <li><span className="caret" onClick={toggleTree}>Rational Periodic Points</span>
                                    <ul className="nested">
                                        <input type="text" style={textBoxStyle} />
                                        <label>Cardinality</label>
                                        <br />
                                        <input type="text" style={textBoxStyle} />
                                        <label>Largest Cycle</label>
                                        <br />
                                    </ul>
                                </li>
                            </ul>

                            <ul id="myUL">
                                <li><span className="caret" onClick={toggleTree}>Rational Preperiodic Points</span>
                                    <ul className="nested">
                                    </ul>
                                </li>
                            </ul>

                            <ul id="myUL">
                                <li><span className="caret" onClick={toggleTree}>Automorphism Group</span>
                                    <ul className="nested">
                                    </ul>
                                </li>
                            </ul>

                            <ul id="myUL">
                                <li><span className="caret" onClick={toggleTree}>Postcritically Finite</span>
                                    <ul className="nested">
                                    </ul>
                                </li>
                            </ul>

                            <ul id="myUL">
                                <li><span className="caret" onClick={toggleTree}>Indeterminacy Locus</span>
                                    <ul className="nested">
                                    </ul>
                                </li>
                            </ul>
                            <br />

                        </div>
                    </Grid>


                    <Grid className="results-table" item xs={6} >
                        <span style={{ float: "right", color: "red", cursor: 'pointer' }} onClick={() => downloadCSV()}>Download</span>
                        <p style={{ textAlign: "center", marginTop: 0 }}>Results</p>
                        <DataTable
                            labels={['Label', 'Domain', 'Degree', 'Polynomials', 'Field']}
                            data={systems === null ? [] :
                                systems.map(x =>
                                    [
                                        <Link to={`/system/${x[0]}/`} style={{ color: "red", textDecoration: "none" }}>{x[0]}</Link>,
                                        <>P<sup>{x[1]}</sup> {String.fromCharCode(8594)} P<sup>{x[1]}</sup></>,
                                        x[2],
                                        x[3],
                                        <span style={{ color: "red" }}>{x[4]}</span>
                                    ]
                                )
                            }
                        />

                        {systems === null ? <p style = {{color: 'red'}}>Unable to connect to database</p>: <></>}
                        {systems != null && systems.length === 0 ? <p>No data meets that criteria</p> : <></>}
                    </Grid>




                    <Grid className="sidebar" item xs={3}>
                        <div style={{ marginLeft: "10px", marginRight: "10px" }}>
                            <p>Result Statistics</p>
                            <Divider />

                            <br />

                            <label>Number of Maps</label>
                            <input type="text" style={{ float: "right", ...textBoxStyle }} />



                            <br />

                            <ul id="myUL">
                                <li><span className="caret" onClick={toggleTree}>Number PCF</span>
                                    <input type="text" style={{ float: "right", ...textBoxStyle }} />
                                    <ul className="nested">
                                        <input type="text" style={textBoxStyle} />
                                        <label>Average Size of PC Set</label>
                                        <br />
                                        <input type="text" style={textBoxStyle} />
                                        <label>Largest PC Set</label>
                                        <br />
                                    </ul>
                                </li>
                            </ul>



                            <ul id="myUL">
                                <li><span className="caret" onClick={toggleTree}>Average #Periodic</span>
                                    <input type="text" style={{ float: "right", ...textBoxStyle }} />
                                    <ul className="nested">
                                        <input type="text" style={textBoxStyle} />
                                        <label>Most Periodic</label>
                                        <br />
                                        <input type="text" style={textBoxStyle} />
                                        <label>Largest Cycle</label>
                                        <br />
                                    </ul>
                                </li>
                            </ul>

                            <ul id="myUL">
                                <li><span className="caret" onClick={toggleTree}>Average #Preperiodic</span>
                                    <input type="text" style={{ float: "right", ...textBoxStyle }} />
                                    <ul className="nested">
                                        <input type="text" style={textBoxStyle} />
                                        <label>Most Preperiodic </label>
                                        <br />
                                        <input type="text" style={textBoxStyle} />
                                        <label>Largest Comp.</label>
                                        <br />
                                    </ul>
                                </li>
                            </ul>

                            <ul id="myUL">
                                <li><span className="caret" onClick={toggleTree}>Average #Aut</span>
                                    <input type="text" style={{ float: "right", ...textBoxStyle }} />
                                    <ul className="nested">
                                    </ul>
                                </li>
                            </ul>

                            <ul id="myUL">
                                <li><span className="caret" onClick={toggleTree}>Average Height</span>
                                    <input type="text" style={{ float: "right", ...textBoxStyle }} />
                                    <ul className="nested">
                                    </ul>
                                </li>
                            </ul>

                            <ul id="myUL">
                                <li><span className="caret" onClick={toggleTree}>Average smallest <br />
                                    canonical height</span>
                                    <input type="text" style={{ float: "right", ...textBoxStyle }} />
                                    <ul className="nested">
                                    </ul>
                                </li>
                            </ul>

                            <ul id="myUL">
                                <li><span className="caret" onClick={toggleTree}>Average Resultant</span>
                                    <input type="text" style={{ float: "right", ...textBoxStyle }} />
                                    <ul className="nested">
                                    </ul>
                                </li>
                            </ul>

                            <br />

                        </div>
                    </Grid>


                </div>




            </div>



        </>
    )
}

export default ExploreSystems;
