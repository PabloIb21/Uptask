eventListeners();
// lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners(){

    // Document Ready
    document.addEventListener('DOMContentLoaded', function(){
        actualizarProgreso();
    });

    // boton para crear proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    // boton para crear tarea
    if(document.querySelector('.nueva-tarea')){
        document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);
    }
    
    // botones para las acciones de las tareas
    if(document.querySelector('.listado-pendientes')){
        document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);
    }
    
}

function nuevoProyecto(e){
    e.preventDefault();
    console.log('presionaste en nuevo proyecto');

    // crea un input para el nuevo proyecto
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
    listaProyectos.appendChild(nuevoProyecto);

    // seleccionar el id con el nuevo proyecto
    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

    // al presionar enter crear el proyecto
    inputNuevoProyecto.addEventListener('keypress', function(e){
        var tecla = e.which || e.keyCode;
        if(tecla === 13){
            guardarProyectoDB(inputNuevoProyecto.value);
            listaProyectos.removeChild(nuevoProyecto);
        }
    });

}

function guardarProyectoDB(nombreProyecto){
    // crear llamado ajax
    var xhr = new XMLHttpRequest();

    // enviar datos por formdata
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear');
    
    // abrir la conexion
    xhr.open('POST','includes/modelos/modelo-proyecto.php',true);

    // en la carga
    xhr.onload = function(){
        if(this.status === 200){
            //obtener datos de la respuesta
            var respuesta = JSON.parse(xhr.responseText);
            var proyecto = respuesta.nombre_proyecto,
                id_proyecto = respuesta.id_insertado,
                tipo = respuesta.tipo,
                resultado = respuesta.respuesta;

                // Comprobar la inserción
                if(resultado === 'correcto'){
                    // fue exitoso
                    if(tipo === 'crear'){
                        // se creo un nuevo proyecto
                        // inyectar en el HTML
                        var nuevoProyecto = document.createElement('li');
                        nuevoProyecto.innerHTML = `
                            <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">${proyecto}</a>
                        `;
                        // agregar el html
                        listaProyectos.appendChild(nuevoProyecto);

                        //enviar alerta
                        Swal.fire({
                            icon: 'success',
                            title: 'Proyecto creado',
                            text: 'El proyecto: '+ proyecto + ' se creó correctamente'
                        })
                        .then(resultado => {
                            if(resultado.value){
                                window.location.href = 'index.php?id_proyecto='+id_proyecto;
                            }
                        })

                        
                    }else{
                        // se actualizo o elimino
                    }
                }else{
                    // hubo un error
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error'
                    });
                }
        }
    }

    // enviar la petición
    xhr.send(datos);

}

// agregar una nueva tarea al proyecto actual
function agregarTarea(e){
    e.preventDefault();
    
    var nombreTarea = document.querySelector('.nombre-tarea').value;

    // validar que el campo tenga algo escrito
    if(nombreTarea === ''){
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Una tarea no puede ir vacia'
        });
    }else{
        // la tarea tiene algo, insertar en PHP
        var xhr = new XMLHttpRequest();

        var datos = new FormData();
        datos.append('tarea', nombreTarea);
        datos.append('accion','crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value);

        xhr.open('POST','includes/modelos/modelo-tareas.php',true);

        xhr.onload = function(){
            if(this.status === 200){
                // todo correcto
                var respuesta = JSON.parse(xhr.responseText);
                //asignar valores
                var resultado = respuesta.respuesta,
                tarea = respuesta.tarea,
                id_insertado = respuesta.id_insertado,
                tipo = respuesta.tipo;

                if(resultado === 'correcto'){
                    // se agrego correctamente
                    if(tipo === 'crear'){
                        // insertar alerta
                        Swal.fire({
                            icon: 'success',
                            title: 'Tarea creada',
                            text: 'La tarea: '+tarea+' se creó correctamente'
                        });

                        // seleccionar el parrafo con la lista vacia
                        var parrafoListaVacia = document.querySelectorAll('.lista-vacia');
                        
                        if(parrafoListaVacia.length > 0){
                            document.querySelector('.lista-vacia').remove();
                        }

                        // construir el template
                        var nuevaTarea = document.createElement('li');

                        // agregamos el id
                        nuevaTarea.id = 'tarea'+id_insertado;

                        // agregar la clase tarea
                        nuevaTarea.classList.add('tarea');

                        // construir  el html
                        nuevaTarea.innerHTML = `
                            <p>${tarea}</p>
                            <div class="acciones">
                                <i class="far fa-check-circle"></i>
                                <i class="fas fa-trash"></i>
                            </div>
                        `;

                        // agregarlo al HTML
                        var listado = document.querySelector('.listado-pendientes ul');
                        listado.appendChild(nuevaTarea);

                        // Limpiar el formulario
                        document.querySelector('.agregar-tarea').reset();

                        // Actualizar el progreso
                        actualizarProgreso();

                    }
                }else{
                    //error
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error'
                    });
                }
            }
        }

        xhr.send(datos);
    }

}

