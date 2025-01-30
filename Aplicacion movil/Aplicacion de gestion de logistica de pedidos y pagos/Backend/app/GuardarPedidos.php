<?php
include 'conexion.php';

// Datos del pedido recibidos por POST
$id_usuario = $_POST['id_usuario'];
$fecha_pedido = $_POST['fecha_pedido'];
$estado_cajas = $_POST['estado_cajas'];
$cantidad_cajas = $_POST['cantidad_cajas'];
$fecha_entrega = $_POST['fecha_entrega'];
$comentario = $_POST['comentario'];

// Inicia la transacción
mysqli_begin_transaction($conexion);

try {
    // Verificar el stock disponible
    $consulta_verificar_stock = "SELECT cantidad FROM suministro";
    $resultado = mysqli_query($conexion, $consulta_verificar_stock);
    $fila = mysqli_fetch_assoc($resultado);

    if ($fila['cantidad'] < $cantidad_cajas) {
        throw new Exception("No hay suficiente stock para completar el pedido.");
    }

    // Insertar el pedido en la tabla 'pedidos'
    $consulta_pedido = "INSERT INTO pedidos (id_usuario, fecha_pedido, estado_cajas, cantidad_cajas, fecha_entrega, comentario) 
                        VALUES ('$id_usuario', '$fecha_pedido', '$estado_cajas', '$cantidad_cajas', '$fecha_entrega', '$comentario')";
    
    if (!mysqli_query($conexion, $consulta_pedido)) {
        throw new Exception("Error en la inserción del pedido: " . mysqli_error($conexion));
    }

    // Actualizar la cantidad de suministro basado en las cajas pedidas
    $consulta_actualizar_suministro = "UPDATE suministro 
                                       SET cantidad = cantidad - $cantidad_cajas";
    
    if (!mysqli_query($conexion, $consulta_actualizar_suministro)) {
        throw new Exception("Error al actualizar el suministro: " . mysqli_error($conexion));
    }

    // Confirmar la transacción
    mysqli_commit($conexion);
    echo "Inserción y actualización exitosa";
} catch (Exception $e) {
    // Deshacer la transacción si hay algún error
    mysqli_rollback($conexion);
    echo $e->getMessage();
}

// Cerrar la conexión
mysqli_close($conexion);
?>
