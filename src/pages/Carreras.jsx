import Layout from "../components/Layout";

function Carreras() {

    return (

        <Layout>

            <div
                className="d-flex justify-content-between align-items-center mb-4"
            >

                <h2>
                    Gestión de Carreras
                </h2>

                <button
                    className="btn btn-primary"
                >
                    Nueva Carrera
                </button>

            </div>

            <div className="card">

                <div className="card-body">

                    <table className="table">

                        <thead>

                            <tr>

                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Acciones</th>

                            </tr>

                        </thead>

                        <tbody>

                            <tr>

                                <td>1</td>
                                <td>Sistemas Informáticos</td>
                                <td>BTH Sistemas</td>

                                <td>

                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                    >
                                        Eliminar
                                    </button>

                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>

        </Layout>

    );

}

export default Carreras;