<?php
require_once "conexion/conexion.php";
require_once "respuestas.php";

class estudiantes extends conexion
{
    private $idestudiantes;
    private $nombres = "";
    private $apellidos = "";
    private $cedula = "";
    private $direccion = "";
    private $correo = "";
    private $telefono = "";
    private $idpadres = "";
    private $estado = "";
    private $metodo = "";

    public function listarEstiantes($pagina, $cadena)
    {
        $inicio = 0;
        $cantidad = 10;
        if ($pagina > 1) {
            $inicio = $cantidad * ($pagina - 1);
        }
        $query = "SELECT idestudiantes, nombres, apellidos, cedula, direccion, correo, telefono, idpadres, estado FROM estudiantes WHERE nombres LIKE '%$cadena%' OR apellidos LIKE '%$cadena%' OR estado LIKE '%$cadena%' LIMIT $inicio, $cantidad";
        $datos = parent::obtenerDatos($query);

        $queryNumPag = "SELECT CEIL(COUNT(idestudiantes)/$cantidad) as numpag FROM estudiantes WHERE nombres LIKE '%$cadena%' OR apellidos LIKE '%$cadena%' OR estado LIKE '%$cadena%'";
        $numero_paginas = parent::obtenerDatos($queryNumPag);

        return [$datos, $numero_paginas];
    }

    public function obtenerEstudiantes($id)
    {
        $query = "SELECT * FROM estudiantes WHERE idestudiantes = $id";
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
                // Validación de los datos enviados
                if (
                    !isset($datos["nombres"]) ||
                    !isset($datos["apellidos"]) ||
                    !isset($datos["cedula"]) ||
                    !isset($datos["direccion"]) ||
                    !isset($datos["correo"]) ||
                    !isset($datos["telefono"]) || 
                    !isset($datos["estado"]) || 
                    !isset($datos["idpadres"])
                ) {
                    return $_respuesta->error_400();
                } else {
                    $this->nombres = $datos["nombres"];
                    $this->apellidos = $datos["apellidos"];
                    $this->cedula = $datos["cedula"];
                    $this->direccion = $datos["direccion"];
                    $this->correo = $datos["correo"];
                    $this->telefono = $datos["telefono"];
                    $this->estado = $datos["estado"];
                    $this->idpadres = $datos["idpadres"];

                    $query = "INSERT INTO estudiantes (nombres, apellidos, cedula, direccion, correo, telefono, estado, idpadres) 
                              VALUES ('$this->nombres', '$this->apellidos', '$this->cedula', '$this->direccion', 
                                      '$this->correo', '$this->telefono', '$this->estado', '$this->idpadres')";
                    $resp = parent::nonQueryId($query);

                    if ($resp) {
                        $respuesta = $_respuesta->response;
                        $respuesta["result"] = array("idestudiantes" => $resp);
                        return $respuesta;
                    } else {
                        return $_respuesta->error_500();
                    }
                }
            } elseif ($this->metodo == "put") {
                // Verificar que todos los campos necesarios estén definidos y no vacíos
                if (!isset($datos["idestudiantes"]) || !isset($datos["nombres"]) || !isset($datos["apellidos"]) || !isset($datos["cedula"]) || !isset($datos["direccion"]) || !isset($datos["correo"]) || !isset($datos["telefono"]) || !isset($datos["estado"]) || !isset($datos["idpadres"])) {
                    return $_respuesta->error_400(); // Error: Datos insuficientes
                } else {
                    // Asignar valores a las propiedades de la clase
                    $this->idestudiantes = $datos["idestudiantes"];
                    $this->nombres = $datos["nombres"];
                    $this->apellidos = $datos["apellidos"];
                    $this->cedula = $datos["cedula"];
                    $this->direccion = $datos["direccion"]; 
                    $this->correo = $datos["correo"];
                    $this->telefono = $datos["telefono"];
                    $this->estado = $datos["estado"]; 
                    $this->idpadres = $datos["idpadres"];
            
                    // Preparar la consulta SQL para actualizar los campos
                    $query = "UPDATE estudiantes 
                              SET nombres = '$this->nombres', 
                                  apellidos = '$this->apellidos', 
                                  cedula = '$this->cedula', 
                                  direccion = '$this->direccion',
                                  correo = '$this->correo',
                                  telefono = '$this->telefono',
                                  estado = '$this->estado'
                              WHERE idestudiantes = '$this->idestudiantes'";
            
                    // Ejecutar la consulta
                    $resp = parent::nonQuery($query);
            
                    if ($resp > 0) {
                        $respuesta = $_respuesta->response;
                        $respuesta["result"] = array(
                            "idestudiantes" => $this->idestudiantes
                        );
                        return $respuesta; // Actualización exitosa
                    } else {
                        return $_respuesta->error_500(); // Error interno del servidor
                    }
                }
            } elseif ($this->metodo == "delete") {
                // Eliminar usuario
                if (!isset($datos["idestudiantes"])) {
                    return $_respuesta->error_400();
                } else {
                    $this->idestudiantes = $datos["idestudiantes"];
                    $query = "DELETE FROM estudiantes WHERE idestudiantes = '$this->idestudiantes'";

                    $resp = parent::nonQuery($query);

                    if ($resp) {
                        $respuesta = $_respuesta->response;
                        $respuesta["result"] = array("idestudiantes" => $this->idestudiantes);
                        return $respuesta;
                    } else {
                        return $_respuesta->error_500();
                    }
                }
            }
        }
    }
}