import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import ExploreSystems from './pages/ExploreSystems';
import SystemDetails from './pages/SystemDetails'
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
          <Route path="system/:label" element={<SystemDetails/>}/>
        </Routes>
      </BrowserRouter>

    </>



  );
}

export default App;
