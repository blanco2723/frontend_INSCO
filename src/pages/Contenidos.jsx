import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Layout from "../components/Layout";
import api from "../services/api";

function Contenidos() {

    const [contenidos,setContenidos] = useState([]);
    const [competencias,setCompetencias] = useState([]);

    const [nombre,setNombre] = useState('');
    const [descripcion,setDescripcion] = useState('');
    const [competenciaId,setCompetenciaId] = useState('');

    const [contenidosIA,setContenidosIA] = useState([]);
    const [generandoIA,setGenerandoIA] = useState(false);
    const [cantidad,setCantidad] = useState([]);


    const [editando,setEditando] = useState(false);
    const [idEditar,setIdEditar] = useState(null);

    useEffect(()=>{

        cargarContenidos();
        cargarCompetencias();

    },[]);

    const cargarContenidos = async ()=>{

        try{

            const res =
            await api.get('/contenidos');

            setContenidos(res.data);

        }catch(error){

            console.log(error);

        }

    };

    const cargarCompetencias = async ()=>{

        try{

            const res =
            await api.get('/competencias');

            setCompetencias(res.data);

        }catch(error){

            console.log(error);

        }

    };

    const guardarContenido = async ()=>{

        try{

            if(!nombre || !competenciaId){

                Swal.fire(
                    'Atención',
                    'Complete los campos',
                    'warning'
                );

                return;
            }

            if(editando){

                await api.put(
                    `/contenidos/${idEditar}`,
                    {
                        nombre,
                        descripcion,
                        competencia_id:competenciaId
                    }
                );

            }else{

                await api.post(
                    '/contenidos',
                    {
                        nombre,
                        descripcion,
                        competencia_id:competenciaId
                    }
                );

            }

            limpiarFormulario();

            cargarContenidos();

            Swal.fire(
                'Éxito',
                'Guardado correctamente',
                'success'
            );

        }catch(error){

            console.log(error);

        }

    };

    const editarContenido = (item)=>{

        setNombre(item.nombre);

        setDescripcion(
            item.descripcion
        );

        setCompetenciaId(
            item.competencia_id
        );

        setIdEditar(item.id);

        setEditando(true);

    };

    const eliminarContenido = async(id)=>{

        const resultado =
        await Swal.fire({
            title:'¿Eliminar?',
            icon:'warning',
            showCancelButton:true
        });

        if(!resultado.isConfirmed){

            return;

        }

        await api.delete(
            `/contenidos/${id}`
        );

        cargarContenidos();

    };

    const limpiarFormulario = ()=>{
    setContenidosIA([]);
    setNombre('');
    setDescripcion('');
    setCompetenciaId('');

    setEditando(false);
    setIdEditar(null);

    };

const generarContenidosIA = async ()=>{

    try{

        setGenerandoIA(true);

        const competencia =
        competencias.find(
            c=>c.id == competenciaId
        );

        const res =
        await api.post(
            '/ia/contenidos',
            {
                competencia:
                competencia.nombre,
                cantidad
            }
        );

        const datos =
        res.data.contenidos.map(
            item=>({
                ...item,
                seleccionado:true
            })
        );

        setContenidosIA(datos);

    }catch(error){

        console.log(error);

        Swal.fire(
            'Error',
            'No se pudieron generar contenidos',
            'error'
        );

    }finally{

        setGenerandoIA(false);

    }

};

const guardarSeleccionados = async ()=>{

    const seleccionados =
    contenidosIA.filter(
        c=>c.seleccionado
    );

    for(
        const contenido
        of seleccionados
    ){

        await api.post(
            '/contenidos',
            {
                nombre:
                contenido.nombre,

                descripcion:
                contenido.descripcion,

                competencia_id:
                competenciaId
            }
        );

    }

    setContenidosIA([]);

    cargarContenidos();

    Swal.fire(
        'Éxito',
        'Contenidos guardados',
        'success'
    );

}

    return (

        <Layout>

            <div className="container-fluid">

                <h2 className="mb-4">
                    Contenidos Curriculares
                </h2>

                <div className="card mb-4">

                    <div className="card-body">
                       
                <div className="row">
                <div className="col-md-6">

                    <select
                        className="form-select mb-3"
                        value={competenciaId}
                        onChange={(e)=>
                            setCompetenciaId(e.target.value)
                        }
                    >

                        <option value="">
                            Seleccione competencia
                        </option>

                        {
                            competencias.map(item => (

                                <option
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.nombre}
                                </option>

                            ))
                        }

                    </select>

                </div>
                <div className="col-md-4">
                     <button
                    className="btn btn-success me-2"
                    onClick={generarContenidosIA}
                    disabled={generandoIA}
                    >

                    {
                    generandoIA
                    ? '⏳ Generando...'
                    : '🤖 Generar con IA'
                    }

                    </button>
                </div>
                <div className="col-md-2">
                        <select className="form-select mb-3"
                        value={cantidad}
                        onChange={(e)=>
                        setCantidad(
                        e.target.value
                        )
                        }
                        >

                        <option value="3">
                        3
                        </option>

                        <option value="4">
                        4
                        </option>

                        <option value="5">
                        5
                        </option>

                        <option value="6">
                        6
                        </option>

                        </select>
                </div>


                </div>
                {
                contenidosIA.length > 0 && (

                <div className="card mt-3">

                <div className="card-header">

                Contenidos propuestos por IA

                </div>

                <div className="card-body">

                {
                contenidosIA.map(
                (item,index)=>(

                <div
                key={index}
                className="form-check mb-3"
                >

                <input
                type="checkbox"
                className="form-check-input"
                checked={
                item.seleccionado
                }
                onChange={()=>{

                const nuevos =
                [...contenidosIA];

                nuevos[index]
                .seleccionado =
                !nuevos[index]
                .seleccionado;

                setContenidosIA(
                nuevos
                );

                }}
                />

                <label
                className="form-check-label"
                >

                <strong>
                {item.nombre}
                </strong>

                <br/>

                {item.descripcion}

                </label>

                </div>

                ))
                }

                </div>

                </div>

                )
                }

                {
                contenidosIA.length === 0 && (

                <>

                <input
                className="form-control mb-3"
                placeholder="Nombre"
                value={nombre}
                onChange={(e)=>
                setNombre(e.target.value)
                }
                />

                <textarea
                className="form-control mb-3"
                rows="4"
                placeholder="Descripción"
                value={descripcion}
                onChange={(e)=>
                setDescripcion(e.target.value)
                }
                />

                <button
                className="btn btn-primary me-2"
                onClick={guardarContenido}
                >
                {
                editando
                ? 'Actualizar'
                : 'Guardar'
                }
                </button>

                </>

                )
                }

 {
                            contenidosIA.length > 0 && (

                            <button
                            className="btn btn-primary me-2"
                            onClick={guardarSeleccionados}
                            >
                            Guardar Seleccionados
                            </button>

                            )
                            }
                        <button
                            className="btn btn-secondary"
                            onClick={
                                limpiarFormulario
                            }
                        >
                            Cancelar
                        </button>

                    </div>

                </div>

                <table className="table table-striped table-hover">

                <thead className="table-dark">

                    <tr>

                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Competencia</th>
                        <th width="180">Acciones</th>

                    </tr>

                </thead>

                <tbody>

                    {
                        contenidos.length > 0
                        ? contenidos.map(item => (

                            <tr key={item.id}>

                                <td>{item.id}</td>

                                <td>{item.nombre}</td>

                                <td>{item.descripcion}</td>

                                <td>
                                    {item.competencias?.nombre}
                                </td>

                                <td>

                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() =>
                                            editarContenido(item)
                                        }
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() =>
                                            eliminarContenido(item.id)
                                        }
                                    >
                                        Eliminar
                                    </button>

                                </td>

                            </tr>

                        ))
                        :
                        (
                            <tr>

                                <td
                                    colSpan="5"
                                    className="text-center"
                                >
                                    No existen contenidos registrados
                                </td>

                            </tr>
                        )
                    }

                </tbody>

                </table>


            </div>

        </Layout>

    );

}

export default Contenidos;