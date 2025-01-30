<?php
include 'conexion.php'; 

// Consulta para obtener las cantidades
$consulta = "SELECT cantidad FROM suministro";

$resultado = mysqli_query($conexion, $consulta) or die(mysqli_error($conexion));

$productos = array();
while ($fila = mysqli_fetch_assoc($resultado)) {
    $productos[] = array_map('utf8_encode', $fila);
}

echo json_encode(array("success" => true, "data" => $productos));

mysqli_close($conexion);
?>
