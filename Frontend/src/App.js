import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import ExploreSystems from './pages/ExploreSystems';
// import Families from "./pages/Families"; // old family page, not deleted yet just in case
import FilteredFamilies from "./pages/FilteredFamilies"; // new family page with filters
import SystemDetails from './pages/SystemDetails'
import FamilyDetails from './pages/FamilyDetails'
import Topbar from "./components/Topbar"
import AboutPage from './pages/AboutPage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {


  return (
    <>
      <BrowserRouter>
	    <Topbar />
        <Routes>
          <Route index element={<AboutPage/>} />
          <Route path="exploreSystems" element={<ExploreSystems />} />
          {/* <Route path="families" element={<Families />} /> */} {/* old family page, not deleted yet just in case */}
          <Route path="families" element={<FilteredFamilies />} /> {/* new family page with filters */}
          <Route path="system/:label" element={<SystemDetails/>}/>
          <Route path="family-details/:familyId" element={<FamilyDetails/>}/>
        </Routes>
      </BrowserRouter>

    </>



  );
}

export default App;
