import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Carreras from "../pages/Carreras"
import Asignaturas from "../pages/Asignaturas"
import Competencias from "../pages/Competencias"
import Contenidos from "../pages/Contenidos";
import Articulaciones from '../pages/Articulaciones';
import Saberes from '../pages/Saberes';


function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>    
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/carreras" element={<Carreras />}/>
                <Route path="/asignaturas" element={<Asignaturas />}/>
                <Route path="/competencias" element={<Competencias />}/>
                <Route path="/contenidos" element={<Contenidos />}/>
                <Route path="/articulaciones" element={<Articulaciones />}/>
                <Route path="/saberes" element={<Saberes />}/>
            </Routes>
        </BrowserRouter>
    )
}   

export default AppRoutes
