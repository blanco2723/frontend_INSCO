import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Layout from "../components/Layout";
import api from "../services/api";

function Proyectos() {

    const [proyectos, setProyectos] = useState([]);
    const [articulaciones, setArticulaciones] = useState([]);

    const [articulacionId, setArticulacionId] = useState('');
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [gestion, setGestion] = useState(new Date().getFullYear());
    const [estado, setEstado] = useState('Planificado');

    const [articulacionSeleccionada, setArticulacionSeleccionada] = useState(null);

    const [editando, setEditando] = useState(false);
    const [idEditar, setIdEditar] = useState(null);

    const [ideasIA, setIdeasIA] = useState([]);
    const [ideaSeleccionada, setIdeaSeleccionada] = useState(null);
    const [generandoIA, setGenerandoIA] = useState(false);

    const [hoveredIdea, setHoveredIdea] = useState(null);
    const toggleIdea = (idea) => {
  setIdeaSeleccionada((prev) => (prev === idea ? null : idea));
};

    useEffect(() => {

        cargarProyectos();
        cargarArticulaciones();

    }, []);


    const cargarProyectos = async () => {

        const res =
            await api.get('/proyectos');

        setProyectos(res.data);

    };

    const cargarArticulaciones = async () => {

        const res =
            await api.get('/articulaciones');

        setArticulaciones(res.data);


    };

    const seleccionarArticulacion = (id) => {

        setArticulacionId(id);

        const articulacion = articulaciones.find(
            item => item.id == id
        );

        setArticulacionSeleccionada(
            articulacion || null
        );

        if (articulacion?.propuesta_proyecto) {

            setNombre(
                articulacion.propuesta_proyecto
            );

        }

    };

    const guardarProyecto = async () => {

        try {

            if (
                !articulacionId ||
                !nombre ||
                !gestion
            ) {

                Swal.fire(
                    'Atención',
                    'Complete los campos obligatorios',
                    'warning'
                );

                return;

            }

            const datos = {
                articulacion_id: articulacionId,
                nombre,
                descripcion,
                gestion,
                estado
            };

            if (editando) {

                await api.put(
                    `/proyectos/${idEditar}`,
                    datos
                );

            } else {

                await api.post(
                    '/proyectos',
                    datos
                );

            }

            Swal.fire(
                'Éxito',
                'Proyecto guardado correctamente',
                'success'
            );

            limpiarFormulario();

            cargarProyectos();

        } catch (error) {

            console.log(error);

            Swal.fire(
                'Error',
                'No se pudo guardar',
                'error'
            );

        }

    };

    const editarProyecto = (item) => {

        setArticulacionId(
            item.articulacion_id
        );

        setNombre(
            item.nombre
        );

        setDescripcion(
            item.descripcion
        );

        setGestion(
            item.gestion
        );

        setEstado(
            item.estado
        );

        const articulacion = articulaciones.find(
            a => a.id === item.articulacion_id
        );

        setArticulacionSeleccionada(
            articulacion || null
        );

        setIdEditar(
            item.id
        );

        setEditando(true);

    };
    const eliminarProyecto = async (id) => {

        const resultado =
            await Swal.fire({

                title: '¿Eliminar proyecto?',
                text: 'Esta acción no se puede deshacer',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar'

            });

        if (!resultado.isConfirmed) {

            return;

        }

        try {

            await api.delete(
                `/proyectos/${id}`
            );

            Swal.fire(
                'Eliminado',
                'Proyecto eliminado correctamente',
                'success'
            );

            cargarProyectos();

        } catch (error) {

            console.log(error);

        }

    };
    const limpiarFormulario = () => {

        setArticulacionId('');

        setArticulacionSeleccionada(null);
        setArticulacionSeleccionada([])

        setNombre('');

        setDescripcion('');

        setGestion(
            new Date().getFullYear()
        );

        setEstado(
            'Planificado'
        );

        setEditando(false);

        setIdEditar(null);
        setIdeasIA([]);
        setIdeaSeleccionada(null);

    };

    const generarIdeasProyecto = async () => {

        try {

            if (!articulacionSeleccionada) {

                Swal.fire(
                    "Seleccione una articulación",
                    "",
                    "warning"
                );

                return;

            }

            setGenerandoIA(true);

            const res =
                await api.post(
                    "/ia/proyectos",
                    {
                        contenido:
                            articulacionSeleccionada
                                ?.contenidos?.nombre,

                        saber:
                            articulacionSeleccionada
                                ?.saberes?.titulo,

                        observacion:
                            articulacionSeleccionada
                                ?.observacion,

                        nivel:
                            articulacionSeleccionada
                                ?.nivel,

                        propuesta:
                            articulacionSeleccionada
                                ?.propuesta_proyecto
                    }
                );

            setIdeasIA(
                res.data
            );

        } catch (error) {

            console.log(error);

            Swal.fire(
                "Error",
                "No se pudieron generar ideas",
                "error"
            );

        } finally {

            setGenerandoIA(false);

        }

    };


    const usarIdea = () => {

        setNombre(
            ideaSeleccionada.titulo
        );

        setDescripcion(
            ideaSeleccionada.descripcion
        );

        setIdeasIA([]);

        setIdeaSeleccionada(null);

    };

    return (
        <Layout>

            <div className="container-fluid">

                <div className="row">

                    <div className="col-md-8">

                        <div className="card shadow">

                            <div className="card-body">

                                <h4>
                                    Nuevo Proyecto
                                </h4>

                                <hr />

                                <div className="mb-3">

                                    <label className="form-label">
                                        Articulación
                                    </label>

                                    <select
                                        className="form-select"
                                        value={articulacionId}
                                        onChange={(e) => {

                                            const id =
                                                e.target.value;

                                            setArticulacionId(id);

                                            const articulacion =
                                                articulaciones.find(
                                                    item =>
                                                        item.id ==
                                                        id
                                                );

                                            setArticulacionSeleccionada(
                                                articulacion
                                            );

                                            if (
                                                articulacion?.propuesta_proyecto
                                            ) {

                                                setNombre(
                                                    articulacion.propuesta_proyecto
                                                );

                                            }

                                        }}
                                    >

                                        <option value="">
                                            Seleccione una articulación
                                        </option>

                                        {
                                            articulaciones.map(item => (

                                                <option
                                                    key={item.id}
                                                    value={item.id}
                                                >

                                                    {
                                                        item.contenidos?.nombre
                                                    }

                                                    {" ↔ "}

                                                    {
                                                        item.saberes?.titulo
                                                    }

                                                </option>

                                            ))
                                        }

                                    </select>

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Nombre del Proyecto
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={nombre}
                                        onChange={(e) =>
                                            setNombre(e.target.value)
                                        }
                                    />

                                </div>

                                <div className="d-flex gap-2">

                                    <button
                                        className="btn btn-info"
                                        onClick={generarIdeasProyecto}
                                        disabled={
                                            !articulacionId ||
                                            generandoIA
                                        }
                                    >

                                        {
                                            generandoIA
                                                ? "Generando..."
                                                : "✨ Generar Ideas"
                                        }

                                    </button>
                                </div>

                                    <div className="col-md-12">
                                        {
                                            ideasIA.length > 0 && (

                                                <div className="row mt-3">

                                                    {
                                                        ideasIA.map((idea, index) => (

                                                            <div
                                                                key={index}
                                                                className="col-md-12 mb-3"
                                                            >


<div
  className={`card shadow h-100 ${
    ideaSeleccionada === idea ? "border-primary" : ""
  }`}
  style={{
    cursor: "pointer",
    transition: "0.2s",
    overflow: "hidden"
  }}
  onClick={() => toggleIdea(idea)}
  title={idea.descripcion}
>
  
  {/* HEADER */}
  <div className="card-body">
    <h6 className="text-center mb-0">
      {idea.titulo}
    </h6>
  </div>

  {/* COLLAPSE CONTROLADO */}
  <div
    style={{
      maxHeight: ideaSeleccionada === idea ? "200px" : "0px",
      transition: "max-height 0.35s ease, opacity 0.25s ease",
      overflow: "hidden",
      opacity: ideaSeleccionada === idea ? 1 : 0,
      padding: ideaSeleccionada === idea ? "10px 15px" : "0px 15px",
      backgroundColor: "#f8f9fa"
    }}
  >
    <small>
      {idea.descripcion}
    </small>
  </div>
</div>

                                                            </div>

                                                        ))
                                                    }

                                                </div>

                                            )
                                        }
                                    </div>


                                    <div className="col-md-12">
                                        {
                                            ideaSeleccionada && (

                                                <button
                                                    className="btn btn-success"
                                                    onClick={usarIdea}
                                                >
                                                    Usar Idea Seleccionada
                                                </button>

                                            )
                                        }
                                    </div>


                                

                                <div className="mb-3">

                                    <label className="form-label">
                                        Descripción
                                    </label>

                                    <textarea
                                        className="form-control"
                                        rows="5"
                                        value={descripcion}
                                        onChange={(e) =>
                                            setDescripcion(e.target.value)
                                        }
                                    />

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Gestión
                                    </label>

                                    <input
                                        type="number"
                                        className="form-control"
                                        value={gestion}
                                        onChange={(e) =>
                                            setGestion(e.target.value)
                                        }
                                    />

                                </div>

                                <div className="d-flex gap-2">

                                    <button
                                        className="btn btn-primary"
                                        onClick={guardarProyecto}
                                    >

                                        {
                                            editando
                                                ? 'Actualizar'
                                                : 'Guardar'
                                        }

                                    </button>

                                    <button
                                        className="btn btn-secondary"
                                        onClick={limpiarFormulario}
                                    >
                                        Cancelar
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>
                    <div className="col-md-4">
                        <div className="card shadow">

                            <div className="card-body">

                                {
                                    articulacionSeleccionada && (

                                        <div className="alert alert-info">

                                            <h6>
                                                Información de la Articulación
                                            </h6>

                                            <hr />

                                            <strong>
                                                Contenido:
                                            </strong>

                                            <br />

                                            {
                                                articulacionSeleccionada
                                                    .contenidos?.nombre
                                            }

                                            <br />
                                            <br />

                                            <strong>
                                                Saber:
                                            </strong>

                                            <br />

                                            {
                                                articulacionSeleccionada
                                                    .saberes?.titulo
                                            }

                                            <br />
                                            <br />

                                            <strong>
                                                Nivel:
                                            </strong>

                                            <br />

                                            {
                                                articulacionSeleccionada
                                                    .nivel
                                            }

                                            <br />
                                            <br />

                                            <strong>
                                                Propuesta de Proyecto:
                                            </strong>

                                            <br />

                                            {
                                                articulacionSeleccionada
                                                    .propuesta_proyecto
                                            }

                                        </div>

                                    )
                                }


                            </div>
                        </div>
                    </div>

                </div>

                <div className="col-md-12">
                    <div className="card shadow mt-4">

                        <div className="card-body">

                            <h4>
                                Proyectos Registrados
                            </h4>

                            <div className="table-responsive">

                                <table className="table table-bordered">

                                    <thead className="table-dark">

                                        <tr>

                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Gestión</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {
                                            proyectos.map(item => (

                                                <tr key={item.id}>

                                                    <td>
                                                        {item.id}
                                                    </td>

                                                    <td>
                                                        {item.nombre}
                                                    </td>

                                                    <td>
                                                        {item.gestion}
                                                    </td>

                                                    <td>

                                                        {
                                                            item.estado === "Planificado" && (

                                                                <span className="badge bg-warning text-dark">
                                                                    Planificado
                                                                </span>

                                                            )
                                                        }

                                                        {
                                                            item.estado === "En Desarrollo" && (

                                                                <span className="badge bg-primary">
                                                                    En Desarrollo
                                                                </span>

                                                            )
                                                        }

                                                        {
                                                            item.estado === "Finalizado" && (

                                                                <span className="badge bg-success">
                                                                    Finalizado
                                                                </span>

                                                            )
                                                        }

                                                    </td>

                                                    <td>

                                                        <button
                                                            className="btn btn-primary btn-sm me-2"
                                                        >
                                                            Desarrollar
                                                        </button>

                                                        <button
                                                            className="btn btn-danger btn-sm me-2"
                                                            onClick={() =>
                                                                Swal.fire(
                                                                    'Proyecto incompleto',
                                                                    'Debe desarrollar el proyecto antes de exportar PDF',
                                                                    'warning'
                                                                )
                                                            }
                                                        >
                                                            PDF
                                                        </button>

                                                        <button
                                                            className="btn btn-secondary btn-sm"
                                                            onClick={() =>
                                                                eliminarProyecto(item.id)
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

            </div>

        </Layout>
    );

}

export default Proyectos;