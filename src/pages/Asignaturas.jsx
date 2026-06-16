import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import Layout from "../components/Layout";
import api from "../services/api";

function Asignaturas() {

    const [asignaturas, setAsignaturas] = useState([]);
    const [carreras, setCarreras] = useState([]);

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [carreraId, setCarreraId] = useState("");
    const [anio, setAnio] = useState("");

    const [editando, setEditando] = useState(false);
    const [idEditar, setIdEditar] = useState(null);

    useEffect(() => {

        cargarAsignaturas();
        cargarCarreras();

    }, []);

    const cargarAsignaturas = async () => {

        try {

            const res = await api.get('/asignaturas');

            setAsignaturas(res.data);

        } catch (error) {

            console.log(error);

        }

    };

    const cargarCarreras = async () => {

        try {

            const res = await api.get('/carreras');

            setCarreras(res.data);

        } catch (error) {

            console.log(error);

        }

    };

    const limpiarFormulario = () => {

        setNombre("");
        setDescripcion("");
        setCarreraId("");
        setAnio("");

        setEditando(false);
        setIdEditar(null);

    };

    const guardarAsignatura = async () => {

        try {

            if (!nombre || !carreraId || !anio) {

                return Swal.fire(
                    'Campos requeridos',
                    'Nombre, carrera y año son obligatorios',
                    'warning'
                );

            }

            if (editando) {

                await api.put(
                    `/asignaturas/${idEditar}`,
                    {
                        nombre,
                        descripcion,
                        carrera_id: carreraId,
                        anio
                    }
                );

                Swal.fire(
                    'Actualizado',
                    'Asignatura actualizada correctamente',
                    'success'
                );

            } else {

                await api.post(
                    '/asignaturas',
                    {
                        nombre,
                        descripcion,
                        carrera_id: carreraId,
                        anio
                    }
                );

                Swal.fire(
                    'Registrado',
                    'Asignatura creada correctamente',
                    'success'
                );

            }

            limpiarFormulario();

            cargarAsignaturas();

        } catch (error) {

            console.log(error);

            Swal.fire(
                'Error',
                'No se pudo guardar la asignatura',
                'error'
            );

        }

    };

    const editarAsignatura = (asignatura) => {

        setNombre(asignatura.nombre);
        setDescripcion(asignatura.descripcion || "");
        setCarreraId(asignatura.carrera_id);
        setAnio(asignatura.anio);

        setIdEditar(asignatura.id);

        setEditando(true);

    };

    const eliminarAsignatura = async (id) => {

        const resultado = await Swal.fire({

            title: '¿Eliminar asignatura?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'

        });

        if (!resultado.isConfirmed) return;

        try {

            await api.delete(`/asignaturas/${id}`);

            Swal.fire(
                'Eliminado',
                'Asignatura eliminada correctamente',
                'success'
            );

            cargarAsignaturas();

        } catch (error) {

            console.log(error);

            Swal.fire(
                'Error',
                'No se pudo eliminar',
                'error'
            );

        }

    };

    return (

        <Layout>

            <div className="row">

                <div className="col-md-4">

                    <div className="card shadow">

                        <div className="card-body">

                            <h4>

                                {
                                    editando
                                        ? "Editar Asignatura"
                                        : "Nueva Asignatura"
                                }

                            </h4>

                            <hr />

                            <div className="mb-3">

                                <label className="form-label">

                                    Nombre

                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">

                                    Descripción

                                </label>

                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">

                                    Carrera

                                </label>

                                <select
                                    className="form-select"
                                    value={carreraId}
                                    onChange={(e) => setCarreraId(e.target.value)}
                                >

                                    <option value="">
                                        Seleccione una carrera
                                    </option>

                                    {
                                        carreras.map(carrera => (

                                            <option
                                                key={carrera.id}
                                                value={carrera.id}
                                            >
                                                {carrera.nombre}
                                            </option>

                                        ))
                                    }

                                </select>

                            </div>

                            <div className="mb-3">

                                <label className="form-label">

                                    Año

                                </label>

                                <select
                                    className="form-select"
                                    value={anio}
                                    onChange={(e) => setAnio(e.target.value)}
                                >

                                    <option value="">
                                        Seleccione un año
                                    </option>

                                    <option value="1">
                                        1er Año
                                    </option>

                                    <option value="2">
                                        2do Año
                                    </option>

                                    <option value="3">
                                        3er Año
                                    </option>

                                </select>

                            </div>

                            <button
                                className="btn btn-primary"
                                onClick={guardarAsignatura}
                            >
                                {
                                    editando
                                        ? "Actualizar"
                                        : "Guardar"
                                }
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

                    <div className="card shadow">

                        <div className="card-body">

                            <h4>
                                Lista de Asignaturas
                            </h4>

                            <div className="table-responsive">

                                <table className="table table-bordered table-hover">

                                    <thead className="table-dark">

                                        <tr>

                                            <th>ID</th>
                                            <th>Asignatura</th>
                                            <th>Año</th>
                                            <th>Carrera</th>
                                            <th>Acciones</th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {
                                            asignaturas.map(item => (

                                                <tr key={item.id}>

                                                    <td>
                                                        {item.id}
                                                    </td>

                                                    <td>
                                                        {item.nombre}
                                                    </td>

                                                    <td>
                                                        {item.anio}
                                                    </td>

                                                    <td>
                                                        {item.carreras?.nombre || "-"}
                                                    </td>

                                                    <td>

                                                        <button
                                                            className="btn btn-warning btn-sm me-2"
                                                            onClick={() => editarAsignatura(item)}
                                                        >
                                                            Editar
                                                        </button>

                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => eliminarAsignatura(item.id)}
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

            </div>

        </Layout>

    );

}

export default Asignaturas;