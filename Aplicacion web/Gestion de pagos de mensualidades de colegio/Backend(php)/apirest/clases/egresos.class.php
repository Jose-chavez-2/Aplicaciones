<?php
require_once "conexion/conexion.php";
require_once "respuestas.php";

class egresos extends conexion
{
    private $idegreso;
    private $tipo = "";
    private $monto = "";
    private $fecha = "";
    private $idusuario = "";
    private $metodo = "";

    public function listarEgresos($pagina, $cadena)
    {
        $inicio = 0;
        $cantidad = 10;
        if ($pagina > 1) {
            $inicio = $cantidad * ($pagina - 1);
        }
        $query = "SELECT idegreso, tipo, monto, fecha, idusuario FROM egresos WHERE tipo LIKE '%$cadena%' OR fecha LIKE '%$cadena%' LIMIT $inicio, $cantidad";
        $datos = parent::obtenerDatos($query);

        $queryNumPag = "SELECT CEIL(COUNT(idegreso)/$cantidad) as numpag FROM egresos WHERE tipo LIKE '%$cadena%' OR fecha LIKE '%$cadena%'";
        $numero_paginas = parent::obtenerDatos($queryNumPag);

        return [$datos, $numero_paginas];
    }

    public function obtenerEgresos($id)
    {
        $query = "SELECT * FROM egresos WHERE idegreso = $id";
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
                // Insertar usuario
                if (!isset($datos["tipo"]) || !isset($datos["monto"]) || !isset($datos["fecha"]) || !isset($datos["idusuario"])) {
                    return $_respuesta->error_400();
                } else {
                    $this->tipo = $datos["tipo"];
                    $this->monto = $datos["monto"];
                    $this->fecha = $datos["fecha"];
                    $this->idusuario = $datos["idusuario"];

                    $query = "INSERT INTO egresos VALUES (NULL, '$this->tipo', '$this->monto', '$this->fecha', '$this->idusuario')";
                    $resp = parent::nonQueryId($query);

                    if ($resp) {
                        $respuesta = $_respuesta->response;
                        $respuesta["result"] = array("idegreso" => $resp);
                        return $respuesta;
                    } else {
                        return $_respuesta->error_500();
                    }
                }
            } elseif ($this->metodo == "put") {
                // Verificar que todos los campos necesarios estén definidos y no vacíos
                if (!isset($datos["idegreso"]) || !isset($datos["tipo"]) || !isset($datos["monto"]) || !isset($datos["fecha"]) || !isset($datos["idusuario"])) {
                    return $_respuesta->error_400(); // Error: Datos insuficientes
                } else {
                    // Asignar valores a las propiedades de la clase
                    $this->idegreso = $datos["idegreso"];
                    $this->tipo = $datos["tipo"];
                    $this->monto = $datos["monto"];
                    $this->fecha = $datos["fecha"];
                    $this->idusuario = $datos["idusuario"];

                    // Preparar la consulta SQL para actualizar los campos
                    $query = "UPDATE egresos 
                              SET tipo = '$this->tipo', 
                                  monto = '$this->monto', 
                                  fecha = '$this->fecha', 
                                  idusuario = '$this->idusuario'
                              WHERE idegreso = '$this->idegreso'";

                    // Ejecutar la consulta
                    $resp = parent::nonQuery($query);

                    if ($resp > 0) {
                        $respuesta = $_respuesta->response;
                        $respuesta["result"] = array(
                            "idegreso" => $this->idegreso
                        );
                        return $respuesta; // Actualización exitosa
                    } else {
                        return $_respuesta->error_500(); // Error interno del servidor
                    }
                }
            }
             elseif ($this->metodo == "delete") {
                // Eliminar usuario
                if (!isset($datos["idegreso"])) {
                    return $_respuesta->error_400();
                } else {
                    $this->idegreso = $datos["idegreso"];
                    $query = "DELETE FROM egresos WHERE idegreso = '$this->idegreso'";

                    $resp = parent::nonQuery($query);

                    if ($resp) {
                        $respuesta = $_respuesta->response;
                        $respuesta["result"] = array("idegreso" => $this->idegreso);
                        return $respuesta;
                    } else {
                        return $_respuesta->error_500();
                    }
                }
            }
        }
    }
}
