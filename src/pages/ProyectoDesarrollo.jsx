import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

import Layout from "../components/Layout";
import api from "../services/api";

import { useRef } from "react";

function ProyectoDesarrollo() {
    const { id } = useParams();

    const [proyecto, setProyecto] = useState(null);

    const [desarrolloId, setDesarrolloId] = useState(null);

    const [diagnostico, setDiagnostico] = useState('');

    const [justificacion, setJustificacion] = useState('');

    const [objetivoGeneral, setObjetivoGeneral] = useState('');

    const [objetivosEspecificos, setObjetivosEspecificos] = useState('');

    const [actividades, setActividades] = useState('');

    const [recursos, setRecursos] = useState('');

    const [resultados, setResultados] = useState('');

    const [cronograma, setCronograma] = useState('');


    const [conclusiones, setConclusiones] = useState('');

    const [seccionGenerando, setSeccionGenerando] = useState('');

    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const fechaInicioRef = useRef(null);
    const fechaFinRef = useRef(null);


    //para proyecto con ia completo 
    const [showModalIA, setShowModalIA] = useState(false);

    const [inputIA, setInputIA] = useState('');
    const [fechaInicioIA, setFechaInicioIA] = useState('');
    const [fechaFinIA, setFechaFinIA] = useState('');
    const [enfoqueIA, setEnfoqueIA] = useState('');

    const [proyectoCompleto, setProyectoCompleto] = useState('');

    useEffect(() => {

        cargarProyecto();
        cargarDesarrollo();

    }, []);

    const cargarProyecto = async () => {

        try {

            const res =
                await api.get(
                    `/proyectos/${id}`
                );

            setProyecto(
                res.data
            );

        } catch (error) {

            console.log(error);

        }

    };

    const cargarDesarrollo = async () => {

        try {

            const res =
                await api.get(
                    `/proyecto-desarrollo/${id}`
                );

            if (!res.data) {

                return;

            }

            const item =
                res.data;

            setDesarrolloId(item.id);

            setDiagnostico(
                item.diagnostico || ''
            );

            setJustificacion(
                item.justificacion || ''
            );

            setObjetivoGeneral(
                item.objetivo_general || ''
            );

            setObjetivosEspecificos(
                limpiarTexto(
                    res.data.objetivos_especificos
                )
            );

            setActividades(
                limpiarTexto(
                    res.data.actividades
                )
            );

            setRecursos(
                limpiarTexto(
                    res.data.recursos
                )
            );

            setResultados(
                limpiarTexto(
                    res.data.resultados_esperados
                )
            );

            setCronograma(
                limpiarTexto(
                    res.data.cronograma
                )
            );

            setConclusiones(
                limpiarTexto(
                    res.data.conclusiones
                )
            );


            setFechaInicio(res.data.fecha_inicio || '');
            setFechaFin(res.data.fecha_fin || '');

        } catch (error) {

            console.log(error);

        }

    };

    const guardarDesarrollo = async () => {

        try {

            const datos = {

                proyecto_id: id,

                diagnostico,

                justificacion,

                objetivo_general:
                    objetivoGeneral,

                objetivos_especificos:
                    objetivosEspecificos,

                actividades:
                    actividades,

                recursos:
                    recursos,

                resultados_esperados:
                    resultados,

                cronograma,

                conclusiones

            };

            if (desarrolloId) {

                await api.put(
                    `/proyecto-desarrollo/${desarrolloId}`,
                    datos
                );

            } else {

                await api.post(
                    '/proyecto-desarrollo',
                    datos
                );

            }

            Swal.fire(
                'Éxito',
                'Guardado correctamente',
                'success'
            );

            cargarDesarrollo();

        } catch (error) {

            console.log(error);

        }

    };

    const limpiarTexto = (texto) => {

        if (!texto) return '';

        return texto
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/^"|"$/g, '');

    };

    const formatearFecha = (fechaISO) => {

        if (!fechaISO) return '';

        const [anio, mes, dia] = fechaISO.split('-');

        return `${dia}/${mes}/${anio}`;
    };

    const generarDiagnosticoIA = async () => {

        try {

            if (!proyecto) {

                return;

            }

            setSeccionGenerando('diagnostico');

            const res =
                await api.post(
                    '/ia/diagnostico-proyecto',
                    {


                        proyecto: proyecto.nombre,

                        contenido:
                            proyecto.articulaciones
                                ?.contenidos?.nombre,

                        saber:
                            proyecto.articulaciones
                                ?.saberes?.titulo,

                        comunidad:
                            proyecto.articulaciones
                                ?.saberes?.comunidad,

                        area_productiva:
                            proyecto.articulaciones
                                ?.saberes?.area_productiva,

                        observacion:
                            proyecto.articulaciones
                                ?.observacion,

                        nivel:
                            proyecto.articulaciones
                                ?.nivel
                    }
                );

            setDiagnostico(
                res.data.diagnostico
            );

        } catch (error) {

            console.log(error);

            Swal.fire(
                'Error',
                'No se pudo generar',
                'error'
            );

        } finally {

            setSeccionGenerando('');

        }

    };


    const generarJustificacionIA = async () => {

        try {

            if (!proyecto) {

                return;

            }

            setSeccionGenerando('justificacion');

            const res =
                await api.post(
                    '/ia/justificacion-proyecto',
                    {

                        proyecto:
                            proyecto.nombre,

                        contenido:
                            proyecto.articulaciones
                                ?.contenidos?.nombre,

                        saber:
                            proyecto.articulaciones
                                ?.saberes?.titulo,

                        comunidad:
                            proyecto.articulaciones
                                ?.saberes?.comunidad,

                        area_productiva:
                            proyecto.articulaciones
                                ?.saberes?.area_productiva,

                        observacion:
                            proyecto.articulaciones
                                ?.observacion,

                        nivel:
                            proyecto.articulaciones
                                ?.nivel

                    }
                );

            setJustificacion(
                res.data.justificacion
            );

        } catch (error) {

            console.log(error);

        } finally {

            setSeccionGenerando('');

        }

    };

    const generarObjetivoGeneralIA = async () => {

        try {

            if (!proyecto) {

                return;

            }

            setSeccionGenerando('objetivo_general');

            const res =
                await api.post(
                    '/ia/objetivo-general-proyecto',
                    {

                        proyecto:
                            proyecto.nombre,

                        contenido:
                            proyecto.articulaciones
                                ?.contenidos?.nombre,

                        saber:
                            proyecto.articulaciones
                                ?.saberes?.titulo,

                        comunidad:
                            proyecto.articulaciones
                                ?.saberes?.comunidad,

                        area_productiva:
                            proyecto.articulaciones
                                ?.saberes?.area_productiva,

                        observacion:
                            proyecto.articulaciones
                                ?.observacion,

                        nivel:
                            proyecto.articulaciones
                                ?.nivel

                    }
                );

            setObjetivoGeneral(
                res.data.objetivo
            );

        } catch (error) {

            console.log(error);

        } finally {

            setSeccionGenerando('');

        }

    };

    const generarObjetivosEspecificosIA = async () => {

        try {

            setSeccionGenerando('objetivos');

            const res = await api.post(
                '/ia/objetivos-especificos-proyecto',
                {
                    proyecto:
                        proyecto.nombre,

                    contenido:
                        proyecto.articulaciones
                            ?.contenidos?.nombre,

                    saber:
                        proyecto.articulaciones
                            ?.saberes?.titulo,

                    comunidad:
                        proyecto.articulaciones
                            ?.saberes?.comunidad,

                    area_productiva:
                        proyecto.articulaciones
                            ?.saberes?.area_productiva,

                    observacion:
                        proyecto.articulaciones
                            ?.observacion,

                    nivel:
                        proyecto.articulaciones
                            ?.nivel
                }
            );

            setObjetivosEspecificos(
                res.data.objetivos || ''
            );

        } catch (error) {

            console.log(error);

        } finally {

            setSeccionGenerando('');

        }

    };

    const generarActividadesIA =
        async () => {

            try {

                setSeccionGenerando(
                    'actividades'
                );

                const res =
                    await api.post(
                        '/ia/actividades-proyecto',
                        {

                            proyecto:
                                proyecto.nombre,

                            contenido:
                                proyecto.articulaciones
                                    ?.contenidos?.nombre,

                            saber:
                                proyecto.articulaciones
                                    ?.saberes?.titulo,

                            comunidad:
                                proyecto.articulaciones
                                    ?.saberes?.comunidad,

                            area_productiva:
                                proyecto.articulaciones
                                    ?.saberes?.area_productiva,

                            observacion:
                                proyecto.articulaciones
                                    ?.observacion,

                            nivel:
                                proyecto.articulaciones
                                    ?.nivel,

                            objetivos_especificos:
                                objetivosEspecificos

                        }
                    );

                setActividades(
                    res.data.actividades
                    || ''
                );

            } catch (error) {

                console.log(error);

            } finally {

                setSeccionGenerando('');

            }

        };

    const generarRecursosIA = async () => {

        try {

            setSeccionGenerando('recursos');

            const res = await api.post(
                '/ia/recursos-proyecto',
                {

                    proyecto: proyecto.nombre,

                    actividades: actividades

                }
            );

            setRecursos(res.data.recursos || '');

        } catch (error) {

            console.log(error);

        } finally {

            setSeccionGenerando('');

        }

    };

    const generarCronogramaIA = async () => {

        try {

            setSeccionGenerando('cronograma');

            const res = await api.post(
                '/ia/cronograma-proyecto',
                {

                    proyecto: proyecto.nombre,

                    actividades: actividades,

                    fecha_inicio: formatearFecha(fechaInicio),

                    fecha_fin: formatearFecha(fechaFin)


                }
            );

            setCronograma(res.data.cronograma || '');

        } catch (error) {

            console.log(error);

        } finally {

            setSeccionGenerando('');

        }

    };

    const generarResultadosIA = async () => {

        try {

            setSeccionGenerando('resultados');

            const res = await api.post(
                '/ia/resultados-proyecto',
                {

                    proyecto: proyecto.nombre,

                    actividades: actividades,

                    cronograma: cronograma

                }
            );

            setResultados(res.data.resultados || '');

        } catch (error) {

            console.log(error);

        } finally {

            setSeccionGenerando('');

        }

    };

    const generarConclusionesIA = async () => {

        try {

            setSeccionGenerando('conclusiones');

            const res = await api.post(
                '/ia/conclusiones-proyecto',
                {

                    proyecto: proyecto.nombre,

                    objetivos_especificos: objetivosEspecificos,

                    resultados: resultados

                }
            );

            setConclusiones(res.data.conclusiones || '');

        } catch (error) {

            console.log(error);

        } finally {

            setSeccionGenerando('');

        }

    };



   const generarProyectoCompletoIA = async () => {

    try {

        setSeccionGenerando(
            'proyectoCompleto'
        );

        const res =
        await api.post(
            '/ia/proyecto-completo',
            {

                proyecto: {
                    nombre: proyecto?.nombre,
                    descripcion: proyecto?.descripcion
                },

                contenido:
                proyecto?.articulaciones
                ?.contenidos?.nombre,

                saber:
                proyecto?.articulaciones
                ?.saberes?.titulo,

                comunidad:
                proyecto?.articulaciones
                ?.saberes?.comunidad,

                area_productiva:
                proyecto?.articulaciones
                ?.saberes?.area_productiva,

                observacion:
                proyecto?.articulaciones
                ?.observacion,

                enfoque:
                enfoqueIA,

                fecha_inicio:
                formatearFecha(
                    fechaInicioIA
                ),

                fecha_fin:
                formatearFecha(
                    fechaFinIA
                )

            }
        );

        const data =
        res.data;

        setDiagnostico(
            data.diagnostico || ''
        );

        setJustificacion(
            data.justificacion || ''
        );

        setObjetivoGeneral(
            data.objetivo_general || ''
        );

        setObjetivosEspecificos(
            data.objetivos_especificos || ''
        );

        setActividades(
            data.actividades || ''
        );

        setRecursos(
            data.recursos || ''
        );

        setCronograma(
            data.cronograma || ''
        );

        setResultados(
            data.resultados || ''
        );

        setConclusiones(
            data.conclusiones || ''
        );

        setShowModalIA(false);

    } catch (error) {

        console.log(error);

    } finally {

        setSeccionGenerando('');

    }

};

    const extraerSeccion = (texto, seccion) => {

        const partes = texto.split(/\n(?=[A-ZÁÉÍÓÚ ]+\n)/g);

        for (let parte of partes) {

            if (parte.startsWith(seccion)) {
                return parte
                    .replace(seccion, '')
                    .trim();
            }

        }

        return '';
    };

    return (

        <Layout>
            <div className="card mb-4">
                <button
                    className="btn btn-success"
                    onClick={() => setShowModalIA(true)}
                >

                    Generar Proyecto Completo IA

                </button>
                <div className="card-body">

                    <h3>

                        {
                            proyecto?.nombre
                        }

                    </h3>

                    <hr />

                    <p>

                        {
                            proyecto?.descripcion
                        }

                    </p>

                </div>

            </div>

            <div className="d-flex justify-content-between mb-2">

                <label className="form-label">
                    <strong>
                        Diagnóstico
                    </strong>
                </label>

                <button
                    className="btn btn-primary btn-sm"
                    onClick={generarDiagnosticoIA}
                    disabled={
                        seccionGenerando === 'diagnostico'
                    }
                >

                    {
                        seccionGenerando ===
                            'diagnostico'
                            ? 'Generando...'
                            : '✨ Generar IA'
                    }

                </button>

            </div>
            <div className="mb-3">

                <textarea
                    rows="6"
                    className="form-control"
                    value={diagnostico}
                    onChange={(e) =>
                        setDiagnostico(
                            e.target.value
                        )
                    }
                />

            </div>

            <div className="mb-3">

                <div className="d-flex justify-content-between">

                    <label className="form-label">
                        <strong>
                            Justificación
                        </strong>
                    </label>

                    <button
                        className="btn btn-primary btn-sm"
                        onClick={generarJustificacionIA}
                        disabled={seccionGenerando ===
                            'justificacion'
                        }
                    >

                        {
                            seccionGenerando ===
                                'justificacion'
                                ? "Generando..."
                                : "✨ Generar IA"
                        }

                    </button>

                </div>

                <textarea
                    rows="6"
                    className="form-control"
                    value={justificacion}
                    onChange={(e) =>
                        setJustificacion(
                            e.target.value
                        )
                    }
                />

            </div>

            <div className="mb-3">

                <div className="d-flex justify-content-between">

                    <label className="form-label">
                        <strong>
                            Objetivo General
                        </strong>
                    </label>

                    <button
                        className="btn btn-primary btn-sm"
                        onClick={generarObjetivoGeneralIA}
                        disabled={seccionGenerando ===
                            'objetivo_general'
                        }
                    >

                        {
                            seccionGenerando ===
                                'objetivo_general'
                                ? "Generando..."
                                : "✨ Generar IA"
                        }

                    </button>

                </div>

                <textarea
                    rows="4"
                    className="form-control"
                    value={objetivoGeneral}
                    onChange={(e) =>
                        setObjetivoGeneral(
                            e.target.value
                        )
                    }
                />

            </div>

            <div className="card mb-4">

                <div className="card-header d-flex justify-content-between">

                    <strong>

                        Objetivos Específicos

                    </strong>

                    <button
                        className="btn btn-primary btn-sm"
                        onClick={generarObjetivosEspecificosIA}
                        disabled={
                            seccionGenerando ===
                            'objetivos'
                        }
                    >

                        {
                            seccionGenerando ===
                                'objetivos'
                                ? 'Generando...'
                                : '✨ Generar IA'
                        }

                    </button>

                </div>

                <div className="card-body">

                    <textarea
                        rows="10"
                        className="form-control"
                        value={objetivosEspecificos}
                        onChange={(e) =>
                            setObjetivosEspecificos(
                                e.target.value
                            )
                        }
                    />

                </div>

            </div>

            <div className="card mb-4">

                <div className="card-header d-flex justify-content-between">

                    <strong>

                        Actividades

                    </strong>

                    <button
                        className="btn btn-primary btn-sm"
                        onClick={
                            generarActividadesIA
                        }
                        disabled={
                            seccionGenerando ===
                            'actividades'
                        }
                    >

                        {
                            seccionGenerando ===
                                'actividades'
                                ? 'Generando...'
                                : '✨ Generar IA'
                        }

                    </button>

                </div>

                <div className="card-body">

                    <textarea
                        rows="15"
                        className="form-control"
                        value={actividades}
                        onChange={(e) =>
                            setActividades(
                                e.target.value
                            )
                        }
                    />

                </div>

            </div>

            <div className="card mb-4">

                <div className="card-header d-flex justify-content-between">

                    <strong>Recursos</strong>

                    <button
                        className="btn btn-primary btn-sm"
                        onClick={generarRecursosIA}
                        disabled={seccionGenerando === 'recursos'}
                    >

                        {
                            seccionGenerando === 'recursos'
                                ? 'Generando...'
                                : '✨ Generar IA'
                        }

                    </button>

                </div>

                <div className="card-body">

                    <textarea
                        rows="12"
                        className="form-control"
                        value={recursos}
                        onChange={(e) => setRecursos(e.target.value)}
                    />

                </div>

            </div>

            <div className="card mb-4">

                <div className="card-header d-flex justify-content-between">

                    <strong>Cronograma del Proyecto</strong>

                    <button
                        className="btn btn-primary btn-sm"
                        onClick={generarCronogramaIA}
                        disabled={seccionGenerando === 'cronograma'}
                    >

                        {
                            seccionGenerando === 'cronograma'
                                ? 'Generando...'
                                : '✨ Generar IA'
                        }

                    </button>

                </div>

                <div className="card-body">

                    {/* RANGO DE FECHAS */}

                    <div className="row mb-3">

                        <div className="col-md-6">
                            <div className="input-group mb-2">

                                <input
                                    type="date"
                                    className="form-control"
                                    value={fechaInicio}
                                    onChange={(e) => setFechaInicio(e.target.value)}
                                    ref={fechaInicioRef}
                                />

                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => fechaInicioRef.current?.showPicker?.()}
                                >
                                    📅
                                </button>

                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="input-group">

                                <input
                                    type="date"
                                    className="form-control"
                                    value={fechaFin}
                                    onChange={(e) => setFechaFin(e.target.value)}
                                    ref={fechaFinRef}
                                />

                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => fechaFinRef.current?.showPicker?.()}
                                >
                                    📅
                                </button>

                            </div>
                        </div>




                    </div>

                    {/* TEXTAREA EDITABLE */}

                    <textarea
                        rows="18"
                        className="form-control"

                        value={cronograma}
                        onChange={(e) => setCronograma(e.target.value)}
                        placeholder="Aquí se generará o puedes editar el cronograma..."
                    />

                </div>

            </div>

            <div className="card mb-4">

                <div className="card-header d-flex justify-content-between">

                    <strong>Resultados Esperados</strong>

                    <button
                        className="btn btn-primary btn-sm"
                        onClick={generarResultadosIA}
                        disabled={seccionGenerando === 'resultados'}
                    >

                        {
                            seccionGenerando === 'resultados'
                                ? 'Generando...'
                                : '✨ Generar IA'
                        }

                    </button>

                </div>

                <div className="card-body">

                    <textarea
                        rows="12"
                        className="form-control"
                        value={resultados}
                        onChange={(e) => setResultados(e.target.value)}
                    />

                </div>

            </div>

            <div className="card mb-4">

                <div className="card-header d-flex justify-content-between">

                    <strong>Conclusiones</strong>

                    <button
                        className="btn btn-primary btn-sm"
                        onClick={generarConclusionesIA}
                        disabled={seccionGenerando === 'conclusiones'}
                    >

                        {
                            seccionGenerando === 'conclusiones'
                                ? 'Generando...'
                                : '✨ Generar IA'
                        }

                    </button>

                </div>

                <div className="card-body">

                    <textarea
                        rows="12"
                        className="form-control"
                        value={conclusiones}
                        onChange={(e) => setConclusiones(e.target.value)}
                    />

                </div>

            </div>

            <button
                className="btn btn-success"
                onClick={guardarDesarrollo}
            >

                Guardar Desarrollo

            </button>


            {showModalIA && (

                <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>

                    <div className="modal-dialog modal-lg">

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5>Constructor Inteligente de Proyecto</h5>

                                <button
                                    className="btn-close"
                                    onClick={() => setShowModalIA(false)}
                                />

                            </div>

                            <div className="modal-body">

                                {/* TEXTO BASE */}
                                <label>Describe tu proyecto</label>
                                <textarea
                                    className="form-control mb-3"
                                    rows="4"
                                    value={inputIA}
                                    onChange={(e) => setInputIA(e.target.value)}
                                    placeholder="Ej: Proyecto de robótica educativa con enfoque comunitario..."
                                />

                                {/* FECHAS */}
                                <div className="row">

                                    <div className="col-md-6">

                                        <label>Fecha inicio</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={fechaInicioIA}
                                            onChange={(e) => setFechaInicioIA(e.target.value)}
                                        />

                                    </div>

                                    <div className="col-md-6">

                                        <label>Fecha fin</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={fechaFinIA}
                                            onChange={(e) => setFechaFinIA(e.target.value)}
                                        />

                                    </div>

                                </div>

                                {/* enfoque */}
                                <label>Enfoque del proyecto</label>

                                <select
                                    className="form-control"
                                    value={enfoqueIA}
                                    onChange={(e) => setEnfoqueIA(e.target.value)}
                                >

                                    <option value="">Seleccionar</option>
                                    <option value="formacion_tecnica">Formación técnica tecnológica</option>
                                    <option value="transformacion_productiva">Transformación productiva</option>
                                    <option value="innovacion_digital">Innovación digital educativa</option>
                                    <option value="desarrollo_comunitario">Desarrollo comunitario</option>
                                    <option value="emprendimiento">Emprendimiento y producción</option>

                                </select>

                            </div>

                            <div className="modal-footer">

                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowModalIA(false)}
                                >
                                    Cancelar
                                </button>

                                <button
                                    className="btn btn-primary"
                                    onClick={generarProyectoCompletoIA}
                                    disabled={seccionGenerando === 'proyectoCompleto'}
                                >

                                    {
                                        seccionGenerando === 'proyectoCompleto'
                                            ? (
                                                <>
                                                    <span
                                                        className="spinner-border spinner-border-sm me-2"
                                                        role="status"
                                                    />
                                                    Generando proyecto...
                                                </>
                                            )
                                            : (
                                                <>✨ Generar Proyecto Completo</>
                                            )
                                    }

                                </button>
                            </div>

                        </div>

                    </div>

                </div>

            )}
        </Layout>
    )
}
export default ProyectoDesarrollo;