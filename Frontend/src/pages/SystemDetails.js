import { getData, getFilterData, getSystems, getFilteredSystems, getSystem } from '../api/routes';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";


function ExploreSystems({ width }) {

    const [data, setData] = useState([]);
    const label = useParams().label;

    useEffect(() => {
        fetchDataForCSV();
    },[]); 

    const fetchDataForCSV = async () => {
        try {
            const result = await getSystem(
                {
                    label: label
                }
            )
            setData(result.data)

        } catch (error) {
            console.log(error)
            return []
        }
    };

    return (
        <>
            <div style={{ marginLeft: width }}>
                <p>Use details for system {label} here</p>
                <p>{data.toString()}</p>
            </div>
        </>
    )


}

export default ExploreSystems;