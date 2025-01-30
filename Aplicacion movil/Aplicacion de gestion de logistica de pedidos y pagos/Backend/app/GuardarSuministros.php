<?php
include 'conexion.php';
$id_usuario = $_POST['id_usuario'];
$nombre_suministro = $_POST['nombre_suministro'];
$cantidad = $_POST['cantidad'];
$fecha_suministro = $_POST['fecha_suministro'];

$consulta = "INSERT INTO suministro (id_usuario, nombre_suministro, cantidad, fecha_suministro) 
             VALUES ('$id_usuario', '$nombre_suministro', '$cantidad', '$fecha_suministro')";

if (mysqli_query($conexion, $consulta)) {
    echo "Inserción exitosa";
} else {
    echo "Error en la inserción: " . mysqli_error($conexion);
}

mysqli_close($conexion);
?>