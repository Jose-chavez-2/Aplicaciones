<?php

require_once './clases/respuestas.php';
require_once './clases/matricula.class.php';

$_respuestas = new respuestas;
$_usuarios = new matricula;

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] == "GET") {
    // Obtener lista de usuarios con paginación y búsqueda
    if (isset($_GET["page"])) {
        $pagina = $_GET["page"];
        $idparalelo = $_GET["idparalelo"];
        $cadena = $_GET["cadena"] ?? ''; // filtro opcional
        $listaMatricula = $_usuarios->listarMatricula($pagina, $cadena,$idparalelo);
        
        header("Content-Type: application/json");
        echo json_encode($listaMatricula);
        http_response_code(200);
    } elseif (isset($_GET["id"])) {
        // Obtener datos de un usuario específico
        $idmatricula = $_GET["id"];
        $datosMatricula = $_usuarios->obtenerMatricula($idmatricula);
        
        header("Content-Type: application/json");
        echo json_encode($datosMatricula);
        http_response_code(200);
    }
} elseif ($_SERVER['REQUEST_METHOD'] == "POST") {
    // Crear o gestionar métodos de usuarios (POST, PUT, DELETE)
    $postBody = file_get_contents("php://input");
    $datosArray = $_usuarios->metodos($postBody);
    
    header("Content-Type: application/json");
    if (isset($datosArray["result"]["error_id"])) {
        $responseCode = $datosArray["result"]["error_id"];
        http_response_code($responseCode);
    } else {
        http_response_code(200);
    }
    echo json_encode($datosArray);
} else {
    // Método no permitido
    $_respuestas->error_405();
}
