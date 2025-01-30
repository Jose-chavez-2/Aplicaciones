<?php
require_once "conexion/conexion.php";
require_once "respuestas.php";

class ingresos extends conexion
{
    private $token = "";
    private $metodo = "";

    public function listarIngreso($pagina, $cadena)
    {
        $inicio = 0;
        $cantidad = 10; // Número de resultados por página

        // Calcular el inicio para la paginación
        if ($pagina > 1) {
            $inicio = $cantidad * ($pagina - 1);
        }

        // Consulta principal con búsqueda y paginación
        $query = "SELECT 
        u.usuario AS usuario_nombre, 
        pa.fecha AS fecha_pago, 
        pa.pagado AS monto_pagado, 
        pa.tipopago AS tipo_pago, 
        m.pension AS pension_mensual 
    FROM 
        usuarios u
    JOIN 
        pagos pa ON u.idusuario = pa.idusuario
    JOIN 
        matricula m ON pa.idmatricula = m.idmatricula
    WHERE 
        pa.tipopago LIKE '%$cadena%' 
        OR pa.fecha LIKE '%$cadena%' 
        OR u.usuario LIKE '%$cadena%'
    LIMIT $inicio, $cantidad";

        // Obtener los datos principales
        $datos = parent::obtenerDatos($query);

        // Ajustar la consulta para el número total de páginas
        $queryNumPag = "SELECT 
        CEIL(COUNT(*) / $cantidad) AS numpag
    FROM 
        usuarios u
    JOIN 
        pagos pa ON u.idusuario = pa.idusuario
    JOIN 
        matricula m ON pa.idmatricula = m.idmatricula
    WHERE 
        pa.tipopago LIKE '%$cadena%' 
        OR pa.fecha LIKE '%$cadena%' 
        OR u.usuario LIKE '%$cadena%'";

        // Obtener el número total de páginas
        $numero_paginas = parent::obtenerDatos($queryNumPag);

        // Retornar los datos y el número de páginas
        return [$datos, $numero_paginas];
    }

    public function obtenerIngreso($id)
    {
        $query = "SELECT 
            u.usuario AS usuario_nombre, 
            pa.fecha AS fecha_pago, 
            pa.pagado AS monto_pagado, 
            pa.tipopago AS tipo_pago, 
            m.pension AS pension_mensual 
        FROM 
            usuarios u
        JOIN 
            pagos pa ON u.idusuario = pa.idusuario
        JOIN 
            matricula m ON pa.idmatricula = m.idmatricula
        WHERE 
            u.idusuario = $id";

        $datos = parent::obtenerDatos($query);
        return ($datos);
    }

}