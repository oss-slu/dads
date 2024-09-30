import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { get_families } from '../api/routes';
import FamilyInfoTable from '../components/FunctionDetail/FamilyInfoTable';

function FamilyDetails() {
    const [data, setData] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        fetchFamilyData();
    }, [id]);

    const fetchFamilyData = async () => {
        try {
            const result = await get_families();
            const familyData = result.data.find(family => family.family_id === parseInt(id));
            setData(familyData);
        } catch (error) {
            console.log(error);
        }
    };

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div className="info-container">
            <div className="row">
                <FamilyInfoTable data={data} />
            </div>
        </div>
    );
}

export default FamilyDetails;