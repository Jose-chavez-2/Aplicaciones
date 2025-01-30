<?php
require_once './clases/respuestas.php';
require_once './clases/ingreso.class.php';

$_respuestas = new respuestas;
$_usuarios = new ingresos;

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] == "GET") {
    if (isset($_GET["page"])) {
        $pagina = $_GET["page"];
        $cadena = $_GET["cadena"] ?? ''; // filtro opcional
        $listaIngresos = $_usuarios->listarIngreso($pagina, $cadena);

        // Validación de datos vacíos
        if (empty($listaIngresos[0])) {
            $listaIngresos[0] = [];
        }
        if (empty($listaIngresos[1])) {
            $listaIngresos[1] = [["numpag" => 1]];
        }

        header("Content-Type: application/json");
        echo json_encode($listaIngresos);
        http_response_code(200);
    } elseif (isset($_GET["id"])) {
        $idegreso = $_GET["id"];
        $datosIngreso = $_usuarios->obtenerIngreso($idegreso);

        header("Content-Type: application/json");
        echo json_encode($datosIngreso);
        http_response_code(200);
    }
} else {
    // Método no permitido
    $_respuestas->error_405();
}