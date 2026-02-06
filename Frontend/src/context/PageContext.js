import React, { createContext, useContext, useState } from 'react';
const PageContext = createContext(); // Creates a new context for managing the current page number across the application.
export const usePage = () => useContext(PageContext); // Custom hook to access the page context easily within components.
export const PageProvider = ({ children }) => { // Provider component that wraps around parts of the app that need access to page state.
    const [page, setPage] = useState(1);
    return (
        <PageContext.Provider value={{ page, setPage }}>
            {children}
        </PageContext.Provider>
    );
};
