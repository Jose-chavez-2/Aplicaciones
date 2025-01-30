package com.example.appmovil;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class MenuAdministrador extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_menu_administrador);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
    }

    public void Regresar(View view) {
        finish();
    }

    public void ActivarDesactivar(View view) {
        Intent intento = new Intent(MenuAdministrador.this, Administrador.class);
        startActivity(intento);
    }

    public void VerPedido(View view) {
        Intent intento = new Intent(MenuAdministrador.this, PedidosProveedor.class);
        startActivity(intento);
    }

    public void realizar_pagos(View view) {
        Intent intento = new Intent(MenuAdministrador.this, GestionarPagos.class);
        startActivity(intento);
    }

    public void Reportes(View view) {
        Intent intento = new Intent(MenuAdministrador.this, Reportes.class);
        startActivity(intento);
    }

    public void Suministros(View view) {
        Intent intento = new Intent(MenuAdministrador.this, Suministros.class);
        startActivity(intento);
    }

    public void Vehiculos(View view) {
        Intent intento = new Intent(MenuAdministrador.this, Vehiculos.class);
        startActivity(intento);
    }
}