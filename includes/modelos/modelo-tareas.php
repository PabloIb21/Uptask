<?php

error_reporting(E_ALL ^ E_NOTICE);

$accion = $_POST['accion'];
$id_proyecto = (int) $_POST['id_proyecto'];
$tarea = $_POST['tarea'];
$estado = $_POST['estado'];
$id_tarea = (int) $_POST['id'];

if(isset($accion)){
    if($accion === 'crear'){
        
        // importar la conexion
        include '../funciones/conexion.php';

        try{
            // Realizar la consulta a la base de datos
            $stmt = $conn->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES (?,?) ");
            $stmt->bind_param('si', $tarea, $id_proyecto);
            $stmt->execute();
            if($stmt->affected_rows == 1){
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'id_insertado' => $stmt->insert_id,
                    'tipo' => $accion,
                    'tarea' => $tarea
                );
            }else{
                $respuesta = array(
                    'respuesta'=> 'error'
                );
            }
            $stmt->close();
            $conn->close();

        }catch(Exception $e){
            // En caso de un error, tomar la exception
            $respuesta = array(
                'error' => $e->getMessage()
            );
    
        }

        echo json_encode($respuesta);
        
    }
}

if(isset($accion)){
    if($accion === 'actualizar'){

        // importar la conexion
        include '../funciones/conexion.php';

        try{
            // Realizar la consulta a la base de datos
            $stmt = $conn->prepare("UPDATE tareas set estado = ? WHERE id = ? ");
            $stmt->bind_param('ii', $estado, $id_tarea);
            $stmt->execute();
            if($stmt->affected_rows > 0){
                $respuesta = array(
                    'respuesta' => 'correcto'
                );
            }else{
                $respuesta = array(
                    'respuesta'=> 'error'
                );
            }
            $stmt->close();
            $conn->close();

        }catch(Exception $e){
            // En caso de un error, tomar la exception
            $respuesta = array(
                'error' => $e->getMessage()
            );
    
        }
        echo json_encode($respuesta);
    }
}

if(isset($accion)){
    if($accion === 'eliminar'){

        // importar la conexion
        include '../funciones/conexion.php';

        try{
            // Realizar la consulta a la base de datos
            $stmt = $conn->prepare("DELETE FROM tareas WHERE id = ? ");
            $stmt->bind_param('i', $id_tarea);
            $stmt->execute();
            if($stmt->affected_rows > 0){
                $respuesta = array(
                    'respuesta' => 'correcto'
                );
            }else{
                $respuesta = array(
                    'respuesta'=> 'error'
                );
            }
            $stmt->close();
            $conn->close();

        }catch(Exception $e){
            // En caso de un error, tomar la exception
            $respuesta = array(
                'error' => $e->getMessage()
            );
    
        } 
        echo json_encode($respuesta);
    }
}

?>