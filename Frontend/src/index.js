import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';
import { FilterProvider,} from './context/FilterContext'; 
import { PageProvider,} from './context/PageContext'; 


const root = ReactDOM.createRoot(document.getElementById('root')); // Creates a root element for rendering the React application. Targets the HTML element with the id 'root'.
root.render(
  <React.StrictMode>
    <FilterProvider> 
      <PageProvider>
      <App/>
      </PageProvider>
    </FilterProvider>
  </React.StrictMode>
);

