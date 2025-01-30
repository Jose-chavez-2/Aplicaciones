<?php
require_once "conexion/conexion.php";
require_once "respuestas.php";

class padres extends conexion
{
    private $idpadres;
    private $nombres = "";
    private $apellidos = "";
    private $cedula = "";
    private $telefono = "";
    private $clave = "";
    private $metodo = "";

    public function listarPadres($pagina, $cadena)
    {
        $inicio = 0;
        $cantidad = 10;
        if ($pagina > 1) {
            $inicio = $cantidad * ($pagina - 1);
        }
        $query = "SELECT idpadres, nombres, apellidos, cedula, telefono FROM padres WHERE nombres LIKE '%$cadena%' OR apellidos LIKE '%$cadena%' LIMIT $inicio, $cantidad";
        $datos = parent::obtenerDatos($query);

        $queryNumPag = "SELECT CEIL(COUNT(idpadres)/$cantidad) as numpag FROM padres WHERE nombres LIKE '%$cadena%' OR apellidos LIKE '%$cadena%'";
        $numero_paginas = parent::obtenerDatos($queryNumPag);

        return [$datos, $numero_paginas];
    }

    public function obtenerPadres($id)
    {
        $query = "SELECT * FROM padres WHERE idpadres = $id";
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
                // Insertar padre
                if (!isset($datos['nombres']) || !isset($datos['telefono']) || !isset($datos['cedula']) || !isset($datos['telefono']) || !isset($datos['clave'])) {
                    return $_respuesta->error_400();
                } else {
                    // Captura los valores del JSON
                    $nombres = $datos['nombres'];
                    $apellidos = $datos['apellidos'];
                    $cedula = $datos['cedula'];
                    $telefono = $datos['telefono'];
                    $clave = $datos['clave'];

                    // Crear un hash de la contraseña usando SHA-1
                    $hashedPassword = sha1($clave);

                    // Ejecutar lógica para guardar:
                    $query = "INSERT INTO padres (nombres, apellidos, cedula, telefono, clave) VALUES ('$nombres', '$apellidos', '$cedula', '$telefono', '$hashedPassword')";
                    $resultado = parent::nonQuery($query);

                    if ($resultado) {
                        $respuesta = $_respuesta->response;
                        $respuesta["result"] = array("id_padres" => $resultado);
                        return $respuesta;
                    } else {
                        return $_respuesta->error_500();
                    }
                }
            } elseif ($this->metodo == "put") {
                // Código para editar
                if (!isset($datos["idpadres"]) || !isset($datos["nombres"]) || !isset($datos["apellidos"]) || !isset($datos["cedula"]) || !isset($datos["telefono"])) {
                    return $_respuesta->error_400(); // Retorna error si faltan datos obligatorios
                } else {
                    $this->idpadres = $datos["idpadres"];
                    $this->nombres = $datos["nombres"];
                    $this->apellidos = $datos["apellidos"];
                    $this->cedula = $datos["cedula"];
                    $this->telefono = $datos["telefono"];
            
                    // Verificar si la contraseña debe actualizarse (comprobamos si el checkbox está activado)
                    if (isset($datos["clave"]) && !empty($datos["clave"])) {
                        // Si la contraseña fue enviada, la encriptamos
                        $this->clave = sha1($datos["clave"]);
            
                        // Incluir la contraseña en la consulta de actualización
                        $query = "UPDATE padres 
                                  SET nombres='$this->nombres', 
                                      apellidos='$this->apellidos', 
                                      cedula='$this->cedula', 
                                      telefono='$this->telefono', 
                                      clave='$this->clave' 
                                  WHERE idpadres='$this->idpadres'";
                    } else {
                        // Si no se recibe contraseña, solo actualizamos los demás campos
                        $query = "UPDATE padres 
                                  SET nombres='$this->nombres', 
                                      apellidos='$this->apellidos', 
                                      cedula='$this->cedula', 
                                      telefono='$this->telefono' 
                                  WHERE idpadres='$this->idpadres'";
                    }
            
                    // Ejecutamos la consulta
                    $resp = parent::nonQuery($query);
                    if ($resp) {
                        $respuesta = $_respuesta->response;
                        $respuesta["result"] = array(
                            "idpadres" => $this->idpadres
                        );
                        return $respuesta;
                    } else {
                        return $_respuesta->error_500();
                    }
                }
            }
             elseif ($this->metodo == "delete") {
                // Eliminar usuario
                if (!isset($datos["idpadres"])) {
                    return $_respuesta->error_400();
                } else {
                    $this->idpadres = $datos["idpadres"];
                    $query = "DELETE FROM padres WHERE idpadres = '$this->idpadres'";

                    $resp = parent::nonQuery($query);

                    if ($resp) {
                        $respuesta = $_respuesta->response;
                        $respuesta["result"] = array("idpadres" => $this->idpadres);
                        return $respuesta;
                    } else {
                        return $_respuesta->error_500();
                    }
                }
            }
        }
    }
}