<?php
include 'conexion.php';

$cedula = $_POST['cedula'];
$clave = $_POST['clave'];

$claveEncriptada = sha1($clave);

$sentencia = $conexion->prepare("SELECT * FROM `usuario` WHERE cedula = ? AND clave = ?");
$sentencia->bind_param('ss', $cedula, $claveEncriptada);
$sentencia->execute();

$resultado = $sentencia->get_result();
$response = array();  

if ($fila = $resultado->fetch_assoc()) {
    // Verifica si el usuario está activo
    if ($fila['estado'] === 'activo') {
        $response['success'] = true;
        $response['user'] = $fila;  
        $response['tipo_usuario'] = $fila['tipo_usuario']; 
    } else {
        $response['success'] = false;
        $response['message'] = "Usuario inactivo"; 
    }
} else {
    $response['success'] = false;
    $response['message'] = "Usuario o contraseña incorrectos"; 
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>



