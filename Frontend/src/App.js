import { BrowserRouter, Routes, Route } from "react-router-dom";
import Page1 from './pages/Page1';
import './App.css'
import Page2 from './pages/Page2';
import Sidebar from "./components/Sidebar";
import Tobpbar from "./components/Topbar"
import Toolbar from '@mui/material/Toolbar';
import Data from "./pages/Data";

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
          <Route path="page1" element={<Page1 width={drawerWidth} />} />
          <Route path="page2" element={<Page2 width={drawerWidth} />} />
          <Route path="data" element={<Data width={drawerWidth} />} />

        </Routes>
      </BrowserRouter>

    </>



  );
}

export default App;
