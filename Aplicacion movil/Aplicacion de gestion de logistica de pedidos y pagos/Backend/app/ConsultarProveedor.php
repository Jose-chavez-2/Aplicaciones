<?php
    include 'conexion.php';

        $id_usuario = $_POST['id_usuario'];  

    $consulta = "
        SELECT 
            u.nombres,
            u.apellidos,
            p.id_pedido,
            p.fecha_pedido,
            p.cantidad_cajas,
            c.numero_cuenta
        FROM 
            usuario u
        JOIN 
            pedidos p ON u.id_usuario = p.id_usuario
        JOIN 
            cuentasbancarias c ON u.id_usuario = c.id_usuario
        WHERE u.id_usuario = '$id_usuario'
    ";

    // Ejecuta la consulta
    $resultado = mysqli_query($conexion, $consulta) or die(mysqli_error($conexion));

    // Verifica si hay resultados
    $productos = array();
    while($fila = mysqli_fetch_assoc($resultado)){
        $productos[] = array_map('utf8_encode', $fila);
    }

    // Retorna los resultados en formato JSON
    echo json_encode($productos);

    // Cierra la conexión
    mysqli_close($conexion);
?>
