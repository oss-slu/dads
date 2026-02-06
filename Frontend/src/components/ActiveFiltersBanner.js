import React from 'react';

const ActiveFiltersBanner = ({ filters }) => { // Component to display active filters as a banner.
    const renderFilter = (key, value) => { // Helper function to render individual filter chips.
        return ( // Renders a filter chip with the filter name and its value(s).
            <div className="filter-chip" key={key}>
                {key}: {Array.isArray(value) ? value.join(', ') : value}
            </div>
        );
    };

    return ( // Renders the active filters banner with all currently applied filters.
        <div className="active-filters-container">
            {Object.entries(filters).filter(([key, value]) =>
                (Array.isArray(value) && value.length > 0) ||
                (!Array.isArray(value) && value)
            ).map(([key, value]) => renderFilter(key, value))}
        </div>
    );
};

export default ActiveFiltersBanner; // Exports the ActiveFiltersBanner component for use in other parts of the application.
