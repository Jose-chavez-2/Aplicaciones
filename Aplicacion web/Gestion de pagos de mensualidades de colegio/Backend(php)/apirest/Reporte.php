<?php

require_once './clases/respuestas.php';
require_once './clases/Reporte.class.php';

$_respuestas = new respuestas;
$_usuarios = new Reporte;

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] == "GET") {
    // Obtener lista de usuarios con paginación y búsqueda
    if (isset($_GET["page"])) {
        $pagina = $_GET["page"];
        $cadena = $_GET["cadena"] ?? ''; 
        $listaReportes = $_usuarios->listarReporte($pagina, $cadena);
        
        header("Content-Type: application/json");
        echo json_encode($listaReportes);
        http_response_code(200);
    } elseif (isset($_GET["id"])) {
        // Obtener datos de un usuario específico
        $idparalelo = $_GET["id"];
        $datosParalelo = $_usuarios->obtenerReporte($idparalelo);
        
        header("Content-Type: application/json");
        echo json_encode($datosParalelo);
        http_response_code(200);
    }
}