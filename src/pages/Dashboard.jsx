import { useEffect, useState } from 'react';
import api from '../services/api';

import Layout from '../components/Layout';

function Dashboard() {

    const [datos, setDatos] = useState({});

    useEffect(() => {
        cargarDashboard();
    }, []);

    const cargarDashboard = async () => {
        try {

            const res = await api.get('/dashboard');

            setDatos(res.data);

        } catch (error) {

            console.error(error);

        }
    };

    return (
        <Layout>

        <div className="w-100">

            <h2 className="mb-4">
                Dashboard de Descolonización Curricular
            </h2>

            <div className="row">

                <div className="col-md-3 mb-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5>Contenidos</h5>
                            <h2>{datos.totalContenidos}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5>Saberes Comunitarios</h5>
                            <h2>{datos.totalSaberes}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5>Articulaciones</h5>
                            <h2>{datos.totalArticulaciones}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5>Porcentaje</h5>
                            <h2>{datos.porcentajeArticulaciones}%</h2>
                        </div>
                    </div>
                </div>

            </div>

            <div className="card mt-4">

                <div className="card-body">

                    <h4>
                        Nivel de Descolonización Curricular
                    </h4>

                    <h1>
                        {datos.nivel}
                    </h1>

                </div>

            </div>

        </div>
        

    </Layout>
    );
}

export default Dashboard;