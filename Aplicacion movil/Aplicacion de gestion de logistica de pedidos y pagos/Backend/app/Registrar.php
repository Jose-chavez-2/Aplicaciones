<?php
include 'conexion.php';
$cedula = $_POST['cedula'];
$nombres = $_POST['nombres'];
$apellidos = $_POST['apellidos'];
$telefono = $_POST['telefono'];
$direccion = $_POST['direccion'];
$distancia_km = $_POST['distancia_km'];
$tipo_usuario = $_POST['tipo_usuario'];
$estado = $_POST['estado'];
$clave = $_POST['clave'];

// Encripta la clave usando SHA-1
$clave = sha1($_POST['clave']);

$consulta = "INSERT INTO usuario (cedula, nombres, apellidos, telefono, direccion, distancia_km, tipo_usuario, estado, clave) 
             VALUES ('$cedula', '$nombres', '$apellidos', '$telefono', '$direccion', '$distancia_km', '$tipo_usuario', '$estado', '$clave')";

if (mysqli_query($conexion, $consulta)) {
    echo "Inserción exitosa";
} else {
    echo "Error en la inserción: " . mysqli_error($conexion);
}

mysqli_close($conexion);
?>
