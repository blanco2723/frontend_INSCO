function Navbar() {

    const cerrarSesion = () => {

        localStorage.removeItem('token');

        window.location.href = '/';

    };

    return (

        <nav
            className="navbar navbar-expand-lg navbar-light bg-white shadow-sm"
        >

            <div className="container-fluid">

                <span
                    className="navbar-brand fw-bold"
                >
                    Sistema INSCO
                </span>

                <div>

                    <button
                        className="btn btn-danger"
                        onClick={cerrarSesion}
                    >
                        Cerrar Sesión
                    </button>

                </div>

            </div>

        </nav>

    );

}

export default Navbar;