<?php
include 'conexion.php';
$id_pedido = $_POST['id_pedido'];
$estado_cajas = $_POST['estado_cajas'];
$fecha_entrega = $_POST['fecha_entrega'];
$comentario = $_POST['comentario'];

$consulta = "UPDATE pedidos SET estado_cajas='".$estado_cajas."', fecha_entrega='".$fecha_entrega."', comentario='".$comentario."' WHERE id_pedido='".$id_pedido."'";

if (mysqli_query($conexion, $consulta)) {
    echo "Actualización exitosa";
} else {
    echo "Error en la actualización: " . mysqli_error($conexion);
}

mysqli_close($conexion);
?>