<?php
include 'conexion.php';

$pedido_id = $_POST['pedido_id'];
$fecha_pago = $_POST['fecha_pago'];
$monto = $_POST['monto'];
$evidencia_pago = $_POST['evidencia_pago']; // La imagen en Base64
$comentario = $_POST['comentario'];

    // Insertar los datos en la base de datos, incluyendo la ruta de la imagen
    $consulta = "INSERT INTO pagos (pedido_id, fecha_pago, monto, evidencia_pago, comentario) 
                 VALUES ('$pedido_id', '$fecha_pago', '$monto', '$evidencia_pago', '$comentario')";

    if (mysqli_query($conexion, $consulta)) {
        echo "Inserción exitosa";
    } else {
        echo "Error en la inserción: " . mysqli_error($conexion);
    }

mysqli_close($conexion);
?>