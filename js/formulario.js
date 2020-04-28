
eventListeners();

function eventListeners(){
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}

function validarRegistro(e){
    e.preventDefault();

    var usuario = document.querySelector('#usuario').value,
    password = document.querySelector('#password').value,
    tipo = document.querySelector('#tipo').value;

    if(usuario === '' || password === ''){
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ambos campos son obligatorios!',
          });
    }else{
        // Ambos campos son correctos, mandar ejecutar Ajax

        // datos que se envian al servidor
        var datos = new FormData();
        datos.append('usuario', usuario);
        datos.append('password', password);
        datos.append('accion', tipo);

        // crear llamado a ajax

        var xhr = new XMLHttpRequest();

        // abrir la conexion
        xhr.open('POST','includes/modelos/modelo-admin.php',true);

        // retorno de datos
        xhr.onload = function(){
            if(this.status === 200){
                var respuesta = JSON.parse(xhr.responseText);

                console.log(respuesta);
                // Si la respuesta es correcta
                if(respuesta.respuesta === 'correcto'){
                    // Si es un nuevo usuario
                    if(respuesta.tipo === 'crear'){
                        Swal.fire({
                            icon: 'success',
                            title: 'Usuario creado',
                            text: 'El usuario se creó correctamente'
                        });
                    }else if(respuesta.tipo === 'login'){
                        Swal.fire({
                            icon: 'success',
                            title: 'Login correcto',
                            text: 'Presiona OK para abrir el dashboard'
                        })
                        .then(resultado => {
                            if(resultado.value){
                                window.location.href = 'index.php';
                            }
                        })
                    } 
                }else {
                    // Hubo un error
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error'
                    });
                }
            }
        }

        // Enviar la petición
        xhr.send(datos);
    }
}