import React from 'react';

const ActiveFiltersBanner = ({ filters, onRemoveFilter }) => {
    const renderFilter = (key, value) => {
        return (
            <div className="filter-chip" key={key}>
                {key}: {Array.isArray(value) ? value.join(', ') : value}
                <button onClick={() => onRemoveFilter(key)}>x</button>
            </div>
        );
    };

    return (
        <div className="active-filters-container">
            {Object.entries(filters).map(([key, value]) => {
                if (Array.isArray(value) && value.length > 0) {
                    return renderFilter(key, value);
                }
                if (value && !Array.isArray(value) && value !== "") {
                    return renderFilter(key, value);
                }
                return null;
            })}
        </div>
    );
};

export default ActiveFiltersBanner;