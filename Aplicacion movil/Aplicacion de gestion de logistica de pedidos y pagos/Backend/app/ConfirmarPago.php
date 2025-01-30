<?php
    include 'conexion.php';

    $id_usuario = $_POST['id_usuario'];  

    $consulta = "
        SELECT 
            pagos.pedido_id, 
            pagos.fecha_pago, 
            pagos.evidencia_pago
        FROM pagos
        JOIN pedidos ON pagos.pedido_id = pedidos.id_pedido
        JOIN usuario ON pedidos.id_usuario = usuario.id_usuario
        WHERE usuario.id_usuario = '$id_usuario'
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
