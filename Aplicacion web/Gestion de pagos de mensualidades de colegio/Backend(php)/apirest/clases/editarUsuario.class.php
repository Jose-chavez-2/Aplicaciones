<?php
require_once "conexion/conexion.php";
require_once "respuestas.php";

class editarUsuario extends conexion
{
    private $idusuario = "";
    private $nombres = "";
    private $apellidos = "";
    private $puesto = "";
    private $usuario = "";
    private $contrasena = "";
    

    public function EditarUsuario($json) {
        // Parsear el JSON de entrada
        $datos = json_decode($json, true);
        $respuesta = new respuestas();

        // Verificar los campos obligatorios
        if (!isset($datos["idusuario"]) || !isset($datos["nombres"]) || !isset($datos["apellidos"]) || !isset($datos["usuario"])) {
            return $respuesta->error_400();
        } else {
            // Asignar valores a las propiedades de la clase
            $this->idusuario = $datos["idusuario"];
            $this->nombres = $datos["nombres"];
            $this->apellidos = $datos["apellidos"];
            $this->puesto = isset($datos["puesto"]) ? $datos["puesto"] : "";
            $this->usuario = $datos["usuario"];
            $this->contrasena = isset($datos["contrasena"]) ? $datos["contrasena"] : "";

            // Consulta de actualización
            $query = "UPDATE usuarios SET nombres='$this->nombres', apellidos='$this->apellidos', puesto='$this->puesto', usuario='$this->usuario', contrasena='$this->contrasena' WHERE idusuario='$this->idusuario'";
            $resp = parent::nonQuery($query);

            // Comprobar si la actualización fue exitosa
            if ($resp) {
                $respuestaFinal = $respuesta->response;
                $respuestaFinal["result"] = array("idusuario" => $this->idusuario);
                return $respuestaFinal;
            } else {
                return $respuesta->error_500();
            }
        }
    }
}
