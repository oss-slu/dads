import React from 'react';

const ActiveFiltersBanner = ({ filters }) => {
    const renderFilter = (key, value) => {
        return (
            <div className="filter-chip" key={key}>
                {key}: {Array.isArray(value) ? value.join(', ') : value}
            </div>
        );
    };

    return (
        <div className="active-filters-container">
            {Object.entries(filters).filter(([key, value]) =>
                (Array.isArray(value) && value.length > 0) ||
                (!Array.isArray(value) && value)
            ).map(([key, value]) => renderFilter(key, value))}
        </div>
    );
};

export default ActiveFiltersBanner;
