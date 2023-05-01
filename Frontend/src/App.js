import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import ExploreSystems from './pages/ExploreSystems';
import SystemDetails from './pages/SystemDetails'
import Sidebar from "./components/Sidebar";
import Tobpbar from "./components/Topbar"
import Toolbar from '@mui/material/Toolbar';


function App() {

  const showMenu = true;
  const drawerWidth = showMenu ? 200 : 0;

  return (
    <>
      <BrowserRouter>

        {showMenu && <>
          <Sidebar width={drawerWidth} />
          <Toolbar />
          <Tobpbar />
        </>}

        <Routes>
          <Route index element={<p style={{ marginLeft: drawerWidth }}> home page</p>} />
          <Route path="exploreSystems" element={<ExploreSystems width={drawerWidth} />} />
          <Route path="system/:label" element={<SystemDetails width={drawerWidth}/>}/>
        </Routes>
      </BrowserRouter>

    </>



  );
}

export default App;
