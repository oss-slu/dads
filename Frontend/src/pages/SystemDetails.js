import { getData, getFilterData, getSystems, getFilteredSystems, getSystem } from '../api/routes';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";


function ExploreSystems({ width }) {

    const [data, setData] = useState();
    const label = useParams().label;

    return (
        <>
            <div style={{ marginLeft: width }}>
                <p>Use details for system {label} here</p>
            </div>
        </>
    )


}

export default ExploreSystems;