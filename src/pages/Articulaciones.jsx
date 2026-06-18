import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import Layout from "../components/Layout";
import api from "../services/api";

function Articulaciones(){

const [articulaciones,setArticulaciones] = useState([]);

const [contenidos,setContenidos] = useState([]);

const [saberes,setSaberes] = useState([]);

const [contenidoId,setContenidoId] = useState('');

const [saberId,setSaberId] = useState('');

const [observacion,setObservacion] = useState('');

const [nivel,setNivel] = useState('Medio');

const [evidencia,setEvidencia] = useState('');

const [propuestaProyecto,setPropuestaProyecto] = useState('');

const [generandoIA,setGenerandoIA] = useState(false);

const [editando,setEditando] = useState(false);

const [idEditar,setIdEditar] = useState(null);

useEffect(()=>{

    cargarArticulaciones();

    cargarContenidos();

    cargarSaberes();

},[]);

const cargarArticulaciones = async ()=>{

    try{

        const res =
        await api.get('/articulaciones');

        setArticulaciones(
            res.data
        );

    }catch(error){

        console.log(error);

    }

};

const cargarContenidos = async ()=>{

    try{

        const res =
        await api.get('/contenidos');

        setContenidos(
            res.data
        );

    }catch(error){

        console.log(error);

    }

};

const cargarSaberes = async ()=>{

    try{

        const res =
        await api.get('/saberes');

        setSaberes(
            res.data
        );

    }catch(error){

        console.log(error);

    }

};

const generarArticulacionIA = async ()=>{

    try{

        if(
            !contenidoId ||
            !saberId
        ){

            Swal.fire(
                'Atención',
                'Seleccione contenido y saber',
                'warning'
            );

            return;

        }

        setGenerandoIA(true);

        const contenido =
        contenidos.find(
            item=>item.id == contenidoId
        );

        const saber =
        saberes.find(
            item=>item.id == saberId
        );

        const res =
        await api.post(
            '/ia/articulacion',
            {
                contenido:
                contenido.nombre,

                saber:
                saber.titulo
            }
        );

        setNivel(
            res.data.nivel
        );

        setObservacion(
            res.data.observacion
        );

        setEvidencia(
            res.data.evidencia
        );

        setPropuestaProyecto(
            res.data.propuesta_proyecto
        );

    }catch(error){

        console.log(error);

        Swal.fire(
            'Error',
            'No se pudo generar',
            'error'
        );

    }finally{

        setGenerandoIA(false);

    }

};

const guardarArticulacion = async ()=>{

    try{

        const datos = {

            contenido_id:
            contenidoId,

            saber_id:
            saberId,

            observacion,

            nivel,

            evidencia,

            propuesta_proyecto:
            propuestaProyecto,

            creado_por:1

        };

        if(editando){

            await api.put(
                `/articulaciones/${idEditar}`,
                datos
            );

        }else{

            await api.post(
                '/articulaciones',
                datos
            );

        }

        Swal.fire(
            'Éxito',
            'Guardado correctamente',
            'success'
        );

        limpiarFormulario();

        cargarArticulaciones();

    }catch(error){

        console.log(error);

    }

};

const editarArticulacion = (item)=>{

    setContenidoId(
        item.contenido_id
    );

    setSaberId(
        item.saber_id
    );

    setObservacion(
        item.observacion
    );

    setNivel(
        item.nivel
    );

    setEvidencia(
        item.evidencia
    );

    setPropuestaProyecto(
        item.propuesta_proyecto
    );

    setIdEditar(
        item.id
    );

    setEditando(true);

};

const eliminarArticulacion = async(id)=>{

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
        `/articulaciones/${id}`
    );

    cargarArticulaciones();

};

const limpiarFormulario = ()=>{

    setContenidoId('');

    setSaberId('');

    setObservacion('');

    setNivel('Medio');

    setEvidencia('');

    setPropuestaProyecto('');

    setEditando(false);

    setIdEditar(null);

};


return(

<Layout>

<div className="container-fluid">

<h2 className="mb-4">

Articulaciones Curriculares

</h2>

<div className="card mb-4">

<div className="card-body">

<select
className="form-select mb-3"
value={contenidoId}
onChange={(e)=>
setContenidoId(
e.target.value
)
}
>

<option value="">
Seleccione contenido
</option>

{
contenidos.map(item=>(

<option
key={item.id}
value={item.id}
>

{item.nombre}

</option>

))
}

</select>

<select
className="form-select mb-3"
value={saberId}
onChange={(e)=>
setSaberId(
e.target.value
)
}
>

<option value="">
Seleccione saber
</option>

{
saberes.map(item=>(

<option
key={item.id}
value={item.id}
>

{item.titulo}

</option>

))
}

</select>

<button
className="btn btn-success mb-3"
onClick={generarArticulacionIA}
disabled={generandoIA}
>

{
generandoIA
? '⏳ Generando articulación...'
: '🤖 Generar con IA'
}

</button>

<select
className="form-select mb-3"
value={nivel}
onChange={(e)=>
setNivel(
e.target.value
)
}
>

<option value="Alto">
Alto
</option>

<option value="Medio">
Medio
</option>

<option value="Bajo">
Bajo
</option>

</select>

<textarea
className="form-control mb-3"
rows="5"
placeholder="Observación"
value={observacion}
onChange={(e)=>
setObservacion(
e.target.value
)
}
/>

<textarea
className="form-control mb-3"
rows="4"
placeholder="Evidencia"
value={evidencia}
onChange={(e)=>
setEvidencia(
e.target.value
)
}
/>

<textarea
className="form-control mb-3"
rows="4"
placeholder="Propuesta de Proyecto"
value={propuestaProyecto}
onChange={(e)=>
setPropuestaProyecto(
e.target.value
)
}
/>

<button
className="btn btn-primary me-2"
onClick={guardarArticulacion}
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

<table className="table table-bordered">

<thead>

<tr>

<th>ID</th>

<th>Contenido</th>

<th>Saber</th>

<th>Nivel</th>

<th>Acciones</th>

</tr>

</thead>

<tbody>

{
articulaciones.map(item=>(

<tr key={item.id}>

<td>
{item.id}
</td>

<td>
{item.contenidos?.nombre}
</td>

<td>
{item.saberes?.titulo}
</td>

<td>
{item.nivel}
</td>

<td>

<button
className="btn btn-warning btn-sm me-2"
onClick={()=>
editarArticulacion(item)
}
>

Editar

</button>

<button
className="btn btn-danger btn-sm"
onClick={()=>
eliminarArticulacion(item.id)
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

</Layout>

);

}

export default Articulaciones;