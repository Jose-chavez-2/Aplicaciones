<?php

require_once "clases/conexion/conexion.php";
$con = new conexion;

$consulta = "select * from usuarios";
print_r($con->obtenerDatos($consulta));