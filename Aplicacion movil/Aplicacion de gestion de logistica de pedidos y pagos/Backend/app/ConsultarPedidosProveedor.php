<?php
    include 'conexion.php';
    $consulta = "select * from pedidos";

    $resultado = mysqli_query($conexion, $consulta) or die(mysqli_error());

    while($fila=mysqli_fetch_array($resultado)){
        $productos[]=array_map('utf8_encode',$fila);
    }
    echo json_encode($productos);
    mysqli_close($conexion);
?>