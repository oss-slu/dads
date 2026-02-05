import { get_system } from '../api/routes';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import InfoTable from '../components/FunctionDetail/InfoTable';
import RationalPointsTable from '../components/FunctionDetail/RationalPointsTable';
import CriticalPointsTable from '../components/FunctionDetail/CriticalPointsTable';
import CriticalPointPortraitTable from '../components/FunctionDetail/CriticalPointPortraitTable';
import ModelsTable from '../components/FunctionDetail/ModelsTable';
import CitationsTable from '../components/FunctionDetail/CitationsTable';
import AutomorphismGroupTable from '../components/FunctionDetail/AutomorphismGroupTable';
import FunctionAttributes from '../components/FunctionDetail/FunctionAttributes';
import RationalTwistsTable from '../components/FunctionDetail/RationalTwistsTable'; // Import the new component

function SystemDetails() { // Component to display detailed information about a specific system based on its label.
    const [data, setData] = useState({});
    const { label } = useParams();

    useEffect(() => {
        fetchDataForCSV();
    }, []);

    const fetchDataForCSV = async () => { // Asynchronous function to fetch system data from the backend API using the provided label.
        try {
            const result = await get_system({ id: label });
            setData(result.data);
        } catch (error) {
            console.log(error);
        }
    };

    return ( // Renders various tables displaying different aspects of the system's data.
        <div className="info-container">
            <div className="row">
                <InfoTable data={data} />
            </div>
            <div className="row">
                <FunctionAttributes data={data} />
            </div>
            <div className="row">
                    <RationalTwistsTable data={data} />
            </div>
            <div className="row">
                <div className="col">
                    <RationalPointsTable data={data} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <CriticalPointsTable data={data} />
                </div>
                <div className="col">
                    <CriticalPointPortraitTable data={data} />
                </div>
            </div>
            <div className="row">
                <ModelsTable data={data} />
            </div>
            <div className="row">
                <CitationsTable data={data} />
            </div>
        </div>
    );
}

export default SystemDetails; // Exports the SystemDetails component as the default export of this module, allowing it to be imported and used in other parts of the application.