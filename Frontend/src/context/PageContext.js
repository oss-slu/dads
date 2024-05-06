import React, { createContext, useContext, useState } from 'react';
const PageContext = createContext();
export const usePage = () => useContext(PageContext);
export const PageProvider = ({ children }) => {
    const [page, setPage] = useState(1);
    return (
        <PageContext.Provider value={{ page, setPage }}>
            {children}
        </PageContext.Provider>
    );
};
