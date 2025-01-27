<?php
include 'conexion.php';
$marca = $_POST['marca'];
$modelo = $_POST['modelo'];
$placa = $_POST['placa'];
$capacidad_carga = $_POST['capacidad_carga'];
$ano_fabricacion = $_POST['ano_fabricacion'];
$color = $_POST['color'];
$combustible = $_POST['combustible'];
$estado = $_POST['estado'];


$consulta = "INSERT INTO vehiculo (marca, modelo, placa, capacidad_carga, ano_fabricacion, color, combustible, numero_identificacion, fecha_matriculacion, estado) 
             VALUES ('$marca', '$modelo', '$placa', '$capacidad_carga', '$ano_fabricacion', '$color', '$combustible', '$numero_identificacion', '$fecha_matriculacion', '$estado')";

if (mysqli_query($conexion, $consulta)) {
    echo "Inserción exitosa";
} else {
    echo "Error en la inserción: " . mysqli_error($conexion);
}

mysqli_close($conexion);
?>