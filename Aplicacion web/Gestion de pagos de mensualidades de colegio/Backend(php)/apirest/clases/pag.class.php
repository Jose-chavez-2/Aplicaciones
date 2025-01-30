<?php
require_once "conexion/conexion.php";
require_once "respuestas.php";

class pag extends conexion
{
    private $fecha = "";
    private $pagado = "";
    private $numerofactura = "";
    private $tipopago = "";
    private $idmatricula = "";
    private $idusuario = "";
    private $token = "";
    private $metodo = "";

    public function guardarPagos($json) {
        $_respuestas = new respuestas;
        $datos = json_decode($json, true);
        if (!isset($datos["fecha"]) || !isset($datos["pagado"]) || !isset($datos["numerofactura"]) || !isset($datos["tipopago"]) || !isset($datos["idmatricula"]) || !isset($datos["idusuario"])) {
            return $_respuestas->error_400();
        } else {
            $this->fecha = $datos["fecha"];
            $this->pagado = $datos["pagado"];
            $this->numerofactura = $datos["numerofactura"] ?? "";
            $this->tipopago = $datos["tipopago"] ?? "";
            $this->idmatricula = $datos["idmatricula"] ?? "";
            $this->idusuario = $datos["idusuario"];
            // Ejecutar lógica para guardar el usuario, por ejemplo:
            $query = "INSERT INTO pagos (fecha, pagado, numerofactura, tipopago, idmatricula, idusuario) VALUES ('$this->fecha', '$this->pagado', '$this->numerofactura','$this->tipopago','$this->idmatricula', '$this->idusuario')";
            $resultado = parent::nonQuery($query);
    
            if ($resultado) {
                $respuesta = $_respuestas->response;
                $respuesta["result"] = array("idpagos" => $resultado);
                return $respuesta;
            } else {
                return $_respuestas->error_500();
            }
        }
    }
    
}