// Cambia el estado de las tareas o elimina
function accionesTareas(e){
    e.preventDefault();

    if(e.target.classList.contains('fa-check-circle')){
        if(e.target.classList.contains('completo')){
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target, 0);
        }else{
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);
        }
    }

    if(e.target.classList.contains('fa-trash')){
        Swal.fire({
            title: 'Seguro(a)?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.value) {
                var tareaEliminar = e.target.parentElement.parentElement;
                // borrar de la BD
                eliminarTareaBD(tareaEliminar);
                // borrar del html
                tareaEliminar.remove();

              Swal.fire(
                'Eliminada',
                'La tarea fue eliminada.',
                'success'
              )
            }
          })
    }
}

// completa o descompleta una tarea
function cambiarEstadoTarea(tarea, estado){
    var idTarea= tarea.parentElement.parentElement.id.split(':');
    
    // crear llamado a ajax
    var xhr = new XMLHttpRequest();

    // información
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion','actualizar');
    datos.append('estado', estado);

    // open la conexion
    xhr.open('POST','includes/modelos/modelo-tareas.php',true);

    // on load
    xhr.onload = function (){
        if(this.status === 200){
            console.log(JSON.parse(xhr.responseText));

            // Actualizar el progreso
            actualizarProgreso();
        }
    }

    //enviar la peticion
    xhr.send(datos);
}

// elimina las tareas de la base de datos
function eliminarTareaBD(tarea){
    var idTarea= tarea.id.split(':');
    
    // crear llamado a ajax
    var xhr = new XMLHttpRequest();

    // información
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion','eliminar');

    // open la conexion
    xhr.open('POST','includes/modelos/modelo-tareas.php',true);

    // on load
    xhr.onload = function (){
        if(this.status === 200){
            console.log(JSON.parse(xhr.responseText));

            // comprobar que haya tareas restantes
            var listaTareasRestantes = document.querySelectorAll('li.tarea');
            if(listaTareasRestantes.length == 0){
                document.querySelector('.listado-pendientes ul').innerHTML = "<p class='lista-vacia'>No hay tareas en este proyecto</p>";
            }

            // Actualizar el progreso
            actualizarProgreso();
        }

    }

    //enviar la peticion
    xhr.send(datos);
}

// Actualiza el avance del proyecto
function actualizarProgreso(){
    // obtener todas las tareas
    const tareas = document.querySelectorAll('li.tarea');

    // obtener las tareas completadas
    const tareasCompletadas = document.querySelectorAll('i.completo');

    // determinar el avance
    const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);
    
    // asignar el avance a la barra
    const porcentaje = document.querySelector('#porcentaje');
    porcentaje.style.width = avance+'%';

    // mostrar una alerta al completar el 100%
    if(avance === 100){
        Swal.fire({
            icon: 'success',
            title: 'Proyecto terminado',
            text: 'Ya no tienes tareas pendientes'
        });
    }
}
