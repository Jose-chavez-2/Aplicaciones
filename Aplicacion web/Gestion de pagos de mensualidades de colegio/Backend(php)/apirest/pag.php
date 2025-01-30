<?php

require_once './clases/respuestas.php';
require_once './clases/pag.class.php';

$_respuestas = new respuestas;
$_padres = new pag;

header('Access-Control-Allow-Origin: *'); // Permitir el uso de métodos
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    // Capturar el cuerpo del POST
    $postBody = file_get_contents("php://input");
    // Enviar los datos al manejador de métodos para guardar el usuario
    $datosArray = $_padres->guardarPagos($postBody);
    header("Content-Type: application/json");

    // Verificar si hubo un error y enviar el código de respuesta adecuado
    if (isset($datosArray["result"]["error_id"])) {
        $responseCode = $datosArray["result"]["error_id"];
        http_response_code($responseCode);
    } else {
        http_response_code(200); // 200 OK si la inserción fue exitosa
    }

    // Respuesta en JSON
    echo json_encode($datosArray);
} else {
    // Si no es POST, devolver un método no permitido
    header("Content-Type: application/json");
    $datosArray = $_respuestas->error_405();
    echo json_encode($datosArray);
}