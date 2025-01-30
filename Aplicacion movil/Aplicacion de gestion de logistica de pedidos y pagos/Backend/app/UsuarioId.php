<?php
include 'conexion.php';

$cedula = $_POST['cedula'];

$sentencia = $conexion->prepare("SELECT id_usuario FROM `usuario` WHERE cedula = ?");
$sentencia->bind_param('s', $cedula);
$sentencia->execute();

$resultado = $sentencia->get_result();
$response = array();  

if ($fila = $resultado->fetch_assoc()) {
    $response['success'] = true;
    $response['id_usuario'] = $fila['id_usuario'];
} else {
    $response['success'] = false;
    $response['message'] = "Cédula no encontrada"; 
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>
