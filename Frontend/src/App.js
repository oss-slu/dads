import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import ExploreSystems from './pages/ExploreSystems';
import SystemDetails from './pages/SystemDetails'
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar"
import Toolbar from '@mui/material/Toolbar';
import AboutPage from './pages/AboutPage';

function App() {

  const showMenu = true;
  const drawerWidth = showMenu ? 200 : 0;

  return (
    <>
      <BrowserRouter>

        {showMenu && <>
	    <Topbar />
        </>}

        <Routes>
          <Route index element={<AboutPage/>} />
          <Route path="exploreSystems" element={
                      <ExploreSystems />
                      } />
          <Route path="system/:label" element={<SystemDetails/>}/>
        </Routes>
      </BrowserRouter>

    </>



  );
}

export default App;
