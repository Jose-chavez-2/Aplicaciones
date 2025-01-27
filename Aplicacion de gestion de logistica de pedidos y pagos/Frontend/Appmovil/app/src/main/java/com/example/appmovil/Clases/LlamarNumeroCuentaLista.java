package com.example.appmovil.Clases;

public class LlamarNumeroCuentaLista {
    private  int id_pedido;
    private String numero_cuenta;
    private String nombres;
    private String apellidos;
    private String fecha_pedido;
    private int cantidad_cajas;

    public int getId_pedido() {
        return id_pedido;
    }

    public void setId_pedido(int pedido_id) {
        this.id_pedido = pedido_id;
    }

    public String getNumero_cuenta() {
        return numero_cuenta;
    }

    public void setNumero_cuenta(String numero_cuenta) {
        this.numero_cuenta = numero_cuenta;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getFecha_pedido() {
        return fecha_pedido;
    }

    public void setFecha_pedido(String fecha_pedido) {
        this.fecha_pedido = fecha_pedido;
    }

    public int getCantidad_cajas() {
        return cantidad_cajas;
    }

    public void setCantidad_cajas(int cantidad_cajas) {
        this.cantidad_cajas = cantidad_cajas;
    }
}
