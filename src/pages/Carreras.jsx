import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import Layout from "../components/Layout";
import api from "../services/api";

function Carreras() {

    const [carreras, setCarreras] = useState([]);

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const [editando, setEditando] = useState(false);
    const [idEditar, setIdEditar] = useState(null);

    useEffect(() => {

        cargarCarreras();

    }, []);

    const cargarCarreras = async () => {

        try {

            const res = await api.get('/carreras');

            setCarreras(res.data);

        } catch (error) {

            console.error(error);

        }

    };

    const guardarCarrera = async () => {

        try {

            if (editando) {

                await api.put(
                    `/carreras/${idEditar}`,
                    {
                        nombre,
                        descripcion
                    }
                );

                Swal.fire(
                    'Actualizado',
                    'Carrera actualizada correctamente',
                    'success'
                );

            } else {

                await api.post(
                    '/carreras',
                    {
                        nombre,
                        descripcion
                    }
                );

                Swal.fire(
                    'Registrado',
                    'Carrera creada correctamente',
                    'success'
                );

            }

            limpiarFormulario();

            cargarCarreras();

        } catch (error) {

            console.error(error);

        }

    };

    const editarCarrera = (carrera) => {

        setNombre(carrera.nombre);
        setDescripcion(carrera.descripcion);

        setEditando(true);

        setIdEditar(carrera.id);

    };

    const eliminarCarrera = async (id) => {

        const resultado = await Swal.fire({
            title: '¿Eliminar?',
            text: 'No podrá recuperarse',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar'
        });

        if (!resultado.isConfirmed) return;

        try {

            await api.delete(`/carreras/${id}`);

            Swal.fire(
                'Eliminado',
                'Carrera eliminada',
                'success'
            );

            cargarCarreras();

        } catch (error) {

            console.error(error);

        }

    };

    const limpiarFormulario = () => {

        setNombre('');
        setDescripcion('');

        setEditando(false);
        setIdEditar(null);

    };

    return (

        <Layout>

            <div className="row">

                <div className="col-md-4">

                    <div className="card">

                        <div className="card-body">

                            <h4>

                                {
                                    editando
                                    ? 'Editar Carrera'
                                    : 'Nueva Carrera'
                                }

                            </h4>

                            <input
                                className="form-control mb-3"
                                placeholder="Nombre"
                                value={nombre}
                                onChange={(e)=>setNombre(e.target.value)}
                            />

                            <textarea
                                className="form-control mb-3"
                                placeholder="Descripción"
                                value={descripcion}
                                onChange={(e)=>setDescripcion(e.target.value)}
                            />

                            <button
                                className="btn btn-primary"
                                onClick={guardarCarrera}
                            >
                                Guardar
                            </button>

                            {
                                editando &&
                                <button
                                    className="btn btn-secondary ms-2"
                                    onClick={limpiarFormulario}
                                >
                                    Cancelar
                                </button>
                            }

                        </div>

                    </div>

                </div>

                <div className="col-md-8">

                    <div className="card">

                        <div className="card-body">

                            <h4>
                                Lista de Carreras
                            </h4>

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

                                    {
                                        carreras.map(carrera => (

                                            <tr key={carrera.id}>

                                                <td>
                                                    {carrera.id}
                                                </td>

                                                <td>
                                                    {carrera.nombre}
                                                </td>

                                                <td>
                                                    {carrera.descripcion}
                                                </td>

                                                <td>

                                                    <button
                                                        className="btn btn-warning btn-sm me-2"
                                                        onClick={() => editarCarrera(carrera)}
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => eliminarCarrera(carrera.id)}
                                                    >
                                                        Eliminar
                                                    </button>

                                                </td>

                                            </tr>

                                        ))
                                    }

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            </div>

        </Layout>

    );

}

export default Carreras;