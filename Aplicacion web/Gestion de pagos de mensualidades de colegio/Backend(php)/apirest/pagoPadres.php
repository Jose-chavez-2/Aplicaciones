<?php

require_once './clases/respuestas.php';
require_once './clases/pagoPadres.class.php';

$_respuestas = new respuestas;
$_usuarios = new Reporte;

// Configuración de encabezados CORS
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

// Manejo del método OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] == "OPTIONS") {
    http_response_code(204); // Sin contenido
    exit();
}

// Procesar solicitud GET
if ($_SERVER['REQUEST_METHOD'] == "GET") {
    if (isset($_GET["page"])) {
        // Obtener lista de reportes con paginación y búsqueda
        $pagina = $_GET["page"];
        $cadena = $_GET["cadena"] ?? ''; // Si no se envía "cadena", se asigna como vacío
        $cedula = $_GET["cedula"] ?? null; // Recibir el parámetro 'cedula' para filtrar por cédula

        // Validar que "page" sea un número
        if (!is_numeric($pagina)) {
            http_response_code(400);
            echo json_encode(["error" => "El parámetro 'page' debe ser un número."]);
            exit();
        }

        // Validar que la cédula esté presente si es necesaria para la consulta
        if ($cedula === null) {
            http_response_code(400);
            echo json_encode(["error" => "El parámetro 'cedula' es requerido."]);
            exit();
        }

        // Llamar al método listarReporte
        $listaReportes = $_usuarios->listarReporte($pagina, $cadena, $cedula);

        // Responder según el resultado
        header("Content-Type: application/json");
        if (!empty($listaReportes)) {
            echo json_encode($listaReportes);
            http_response_code(200);
        } else {
            echo json_encode(["message" => "No se encontraron reportes."]);
            http_response_code(404);
        }
    } elseif (isset($_GET["id"])) {
        // Obtener reporte por ID específico
        $idparalelo = $_GET["id"];

        // Validar que "id" sea un número
        if (!is_numeric($idparalelo)) {
            http_response_code(400);
            echo json_encode(["error" => "El parámetro 'id' debe ser un número."]);
            exit();
        }

        // Llamar al método obtenerReporte
        $datosParalelo = $_usuarios->obtenerReporte($idparalelo);

        // Responder según el resultado
        header("Content-Type: application/json");
        if ($datosParalelo) {
            echo json_encode($datosParalelo);
            http_response_code(200);
        } else {
            echo json_encode(["message" => "No se encontró el reporte con el ID proporcionado."]);
            http_response_code(404);
        }
    } else {
        // Parámetros no válidos
        http_response_code(400);
        echo json_encode(["error" => "Parámetros inválidos."]);
    }
} else {
    // Método no permitido
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido."]);
}
?>
