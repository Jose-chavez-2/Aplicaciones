<?php
require_once "conexion/conexion.php";
require_once "respuestas.php";

class Reporte extends conexion
{

    public function listarReporte($pagina, $cadena, $cedula)
    {
        $inicio = 0;
        $cantidad = 10; // Número de resultados por página
    
        // Calcular el inicio para la paginación
        if ($pagina > 1) {
            $inicio = $cantidad * ($pagina - 1);
        }
    
        // Consulta principal con búsqueda y paginación, ahora incluye el filtro por cédula
        $query = "SELECT 
                e.nombres AS estudiante_nombre, 
                e.apellidos AS estudiante_apellido, 
                p.nombres AS padre_nombre, 
                p.apellidos AS padre_apellido, 
                p.telefono AS padre_telefono, 
                u.usuario AS usuario_nombre, 
                pa.fecha AS fecha_pago, 
                pa.pagado AS monto_pagado, 
                pa.tipopago AS tipo_pago, 
                m.codigo AS codigo_matricula, 
                m.pension AS pension_mensual, 
                pl.curso AS curso_nombre, 
                pl.paralelo AS paralelo_nombre,
                lc.nombre As nombre_lectivo,
                e.estado As estudiante_estado
            FROM 
                estudiantes e
            JOIN 
                padres p ON e.idpadres = p.idpadres
            JOIN 
                matricula m ON e.idestudiantes = m.idestudiantes
            JOIN 
                pagos pa ON m.idmatricula = pa.idmatricula
            JOIN 
                usuarios u ON pa.idusuario = u.idusuario
            JOIN 
                paralelo pl ON m.idparalelo = pl.idparalelo
            JOIN
                lectivo lc ON pl.idlectivo = lc.idlectivo
            WHERE 
                (pl.curso LIKE '%$cadena%' 
                OR pl.paralelo LIKE '%$cadena%' 
                OR pa.tipopago LIKE '%$cadena%' 
                OR pa.fecha LIKE '%$cadena%'
                OR e.estado LIKE '%$cadena%'
                OR u.usuario LIKE '%$cadena%')
                AND p.cedula = '$cedula'  -- Agregar filtro por cédula
            LIMIT $inicio, $cantidad
        ";
    
        // Obtener los datos principales
        $datos = parent::obtenerDatos($query);
    
        // Consulta para calcular el número total de páginas, ahora también tiene en cuenta el filtro de cédula
        $queryNumPag = "SELECT 
                CEIL(COUNT(*) / $cantidad) AS numpag
            FROM 
                estudiantes e
            JOIN 
                padres p ON e.idpadres = p.idpadres
            JOIN 
                matricula m ON e.idestudiantes = m.idestudiantes
            JOIN 
                pagos pa ON m.idmatricula = pa.idmatricula
            JOIN 
                usuarios u ON pa.idusuario = u.idusuario
            JOIN 
                paralelo pl ON m.idparalelo = pl.idparalelo
            JOIN
                lectivo lc ON pl.idlectivo = lc.idlectivo
            WHERE 
                (e.nombres LIKE '%$cadena%' 
                OR e.apellidos LIKE '%$cadena%' 
                OR p.nombres LIKE '%$cadena%' 
                OR p.apellidos LIKE '%$cadena%'
                OR u.usuario LIKE '%$cadena%'
                OR e.estado LIKE '%$cadena%'
                OR pa.tipopago LIKE '%$cadena%')
                AND p.cedula = '$cedula'  -- Agregar filtro por cédula
        ";
    
        // Obtener el número total de páginas
        $numero_paginas = parent::obtenerDatos($queryNumPag);
    
        // Retornar los datos y el número de páginas
        return [$datos, $numero_paginas];
    }
    
}