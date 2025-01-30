<?php
require_once "conexion/conexion.php";
require_once "respuestas.php";

class pagos extends conexion
{
    private $idpagos;
    private $fecha = "";
    private $pagado = "";
    private $numerofactura = "";
    private $tipopago = "";
    private $idmatricula = "";
    private $idusuario = "";
    private $metodo = "";

    public function listarPagos($pagina, $cadena, $idmatricula)
    {
        $inicio = 0;
        $cantidad = 10;
        if ($pagina > 1) {
            $inicio = $cantidad * ($pagina - 1);
        }
        $query = "SELECT idpagos, fecha, pagado, numerofactura, tipopago, idmatricula, idusuario, estado FROM pagos WHERE idmatricula = $idmatricula and (numerofactura LIKE '%$cadena%' OR tipopago LIKE '%$cadena%' OR estado LIKE '%$cadena%') LIMIT $inicio, $cantidad";
        $datos = parent::obtenerDatos($query);
        
        $queryNumPag = "SELECT CEIL(COUNT(idpagos)/$cantidad) as numpag FROM pagos WHERE idmatricula = $idmatricula and (numerofactura LIKE '%$cadena%' OR tipopago LIKE '%$cadena%' OR estado LIKE '%$cadena%')";
        $numero_paginas = parent::obtenerDatos($queryNumPag);
        
        return [$datos, $numero_paginas];
    }

    public function obtenerPagos($id)
    {
        $query = "SELECT * FROM pagos WHERE idpagos = $id";
        $datos = parent::obtenerDatos($query);
        return ($datos);
    }

    public function metodos($datos_json)
{
    $_respuesta = new respuestas;
    $datos = json_decode($datos_json, true);

    if (!isset($datos['metodo'])) {
        return $_respuesta->error_401();
    } else {
        $this->metodo = $datos["metodo"];

        if ($this->metodo == "post") {
            // Insertar registro en la tabla pagos
            if (!isset($datos["fecha"]) || !isset($datos["pagado"]) || !isset($datos["numerofactura"]) || !isset($datos["tipopago"]) || !isset($datos["idmatricula"]) || !isset($datos["idusuario"])) {
                return $_respuesta->error_400();
            } else {
                $this->fecha = $datos["fecha"];
                $this->pagado = $datos["pagado"];
                $this->numerofactura = $datos["numerofactura"];
                $this->tipopago = $datos["tipopago"];
                $this->idmatricula = $datos["idmatricula"];
                $this->idusuario = $datos["idusuario"];

                $query = "INSERT INTO pagos (fecha, pagado, numerofactura, tipopago, idmatricula, idusuario) 
                          VALUES ('$this->fecha', '$this->pagado', '$this->numerofactura', '$this->tipopago', '$this->idmatricula', '$this->idusuario')";

                $resp = parent::nonQueryId($query);

                if ($resp) {
                    $respuesta = $_respuesta->response;
                    $respuesta["result"] = array("idpagos" => $resp);
                    return $respuesta;
                } else {
                    return $_respuesta->error_500();
                }
            }
        }elseif ($this->metodo == "put") {
            // Actualizar registro en la tabla pagos
            if (!isset($datos["idpagos"]) || !isset($datos["fecha"]) || !isset($datos["pagado"]) || !isset($datos["numerofactura"])) {
                return $_respuesta->error_400();
            } else {
                $this->idpagos = $datos["idpagos"];
                $this->fecha = $datos["fecha"];
                $this->pagado = $datos["pagado"];
                $this->numerofactura = $datos["numerofactura"] ?? "";
                $this->tipopago = $datos["tipopago"] ?? "";
                $this->idmatricula = $datos["idmatricula"] ?? "";
                $this->idusuario = $datos["idusuario"];

                $query = "UPDATE pagos SET 
                fecha = '$this->fecha', 
                pagado = '$this->pagado', 
                numerofactura = '$this->numerofactura', 
                tipopago = '$this->tipopago' 
              WHERE idpagos = '$this->idpagos'";
   

                $resp = parent::nonQuery($query);

                if ($resp > 0) {
                    $respuesta = $_respuesta->response;
                    $respuesta["result"] = array("idpagos" => $this->idpagos);
                    return $respuesta;
                } else {
                    return $_respuesta->error_500();
                }
            }
        } elseif ($this->metodo == "delete") {
            // Eliminar registro de la tabla pagos
            if (!isset($datos["idpagos"])) {
                return $_respuesta->error_400();
            } else {
                $this->idpagos = $datos["idpagos"];

                $query = "DELETE FROM pagos WHERE idpagos = '$this->idpagos'";
                $resp = parent::nonQuery($query);

                if ($resp) {
                    $respuesta = $_respuesta->response;
                    $respuesta["result"] = array("pagos" => $this->idpagos);
                    return $respuesta;
                } else {
                    return $_respuesta->error_500();
                }
            }
        }
    }
}

}