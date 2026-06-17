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
            </Routes>
        </BrowserRouter>
    )
}   

export default AppRoutes
