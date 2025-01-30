<?php
require_once "conexion/conexion.php";
require_once "respuestas.php";

class lectivo extends conexion
{
    private $idlectivo;
    private $nombre = "";
    private $estado = "";
    private $inicia = "";
    private $acaba = "";
    private $metodo = "";

    public function listarLectivo($pagina, $cadena)
    {
        $inicio = 0;
        $cantidad = 10;
        if ($pagina > 1) {
            $inicio = $cantidad * ($pagina - 1);
        }
        $query = "SELECT idlectivo, nombre, estado, inicia, acaba FROM lectivo WHERE nombre LIKE '%$cadena%' OR inicia LIKE '%$cadena%' LIMIT $inicio, $cantidad";
        $datos = parent::obtenerDatos($query);

        $queryNumPag = "SELECT CEIL(COUNT(idlectivo)/$cantidad) as numpag FROM lectivo WHERE nombre LIKE '%$cadena%' OR inicia LIKE '%$cadena%'";
        $numero_paginas = parent::obtenerDatos($queryNumPag);

        return [$datos, $numero_paginas];
    }

    public function obtenerLectivo($id)
    {
        $query = "SELECT * FROM lectivo WHERE idlectivo = $id";
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
                if (!isset($datos["nombre"]) || !isset($datos["estado"]) || !isset($datos["inicia"]) || !isset($datos["acaba"])) {
                    return $_respuesta->error_400();
                } else {
                    $this->nombre = $datos["nombre"];
                    $this->estado = $datos["estado"];
                    $this->inicia = $datos["inicia"];
                    $this->acaba = $datos["acaba"];


                    $query = "INSERT INTO lectivo VALUES (NULL, '$this->nombre', '$this->estado', '$this->inicia', '$this->acaba')";
                    $resp = parent::nonQueryId($query);

                    if ($resp) {
                        $respuesta = $_respuesta->response;
                        $respuesta["result"] = array("idlectivo" => $resp);
                        return $respuesta;
                    } else {
                        return $_respuesta->error_500();
                    }
                }
            } elseif ($this->metodo == "put") {
                // Verificar que todos los campos necesarios estén definidos y no vacíos
                if (!isset($datos["idlectivo"]) || !isset($datos["nombre"]) || !isset($datos["estado"]) || !isset($datos["inicia"]) || !isset($datos["acaba"])) {
                    return $_respuesta->error_400(); // Error: Datos insuficientes
                } else {
                    // Asignar valores a las propiedades de la clase
                    $this->idlectivo = $datos["idlectivo"]; // Corregir variable desde idegreso a idlectivo
                    $this->nombre = $datos["nombre"];
                    $this->estado = $datos["estado"];
                    $this->inicia = $datos["inicia"];
                    $this->acaba = $datos["acaba"];

                    // Preparar la consulta SQL para actualizar los campos
                    $query = "UPDATE lectivo SET 
                                nombre = '$this->nombre', 
                                estado = '$this->estado', 
                                inicia = '$this->inicia', 
                                acaba = '$this->acaba'
                              WHERE idlectivo = '$this->idlectivo'";

                    // Ejecutar la consulta
                    $resp = parent::nonQuery($query);

                    if ($resp > 0) {
                        $respuesta = $_respuesta->response;
                        $respuesta["result"] = array(
                            "idlectivo" => $this->idlectivo
                        );
                        return $respuesta; // Actualización exitosa
                    } else {
                        return $_respuesta->error_500(); // Error interno del servidor
                    }
                }
            } elseif ($this->metodo == "delete") {
                // Eliminar usuario
                if (!isset($datos["idlectivo"])) {
                    return $_respuesta->error_400();
                } else {
                    $this->idlectivo = $datos["idlectivo"];
                    $query = "DELETE FROM lectivo WHERE idlectivo = '$this->idlectivo'";

                    $resp = parent::nonQuery($query);

                    if ($resp) {
                        $respuesta = $_respuesta->response;
                        $respuesta["result"] = array("idlectivo" => $this->idlectivo);
                        return $respuesta;
                    } else {
                        return $_respuesta->error_500();
                    }
                }
            }
        }
    }
}