import './SystemDetails.css'
import { getData, getFilterData, getSystems, getFilteredSystems, getSystem } from '../api/routes';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import InfoTable from '../components/FunctionDetail/InfoTable'
import InfoTable3 from '../components/FunctionDetail/InfoTable3'
import InfoTable2 from '../components/FunctionDetail/InfoTable2'
import RationalPointsTable from '../components/FunctionDetail/RationalPointsTable'
import AutomorphismGroupTable from '../components/FunctionDetail/AutomorphismGroupTable'
import MultiplierInvariantsTable from '../components/FunctionDetail/MultiplierInvariantsTable'
import CriticalPointsTable from '../components/FunctionDetail/CriticalPointsTable'
import CriticalPointPortraitTable from '../components/FunctionDetail/CriticalPointPortraitTable'
import ModelsTable from '../components/FunctionDetail/ModelsTable'
import CitationsTable from '../components/FunctionDetail/CitationsTable'


function ExploreSystems({ width }) {

    const [data, setData] = useState();
    const label = useParams().label;

    return (
        <>
            <div style={{ marginLeft: width }}>
                <p>Use details for system {label} here</p>
                <div className="info-container">
            <div className="row">
              <InfoTable/>
            </div>
            <div className="row">
              <InfoTable2 />
              <InfoTable3 />
            </div>
            <div className="row">
              <MultiplierInvariantsTable />
            </div>
            <div className="row">
              <RationalPointsTable />
              <AutomorphismGroupTable />
            </div>
            <div className="row">
              <CriticalPointsTable />
              <CriticalPointPortraitTable />
            </div>
            <div className="row">
              <ModelsTable />
            </div>
            <div className="row">
              <CitationsTable />
            </div>
        </div>
            </div>
        </>
    )


}

export default ExploreSystems;