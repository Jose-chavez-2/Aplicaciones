<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "appmovil";


$conexion = mysqli_connect($servername, $username, $password, $database);

if (!$conexion) {
  die("Connection fallida: " . mysqli_connect_error());
}
//echo "Conectado Correctamente";
?>
