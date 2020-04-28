<?php 

    $conn = new mysqli('localhost', 'root', '', 'uptask', 3308);

    
    if($conn->connect_error){
        echo $conn->connect_error;
    }

    $conn->set_charset('utf8');
    
?>
    