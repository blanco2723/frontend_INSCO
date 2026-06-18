import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import Layout from "../components/Layout";
import api from "../services/api";

function Saberes() {

    // =====================
    // ESTADOS
    // =====================
    const [saberes, setSaberes] = useState([]);

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [areaProductiva, setAreaProductiva] = useState("");
    const [comunidad, setComunidad] = useState("");

    const [editando, setEditando] = useState(false);
    const [idEditar, setIdEditar] = useState(null);

    // =====================
    // CARGAR SABERES
    // =====================
    useEffect(() => {
        cargarSaberes();
    }, []);

    const cargarSaberes = async () => {
        try {
            const res = await api.get('/saberes');
            setSaberes(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    // =====================
    // LIMPIAR FORM
    // =====================
    const limpiarFormulario = () => {
        setTitulo("");
        setDescripcion("");
        setAreaProductiva("");
        setComunidad("");

        setEditando(false);
        setIdEditar(null);
    };

    // =====================
    // GUARDAR (CREATE / UPDATE)
    // =====================
    const guardarSaber = async () => {
        try {

            // VALIDACIÓN
            if (!titulo || !descripcion) {
                return Swal.fire(
                    'Campos requeridos',
                    'Título y descripción son obligatorios',
                    'warning'
                );
            }

            const datos = {
                titulo,
                descripcion,
                area_productiva: areaProductiva,
                comunidad
            };

            if (editando) {

                await api.put(`/saberes/${idEditar}`, datos);

                Swal.fire(
                    'Actualizado',
                    'Saber actualizado correctamente',
                    'success'
                );

            } else {

                await api.post('/saberes', datos);

                Swal.fire(
                    'Registrado',
                    'Saber creado correctamente',
                    'success'
                );
            }

            limpiarFormulario();
            cargarSaberes();

        } catch (error) {

            console.log(error);

            Swal.fire(
                'Error',
                'No se pudo guardar el saber',
                'error'
            );
        }
    };

    // =====================
    // EDITAR
    // =====================
    const editarSaber = (saber) => {
        setTitulo(saber.titulo);
        setDescripcion(saber.descripcion);
        setAreaProductiva(saber.area_productiva || "");
        setComunidad(saber.comunidad || "");

        setIdEditar(saber.id);
        setEditando(true);
    };

    // =====================
    // ELIMINAR
    // =====================
    const eliminarSaber = async (id) => {

        const confirmar = await Swal.fire({
            title: '¿Eliminar saber?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmar.isConfirmed) return;

        try {

            await api.delete(`/saberes/${id}`);

            Swal.fire(
                'Eliminado',
                'Saber eliminado correctamente',
                'success'
            );

            cargarSaberes();

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

                {/* ================= FORM ================= */}
                <div className="col-md-4">

                    <div className="card shadow">

                        <div className="card-body">

                            <h4>
                                {editando ? "Editar Saber" : "Nuevo Saber"}
                            </h4>

                            <hr />

                            <div className="mb-3">
                                <label className="form-label">Título</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Descripción</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Área productiva</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={areaProductiva}
                                    onChange={(e) => setAreaProductiva(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Comunidad</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={comunidad}
                                    onChange={(e) => setComunidad(e.target.value)}
                                />
                            </div>

                            <button
                                className="btn btn-primary"
                                onClick={guardarSaber}
                            >
                                {editando ? "Actualizar" : "Guardar"}
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

                {/* ================= LISTA ================= */}
                <div className="col-md-8">

                    <div className="card shadow">

                        <div className="card-body">

                            <h4>Lista de Saberes</h4>

                            <div className="table-responsive">

                                <table className="table table-bordered table-hover">

                                    <thead className="table-dark">
                                        <tr>
                                            <th>ID</th>
                                            <th>Título</th>
                                            <th>Área</th>
                                            <th>Comunidad</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {
                                            saberes.map(item => (
                                                <tr key={item.id}>

                                                    <td>{item.id}</td>
                                                    <td>{item.titulo}</td>
                                                    <td>{item.area_productiva}</td>
                                                    <td>{item.comunidad}</td>

                                                    <td>

                                                        <button
                                                            className="btn btn-warning btn-sm me-2"
                                                            onClick={() => editarSaber(item)}
                                                        >
                                                            Editar
                                                        </button>

                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => eliminarSaber(item.id)}
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

export default Saberes;