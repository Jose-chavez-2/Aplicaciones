<?php
    include 'conexion.php';
    $consulta = "
            SELECT 
            CONCAT(u.nombres, ' ', u.apellidos) AS nombres,
            u.id_usuario,
            p.fecha_entrega,
            p.cantidad_cajas
        FROM 
            usuario u
        JOIN 
            pedidos p ON u.id_usuario = p.id_usuario
        ";

    $resultado = mysqli_query($conexion, $consulta) or die(mysqli_error());

    while($fila=mysqli_fetch_array($resultado)){
        $productos[]=array_map('utf8_encode',$fila);
    }
    echo json_encode($productos);
    mysqli_close($conexion);
?>