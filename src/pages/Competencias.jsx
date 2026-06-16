import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Layout from "../components/Layout";
import api from "../services/api";

function Competencias() {

    const [competencias, setCompetencias] = useState([]);
    const [asignaturas, setAsignaturas] = useState([]);

    const [descripcion, setDescripcion] = useState('');
    const [asignaturaId, setAsignaturaId] = useState('');

    const [editando, setEditando] = useState(false);
    const [idEditar, setIdEditar] = useState(null);

    useEffect(() => {
        cargarCompetencias();
        cargarAsignaturas();
    }, []);

    const cargarCompetencias = async () => {
        try {
            const res = await api.get('/competencias');
            setCompetencias(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const cargarAsignaturas = async () => {
        try {
            const res = await api.get('/asignaturas');
            setAsignaturas(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const limpiarFormulario = () => {
        setDescripcion('');
        setAsignaturaId('');
        setEditando(false);
        setIdEditar(null);
    };

    const guardarCompetencia = async () => {

        try {

            if (!asignaturaId) {
                return Swal.fire(
                    'Atención',
                    'Complete los campos obligatorios',
                    'warning'
                );
            }

            if (editando) {

                await api.put(
                    `/competencias/${idEditar}`,
                    {
                        descripcion,
                        asignatura_id: asignaturaId
                    }
                );

                Swal.fire(
                    'Actualizado',
                    'Competencia actualizada',
                    'success'
                );

            } else {

                await api.post(
                    '/competencias',
                    {
                        descripcion,
                        asignatura_id: asignaturaId
                    }
                );

                Swal.fire(
                    'Registrado',
                    'Competencia registrada',
                    'success'
                );
            }

            limpiarFormulario();
            cargarCompetencias();

        } catch (error) {
            console.log(error);
        }
    };

    const editarCompetencia = (item) => {

        setDescripcion(item.descripcion);
        setAsignaturaId(item.asignatura_id);

        setEditando(true);
        setIdEditar(item.id);

    };

    const eliminarCompetencia = async (id) => {

        const respuesta = await Swal.fire({
            title: '¿Eliminar?',
            text: 'No se podrá recuperar',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí'
        });

        if (!respuesta.isConfirmed) return;

        try {

            await api.delete(`/competencias/${id}`);

            Swal.fire(
                'Eliminado',
                'Competencia eliminada',
                'success'
            );

            cargarCompetencias();

        } catch (error) {
            console.log(error);
        }
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
                                        ? 'Editar Competencia'
                                        : 'Nueva Competencia'
                                }
                            </h4>

                            <textarea
                                className="form-control mb-3"
                                placeholder="Descripción"
                                value={descripcion}
                                onChange={(e) =>
                                    setDescripcion(e.target.value)
                                }
                            />

                            <select
                                className="form-select mb-3"
                                value={asignaturaId}
                                onChange={(e) =>
                                    setAsignaturaId(e.target.value)
                                }
                            >

                                <option value="">
                                    Seleccione una asignatura
                                </option>

                                {
                                    asignaturas.map(item => (
                                        <option
                                            key={item.id}
                                            value={item.id}
                                        >
                                            {item.nombre}
                                        </option>
                                    ))
                                }

                            </select>

                            <button
                                className="btn btn-primary"
                                onClick={guardarCompetencia}
                            >
                                {
                                    editando
                                        ? 'Actualizar'
                                        : 'Guardar'
                                }
                            </button>

                        </div>

                    </div>

                </div>

                <div className="col-md-8">

                    <div className="card">

                        <div className="card-body">

                            <table className="table table-bordered">

                                <thead>

                                    <tr>

                                        <th>ID</th>
                                        <th>Competencia</th>
                                        <th>Asignatura</th>
                                        <th>Acciones</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {
                                        competencias.map(item => (

                                            <tr key={item.id}>

                                                <td>{item.id}</td>

                                                <td>{item.descripcion}</td>

                                                <td>
                                                    {item.asignaturas?.nombre}
                                                </td>

                                                <td>

                                                    <button
                                                        className="btn btn-warning btn-sm me-2"
                                                        onClick={() =>
                                                            editarCompetencia(item)
                                                        }
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() =>
                                                            eliminarCompetencia(item.id)
                                                        }
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

export default Competencias;