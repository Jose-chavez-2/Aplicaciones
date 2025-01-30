<?php
include 'conexion.php';
$cedula = $_POST['cedula'];
$estado = $_POST['estado'];

$consulta = "UPDATE usuario SET estado='".$estado."' WHERE cedula='".$cedula."'";

if (mysqli_query($conexion, $consulta)) {
    echo "Actualización exitosa";
} else {
    echo "Error en la actualización: " . mysqli_error($conexion);
}

mysqli_close($conexion);
?>