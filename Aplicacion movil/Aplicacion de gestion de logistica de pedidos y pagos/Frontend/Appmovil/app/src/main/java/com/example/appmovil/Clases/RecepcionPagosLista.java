package com.example.appmovil.Clases;

import android.graphics.Bitmap;

import java.time.LocalDate;

public class RecepcionPagosLista {
    private int pedido_id;
    private String fecha_pago;
    private Bitmap evidencia_pago;

    public int getPedido_id() {
        return pedido_id;
    }

    public void setPedido_id(int pedido_id) {
        this.pedido_id = pedido_id;
    }

    public String getFecha_pago() {
        return fecha_pago;
    }
    public void setFecha_pago(String fecha_pago) {
        this.fecha_pago = fecha_pago;
    }

    public Bitmap getEvidencia_pago() {
        return evidencia_pago;
    }

    public void setEvidencia_pago(Bitmap evidencia_pago) {
        this.evidencia_pago = evidencia_pago;
    }
}
