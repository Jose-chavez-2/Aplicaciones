<?php

class conexion {
    private $servidor = "localhost";
    private $usuario = "root";
    private $contrasena = "";
    private $basedatos = "gestion_colegio";
    private $puerto = "3306";
   // private $servidor = "sql102.infinityfree.com"; // Nombre del host MySQL
   // private $usuario = "if0_37868890";             // Nombre de usuario MySQL
    //private $contrasena = "IberoTesis";           // Contraseña MySQL
    //private $basedatos = "if0_37868890_gestion_colegio"; // Nombre completo de la base de datos
    //private $puerto = "3306";           
        
    private $connection;
    

    function __construct() {
        $this->connection = new mysqli($this->servidor, $this->usuario, $this->contrasena, $this->basedatos, $this->puerto);
        if ($this->connection->connect_errno) {
            echo "conexión no establecida";
            die();
        }
    }

    private function convertirUTF8($array){
        array_walk_recursive($array, function(&$item, $key){
            if (!mb_detect_encoding($item, 'utf-8', true)) {
                $item = utf8_encode($item);
                //$item = mb_convert_encoding($item, 'UTF-8', 'ISO-8859-1');
            }
        });
        return $array;
    }

    public function obtenerDatos($sqlstr) {
        $results = $this->connection->query($sqlstr);
        $resultArray = array();
        foreach ($results as $key) {
            $resultArray[] = $key;
        }
        return $this->convertirUTF8($resultArray);
    }

    public function nonQuery($sqlstr) {
        $results = $this->connection->query($sqlstr);
        return $this->connection->affected_rows;
    }

    public function nonQueryId($sqlstr) {
        $results = $this->connection->query($sqlstr);
        $filas = $this->connection->affected_rows;
        if ($filas >= 1) {
            return $this->connection->insert_id;
        } else {
            return 0;
        }
    }
    public function buscarToken($token)
    {
        $query = "select idtoken from token where token = '" . $token . "' and estado = '1';";
        $resp = $this->obtenerDatos($query);
        if ($resp) {
            return true;
        } else {
            return 0;
        }
    }
}