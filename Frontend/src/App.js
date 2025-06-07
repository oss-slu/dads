import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import ExploreSystems from './pages/ExploreSystems';
import Families from "./pages/Families";
import SystemDetails from './pages/SystemDetails'
import FamilyDetails from './pages/FamilyDetails'
import Topbar from "./components/Topbar"
import AboutPage from './pages/AboutPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import InformationRadiator from './pages/InformationRadiator';

function App() {


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
          <Route path="/radiator" element={<InformationRadiator />} />
          <Route path="/info" element={<InformationRadiator />} />
        </Routes>
      </BrowserRouter>

    </>



  );
}

export default App;
