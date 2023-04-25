import './Page2.css'

import * as React from 'react';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import DataTable from '../components/DataTable';
import { useState, useEffect } from 'react';
import { getData, getFilterData, getSystems, getFilteredSystems } from '../api/routes';


function Page1({ width }) {
   
    const [filters, setFilters] = useState({
        dimension: [],
        degree: [],
        customDegree: [],
        customDimension: []
    });

    const [data, setData] = useState(null);

    const fetchData = async () => {
        try {
            
            //todo filters need to have right names to work for backend
            const result = await getFilteredSystems(filters)
            console.log(result)
            let displayData = result.data.map(x =>
                [
                    x[0],
                    <>P<sup>{x[1]}</sup> {String.fromCharCode(8594)} P<sup>{x[1]}</sup></>,
                    x[2],
                    x[3],
                    x[4]
                ]
            )
            setData(displayData);
        } catch (error) {
            setData(null)
            console.log(error)
        }
    };

    useEffect(() => {
        fetchData();

    }, [filters]);


    const toggleTree = (event) => {
        let el = event.target;
        el.parentElement.querySelector(".nested").classList.toggle("active");
        el.classList.toggle("caret-down");
    }


    //used to set a filter property, replacing it with the old value
    const replaceFilter = (filterName, filterValue) => {

        if (filters[filterName].includes(filterValue)) {
            setFilters({ ...filters, [filterName]: [] })
        }
        else {
            setFilters({ ...filters, [filterName]: [filterValue] })
        }

        fetchData();
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
        fetchData();
    }


    const textBoxStyle = {
        width: "60px",
        marginRight: "12px"
    }


    return (
        <>
            <div style={{ marginLeft: width }}>
                <button onClick={() => console.log(filters)}>Log Filters</button>

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
                                        <input type="text" style={textBoxStyle}
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
                                        <input type="text" style={textBoxStyle}
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
                                        <input type="checkbox" />
                                        <label>Polynomial</label>
                                        <br />
                                        <input type="checkbox" />
                                        <label>Lattes</label>
                                        <br />
                                        <input type="checkbox" />
                                        <label>Chebyshev</label>
                                        <br />
                                        <input type="checkbox" />
                                        <label>Newton</label>
                                        <br />
                                    </ul>
                                </li>
                            </ul>

                            <ul id="myUL">
                                <li><span className="caret" onClick={toggleTree}>Field of Definition</span>
                                    <ul className="nested">
                                        <input type="text" style={textBoxStyle} />
                                        <label>Degree</label>
                                        <br />
                                        <input type="text" style={textBoxStyle} />
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
                        <span style={{ float: "right", color: "red" }}>Download</span>
                        <p style={{ textAlign: "center", marginTop: 0 }}>Results</p>
                        <DataTable
                            labels={['Label', 'Domain', 'Degree', 'Polynomials', 'Field']}
                            data={data == null ? [] : data}
                        />

                        {data == null ? <p>Loading Data</p> : <></>}
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

export default Page1;
