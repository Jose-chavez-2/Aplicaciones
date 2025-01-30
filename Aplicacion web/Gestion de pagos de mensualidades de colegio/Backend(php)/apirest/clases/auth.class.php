<?php
require_once 'conexion/conexion.php';
require_once 'respuestas.php';

class auth extends conexion
{
    public function login($json)
    {
        $_respuestas = new respuestas;
        $datos = json_decode($json, true);

        if (!isset($datos['usuario']) || !isset($datos["contrasena"])) {
            return $_respuestas->error_400();
        } else {
            $usuario = $datos['usuario'];
            $password = sha1($datos['contrasena']); // Encriptación SHA-1

            // Verificar en la tabla `usuarios`
            $datosUsuario = $this->obtenerDatosUsuario($usuario);
            if ($datosUsuario) {
                if ($password == $datosUsuario[0]['contrasena']) {
                    $verificar = $this->insertarToken($datosUsuario[0]['idusuario']);
                    if ($verificar) {
                        $result = $_respuestas->response;
                        $result["result"] = array(
                            "token" => $verificar,
                            "puesto" => $datosUsuario[0]['puesto'],
                            "idusuario" => $datosUsuario[0]['idusuario'] // Incluimos idusuario
                        );
                        
                        return $result;
                    } else {
                        return $_respuestas->error_500("Error interno, No hemos podido guardar el token.");
                    }
                } else {
                    return $_respuestas->error_200("La contraseña es inválida.");
                }
            }

            // Verificar en la tabla `padres`
            $datosPadre = $this->obtenerDatosPadre($usuario);
            if ($datosPadre) {
                if ($password == $datosPadre[0]['clave']) {
                    $verificar = $this->insertarToken($datosPadre[0]['idpadres']);
                    if ($verificar) {
                        $result = $_respuestas->response;
                        $result["result"] = array(
                            "token" => $verificar,
                            "puesto" => "Padre",
                            "cedula" => $datosPadre[0]['cedula'] // Cedula para el frontend
                        );
                        return $result;
                    } else {
                        return $_respuestas->error_500("Error interno, No hemos podido guardar el token.");
                    }
                } else {
                    return $_respuestas->error_200("La contraseña es inválida.");
                }
            }

            // Si no se encuentra en ninguna tabla
            return $_respuestas->error_200("El usuario $usuario no existe.");
        }
    }

    private function obtenerDatosUsuario($nom_usuario)
    {
        $query = "SELECT idusuario, contrasena, puesto FROM usuarios WHERE usuario = '$nom_usuario'";
        $datos = parent::obtenerDatos($query);
        if (isset($datos[0]["idusuario"])) {
            return $datos;
        } else {
            return 0;
        }
    }

    private function obtenerDatosPadre($cedula)
    {
        $query = "SELECT idpadres, clave, cedula FROM padres WHERE cedula = '$cedula'";
        $datos = parent::obtenerDatos($query);
        if (isset($datos[0]["idpadres"])) {
            return $datos;
        } else {
            return 0;
        }
    }

    private function insertarToken($usuarioid)
    {
        $val = true;
        $token = bin2hex(openssl_random_pseudo_bytes(16, $val));
        date_default_timezone_set('America/Guayaquil');
        $date = date("Y-m-d H:i:s");
        $query = "INSERT INTO token VALUES(null,'$token', '$date', '1','$usuarioid')";
        $verifica = parent::nonQuery($query);
        if ($verifica) {
            return $token;
        } else {
            return 0;
        }
    }
    
}
?>

