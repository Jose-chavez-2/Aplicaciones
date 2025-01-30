<?php
require_once "conexion/conexion.php";
require_once "respuestas.php";

class usuarios extends conexion
{
    private $idusuario;
    private $nombres = "";
    private $apellidos = "";
    private $puesto = "";
    private $usuario = "";
    private $contrasena = "";
    private $metodo = "";

    public function listarUsuarios($pagina, $cadena)
    {
        $inicio = 0;
        $cantidad = 10;
        if ($pagina > 1) {
            $inicio = $cantidad * ($pagina - 1);
        }

        $query = "SELECT idusuario, nombres, apellidos, puesto, usuario FROM usuarios WHERE nombres LIKE '%$cadena%' OR apellidos LIKE '%$cadena%' LIMIT $inicio, $cantidad";
        $datos = parent::obtenerDatos($query);

        $queryNumPag = "SELECT CEIL(COUNT(idusuario)/$cantidad) as numpag FROM usuarios WHERE nombres LIKE '%$cadena%' OR apellidos LIKE '%$cadena%'";
        $numero_paginas = parent::obtenerDatos($queryNumPag);

        return [$datos, $numero_paginas];
    }

    public function obtenerUsuario($id)
    {
        $query = "SELECT * FROM usuarios WHERE idusuario = $id";
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
                if (!isset($datos['nombres']) || !isset($datos['apellidos']) || !isset($datos['puesto']) || !isset($datos['usuario']) || !isset($datos['contrasena'])) {
                    return $_respuesta->error_400();
                } else {
                    // Captura los valores del JSON
                    $nombres = $datos['nombres'];
                    $apellidos = $datos['apellidos'];
                    $puesto = $datos['puesto'];
                    $usuario = $datos['usuario'];
                    $contrasena = $datos['contrasena'];

                    // Crear un hash de la contraseña usando SHA-1
                    $hashedPassword = sha1($contrasena);

                    // Ejecutar lógica para guardar el usuario:
                    $query = "INSERT INTO usuarios (nombres, apellidos, puesto, usuario, contrasena) VALUES ('$nombres', '$apellidos', '$puesto', '$usuario', '$hashedPassword')";
                    $resultado = parent::nonQuery($query);

                    if ($resultado) {
                        $respuesta = $_respuesta->response;
                        $respuesta["result"] = array("id_usuario" => $resultado);
                        return $respuesta;
                    } else {
                        return $_respuesta->error_500();
                    }
                }
            } elseif ($this->metodo == "put") {
                // código para editar
                if (!isset($datos["idusuario"]) || !isset($datos["nombres"]) || !isset($datos["apellidos"]) || !isset($datos["puesto"]) || !isset($datos["usuario"])) {
                    return $_respuesta->error_400();
                } else {
                    $this->idusuario = $datos["idusuario"];
                    $this->nombres = $datos["nombres"];
                    $this->apellidos = $datos["apellidos"];
                    $this->puesto = $datos["puesto"];
                    $this->usuario = $datos["usuario"];

                    // Verificar si la contraseña debe actualizarse (comprobamos si el checkbox está activado)
                    if (isset($datos["contrasena"]) && !empty($datos["contrasena"])) {
                        // Si la contraseña fue enviada, la encriptamos
                        $this->contrasena = sha1($datos["contrasena"]);

                        // Incluir la contraseña en la consulta de actualización
                        $query = "UPDATE usuarios 
                            SET nombres='$this->nombres', 
                                apellidos='$this->apellidos', 
                                puesto='$this->puesto', 
                                usuario='$this->usuario', 
                                contrasena='$this->contrasena' 
                            WHERE idusuario='$this->idusuario'";
                    } else {
                        // Si no se recibe contraseña, solo actualizamos los demás campos
                        $query = "UPDATE usuarios 
                            SET nombres='$this->nombres', 
                                apellidos='$this->apellidos', 
                                puesto='$this->puesto', 
                                usuario='$this->usuario' 
                            WHERE idusuario='$this->idusuario'";
                    }

                    // Ejecutamos la consulta
                    $resp = parent::nonQuery($query);
                    if ($resp) {
                        $respuesta = $_respuesta->response;
                        $respuesta["result"] = array(
                            "idusuario" => $this->idusuario
                        );
                        return $respuesta;
                    } else {
                        return $_respuesta->error_500();
                    }
                }
            } elseif ($this->metodo == "delete") {
                // Eliminar usuario
                if (!isset($datos["idusuario"])) {
                    return $_respuesta->error_400();
                } else {
                    $this->idusuario = $datos["idusuario"];
                    $query = "DELETE FROM usuarios WHERE idusuario = '$this->idusuario'";

                    $resp = parent::nonQuery($query);

                    if ($resp) {
                        $respuesta = $_respuesta->response;
                        $respuesta["result"] = array("idusuario" => $this->idusuario);
                        return $respuesta;
                    } else {
                        return $_respuesta->error_500();
                    }
                }
            }
        }
    }

}




