import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import ExploreSystems from './pages/ExploreSystems';
import Families from "./pages/Families";
import SystemDetails from './pages/SystemDetails'
import FamilyDetails from './pages/FamilyDetails'
import Topbar from "./components/Topbar"
import AboutPage from './pages/AboutPage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() { // Main component of the application. Sets up routing and renders different pages based on the URL path. Uses React Router for navigation and includes a top bar for navigation across pages.


  return (
    <>
      <BrowserRouter>
	    <Topbar />
        <Routes>
          <Route index element={<AboutPage/>} />
          <Route path="exploreSystems" element={<ExploreSystems />} />
          <Route path="families" element={<Families />} />
          <Route path="system/:label" element={<SystemDetails/>}/>
          <Route path="family-details/:familyId" element={<FamilyDetails/>}/>
        </Routes>
      </BrowserRouter>

    </>



  );
}

export default App; // Exports App as the default export of this module, allowing it to be imported and used in other parts of the application.
