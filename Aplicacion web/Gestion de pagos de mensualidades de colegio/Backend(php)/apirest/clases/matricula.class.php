<?php
require_once "conexion/conexion.php";
require_once "respuestas.php";

class matricula extends conexion
{
    private $idmatricula;
    private $codigo = "";
    private $fechamatricula = "";
    private $costo = "";
    private $pension = "";
    private $pago = "";
    private $idestudiantes = "";
    private $idparalelo = "";
    private $metodo = "";

    public function listarMatricula($pagina, $cadena, $idparalelo)
    {
        $inicio = 0;
        $cantidad = 10;
        if ($pagina > 1) {
            $inicio = $cantidad * ($pagina - 1);
        }
        $query = "SELECT idmatricula, codigo, fechamatricula, costo, pension, pago, idestudiantes, idparalelo FROM matricula WHERE idparalelo = $idparalelo and (codigo LIKE '%$cadena%' OR fechamatricula LIKE '%$cadena%') LIMIT $inicio, $cantidad";
        $datos = parent::obtenerDatos($query);

        $queryNumPag = "SELECT CEIL(COUNT(idmatricula)/$cantidad) as numpag FROM matricula WHERE idparalelo = $idparalelo and (codigo LIKE '%$cadena%' OR fechamatricula LIKE '%$cadena%')";
        $numero_paginas = parent::obtenerDatos($queryNumPag);

        return [$datos, $numero_paginas];
    }

    public function obtenerMatricula($id)
    {
        $query = "SELECT * FROM matricula WHERE idmatricula = $id";
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
                if (!isset($datos["codigo"]) || !isset($datos["fechamatricula"]) || !isset($datos["costo"]) || !isset($datos["pension"]) || !isset($datos["pago"]) || !isset($datos["idestudiantes"]) || !isset($datos["idparalelo"])) {
                    return $_respuesta->error_400();
                } else {
                    $this->codigo = $datos["codigo"];
                    $this->fechamatricula = $datos["fechamatricula"];
                    $this->costo = $datos["costo"];
                    $this->pension = $datos["pension"];
                    $this->pago = $datos["pago"];
                    $this->idestudiantes = $datos["idestudiantes"];
                    $this->idparalelo = $datos["idparalelo"];

                    $query = "INSERT INTO matricula VALUES (NULL, '$this->codigo', '$this->fechamatricula', '$this->costo', '$this->pension', '$this->pago', '$this->idestudiantes', '$this->idparalelo')";
                    $resp = parent::nonQueryId($query);

                    if ($resp) {
                        $respuesta = $_respuesta->response;
                        $respuesta["result"] = array("idmatricula" => $resp);
                        return $respuesta;
                    } else {
                        return $_respuesta->error_500();
                    }
                }
            } elseif ($this->metodo == "put") {
                // Verificar que todos los campos necesarios estén definidos y no vacíos
                if (!isset($datos["idmatricula"]) || !isset($datos["codigo"]) || !isset($datos["fechamatricula"]) || !isset($datos["costo"]) || !isset($datos["pension"]) || !isset($datos["pago"]) || !isset($datos["idestudiantes"]) || !isset($datos["idparalelo"])) {
                    return $_respuesta->error_400(); // Error: Datos insuficientes
                } else {
                    // Asignar valores a las propiedades de la clase
                    $this->codigo = $datos["codigo"];
                    $this->fechamatricula = $datos["fechamatricula"];
                    $this->costo = $datos["costo"];
                    $this->pension = $datos["pension"];
                    $this->pago = $datos["pago"];
                    $this->idestudiantes = $datos["idestudiantes"];
                    $this->idparalelo = $datos["idparalelo"];

                    // Preparar la consulta SQL para actualizar los campos
                    $query = "UPDATE matricula SET 
                                codigo = '$this->codigo', 
                                fechamatricula = '$this->fechamatricula', 
                                costo = '$this->costo',
                                pension = '$this->pension',
                                 pago = '$this->pago'
                                  idestudiantes = '$this->idestudiantes'
                                   idparalelo = '$this->idparalelo'
                              WHERE idmatricula = '$this->idmatricula'";

                    // Ejecutar la consulta
                    $resp = parent::nonQuery($query);

                    if ($resp > 0) {
                        $respuesta = $_respuesta->response;
                        $respuesta["result"] = array(
                            "idmatricula" => $this->idmatricula
                        );
                        return $respuesta; // Actualización exitosa
                    } else {
                        return $_respuesta->error_500(); // Error interno del servidor
                    }
                }
            } elseif ($this->metodo == "delete") {
                // Eliminar usuario
                if (!isset($datos["idmatricula"])) {
                    return $_respuesta->error_400();
                } else {
                    $this->idmatricula = $datos["idmatricula"];
                    $query = "DELETE FROM matricula WHERE idmatricula = '$this->idmatricula'";

                    $resp = parent::nonQuery($query);

                    if ($resp) {
                        $respuesta = $_respuesta->response;
                        $respuesta["result"] = array("idmatricula" => $this->idmatricula);
                        return $respuesta;
                    } else {
                        return $_respuesta->error_500();
                    }
                }
            }
        }
    }
}