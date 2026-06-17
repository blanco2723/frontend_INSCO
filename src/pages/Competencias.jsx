import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Layout from "../components/Layout";
import api from "../services/api";

function Competencias() {

    const [competencias, setCompetencias] = useState([]);
    const [asignaturas, setAsignaturas] = useState([]);

    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [asignaturaId, setAsignaturaId] = useState('');

    const [generandoIA, setGenerandoIA] = useState(false);
 
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
        setNombre('');
        setDescripcion('');
        setAsignaturaId('');
        setEditando(false);
        setIdEditar(null);
    };

    const guardarCompetencia = async () => {

        try {

            if (!nombre || !asignaturaId) {
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
                        nombre,
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
                        nombre,
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

        setNombre(item.nombre);
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


const generarCompetenciaIA = async () => {

    try {

        if (!asignaturaId) {

            return Swal.fire(
                'Seleccione una asignatura',
                '',
                'warning'
            );

        }

           setGenerandoIA(true);

        const asignaturaSeleccionada =
            asignaturas.find(
                a => a.id == asignaturaId
            );

        const res = await api.post(
            '/ia/competencia',
            {
                carrera:
                    asignaturaSeleccionada?.carreras?.nombre ||
                    'Sistemas Informáticos',

                asignatura:
                    asignaturaSeleccionada?.nombre,

                anio:
                    asignaturaSeleccionada?.anio
            }
        );

        setNombre(res.data.nombre);

        setDescripcion(
            res.data.descripcion
        );

        Swal.fire(
            'IA',
            'Competencia generada correctamente',
            'success'
        );

    } catch (error) {

        console.log(error);

        Swal.fire(
            'Error',
            'No se pudo generar la competencia',
            'error'
        );

    }finally {

        setGenerandoIA(false);

    }

};


    return (

        <Layout>

            <div className="row">

                <div className="col-md-12">

                    <div className="card">

                        <div className="card-body">

                            <h4>
                                {
                                    editando
                                        ? 'Editar Competencia'
                                        : 'Nueva Competencia'
                                }
                            </h4>

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
                            type="button"
                            className="btn btn-success mb-3"
                            onClick={generarCompetenciaIA}
                            disabled={generandoIA}
                        >
                            {
                                generandoIA
                                    ? 'Generando...'
                                    : 'Generar Competencia con IA'
                            }
                        </button>


                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Nombre"
                                value={nombre}
                                onChange={(e) =>
                                    setNombre(e.target.value)
                                }
                            />

                            <textarea
                                className="form-control mb-3"
                                placeholder="Descripción"
                                value={descripcion}
                                onChange={(e) =>
                                    setDescripcion(e.target.value)
                                }
                            />


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

                <div className="col-md-12">

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

                                                <td>{item.nombre}</td>

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