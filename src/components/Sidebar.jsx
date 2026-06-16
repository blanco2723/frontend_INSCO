import { Link } from "react-router-dom";

function Sidebar() {

    return (

        <div
            className="bg-dark text-white"
            style={{
                width: "260px",
                minHeight: "100vh"
            }}
        >

            <div className="p-3">

                <h3>
                    INSCO
                </h3>

                <small>
                    Descolonización Curricular
                </small>

            </div>

            <hr />

            <ul className="nav flex-column">

                <li className="nav-item">
                    <Link
                        to="/dashboard"
                        className="nav-link text-white"
                    >
                        📊 Dashboard
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to="/carreras"
                        className="nav-link text-white"
                    >
                        🎓 Carreras
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to="/asignaturas"
                        className="nav-link text-white"
                    >
                        📚 Asignaturas
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to="/competencias"
                        className="nav-link text-white"
                    >
                        🏆 Competencias
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to="/contenidos"
                        className="nav-link text-white"
                    >
                        📖 Contenidos
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to="/saberes"
                        className="nav-link text-white"
                    >
                        🌱 Saberes
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to="/articulaciones"
                        className="nav-link text-white"
                    >
                        🔗 Articulaciones
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to="/proyectos"
                        className="nav-link text-white"
                    >
                        💻 Proyectos
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to="/evidencias"
                        className="nav-link text-white"
                    >
                        📂 Evidencias
                    </Link>
                </li>

            </ul>

        </div>

    );

}

export default Sidebar;