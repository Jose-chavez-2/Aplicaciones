<?php
require_once "conexion/conexion.php";
require_once "respuestas.php";

class paralelo extends conexion
{
    private $idparalelo;
    private $paralelo = "";
    private $curso = "";
    private $especialidad = "";
    private $codigo = "";
    private $idlectivo = "";
    private $metodo = "";

    public function listarParalelo($pagina, $cadena, $idlectivo)
    {
        $inicio = 0;
        $cantidad = 10;
        if ($pagina > 1) {
            $inicio = $cantidad * ($pagina - 1);
        }
        $query = "SELECT idparalelo, paralelo, curso, especialidad, codigo, idlectivo FROM paralelo WHERE idlectivo = $idlectivo and (curso LIKE '%$cadena%' OR especialidad LIKE '%$cadena%') LIMIT $inicio, $cantidad";
        $datos = parent::obtenerDatos($query);

        $queryNumPag = "SELECT CEIL(COUNT(idparalelo)/$cantidad) as numpag FROM paralelo WHERE idlectivo = $idlectivo and (curso LIKE '%$cadena%' OR especialidad LIKE '%$cadena%')";
        $numero_paginas = parent::obtenerDatos($queryNumPag);

        return [$datos, $numero_paginas];
    }

    public function obtenerParalelo($id)
    {
        $query = "SELECT * FROM paralelo WHERE idparalelo = $id";
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
                if (!isset($datos["paralelo"]) || !isset($datos["curso"]) || !isset($datos["especialidad"]) || !isset($datos["codigo"]) || !isset($datos["idlectivo"])) {
                    return $_respuesta->error_400();
                } else {
                    $this->paralelo = $datos["paralelo"];
                    $this->curso = $datos["curso"];
                    $this->especialidad = $datos["especialidad"];
                    $this->codigo = $datos["codigo"];
                    $this->idlectivo = $datos["idlectivo"];

                    $query = "INSERT INTO paralelo VALUES (NULL, '$this->paralelo', '$this->curso', '$this->especialidad', '$this->codigo', '$this->idlectivo')";
                    $resp = parent::nonQueryId($query);

                    if ($resp) {
                        $respuesta = $_respuesta->response;
                        $respuesta["result"] = array("idparalelo" => $resp);
                        return $respuesta;
                    } else {
                        return $_respuesta->error_500();
                    }
                }
            } elseif ($this->metodo == "put") {
                // Verificar que todos los campos necesarios estén definidos y no vacíos
                if (!isset($datos["idparalelo"]) || !isset($datos["paralelo"]) || !isset($datos["curso"]) || !isset($datos["especialidad"]) || !isset($datos["codigo"]) || !isset($datos["idlectivo"])) {
                    return $_respuesta->error_400(); // Error: Datos insuficientes
                } else {
                    // Asignar valores a las propiedades de la clase
                    $this->idparalelo = $datos["idparalelo"]; // Agregado para definir $this->idparalelo
                    $this->paralelo = $datos["paralelo"];
                    $this->curso = $datos["curso"];
                    $this->especialidad = $datos["especialidad"];
                    $this->codigo = $datos["codigo"];
                    $this->idlectivo = $datos["idlectivo"];

                    // Preparar la consulta SQL para actualizar los campos
                    $query = "UPDATE paralelo SET 
                                paralelo = '$this->paralelo', 
                                curso = '$this->curso', 
                                especialidad = '$this->especialidad', 
                                codigo = '$this->codigo',
                                idlectivo = '$this->idlectivo'
                              WHERE idparalelo = '$this->idparalelo'";

                    // Ejecutar la consulta
                    $resp = parent::nonQuery($query);

                    if ($resp > 0) {
                        $respuesta = $_respuesta->response;
                        $respuesta["result"] = array(
                            "idparalelo" => $this->idparalelo
                        );
                        return $respuesta; // Actualización exitosa
                    } else {
                        return $_respuesta->error_500(); // Error interno del servidor
                    }
                }
            } elseif ($this->metodo == "delete") {
                // Eliminar usuario
                if (!isset($datos["idparalelo"])) {
                    return $_respuesta->error_400();
                } else {
                    $this->idparalelo = $datos["idparalelo"];
                    $query = "DELETE FROM paralelo WHERE idparalelo = '$this->idparalelo'";

                    $resp = parent::nonQuery($query);

                    if ($resp) {
                        $respuesta = $_respuesta->response;
                        $respuesta["result"] = array("idparalelo" => $this->idparalelo);
                        return $respuesta;
                    } else {
                        return $_respuesta->error_500();
                    }
                }
            }
        }
    }
}