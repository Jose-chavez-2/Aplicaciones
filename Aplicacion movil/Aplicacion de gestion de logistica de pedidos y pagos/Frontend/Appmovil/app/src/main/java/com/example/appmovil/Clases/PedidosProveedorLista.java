package com.example.appmovil.Clases;



public class PedidosProveedorLista {
    private int id_pedido;
    private int id_usuario;
    private String fecha_pedido;
    private String estado_cajas;
    private int cantidad_cajas;
    private String fecha_entrega;
    private String comentario;
    private String nombres;


    public int getId_pedido() {
        return id_pedido;
    }

    public void setId_pedido(int id_pedido) {
        this.id_pedido = id_pedido;
    }

    public int getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(int id_usuario) {
        this.id_usuario = id_usuario;
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

    public String getEstado_cajas() {
        return estado_cajas;
    }

    public void setEstado_cajas(String estado_cajas) {
        this.estado_cajas = estado_cajas;
    }

    public String getFecha_entrega() {
        return fecha_entrega;
    }

    public void setFecha_entrega(String fecha_entrega) {
        this.fecha_entrega = fecha_entrega;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }
}
