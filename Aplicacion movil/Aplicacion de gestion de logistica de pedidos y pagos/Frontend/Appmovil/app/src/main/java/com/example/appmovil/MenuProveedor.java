package com.example.appmovil;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.appmovil.Configuraciones.Constantes;

import org.jetbrains.annotations.Nullable;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class MenuProveedor extends AppCompatActivity {
    private TextView txtUsuarioM, txtCodigo;
    private RequestQueue requestQueue;
    private String cedula;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_menu_proveedor);

        txtUsuarioM = findViewById(R.id.txtUsuarioM);
        txtCodigo = findViewById(R.id.txtCodigo);


        cedula = getIntent().getStringExtra("usuario");
        txtUsuarioM.setText(cedula);


        obtenerIdUsuario(cedula);

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

    }

    private void obtenerIdUsuario(String cedula) {
        StringRequest servicio = new StringRequest(Request.Method.POST, Constantes.ipGlobal+"/app/UsuarioId.php", new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject jsonResponse = new JSONObject(response);
                    boolean success = jsonResponse.getBoolean("success");

                    if (success) {

                        String idUsuario = jsonResponse.getString("id_usuario");


                        txtCodigo.setText(idUsuario);

                    } else {
                        String message = jsonResponse.getString("message");
                        Toast.makeText(MenuProveedor.this, message, Toast.LENGTH_SHORT).show();
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                    Toast.makeText(MenuProveedor.this, "Error en la respuesta del servidor", Toast.LENGTH_SHORT).show();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(MenuProveedor.this, "Error " + error.toString(), Toast.LENGTH_SHORT).show();
            }
        }) {
            @Nullable
            @Override
            protected Map<String, String> getParams() throws AuthFailureError {
                Map<String, String> parametros = new HashMap<>();
                parametros.put("cedula", cedula);
                return parametros;
            }
        };

        requestQueue = Volley.newRequestQueue(this);
        requestQueue.add(servicio);
    }

    public void salir(View view) {
        finish();
    }

    public void pedido(View view) {
        Intent intento = new Intent(MenuProveedor.this, Proveedor.class);
        intento.putExtra("usuario_id", txtCodigo.getText().toString());
        startActivity(intento);
    }

    public void ver_pagos(View view) {
        Intent intento = new Intent(MenuProveedor.this, MenuRecepcionPagos.class);
        intento.putExtra("usuario_id", txtCodigo.getText().toString());
        startActivity(intento);
    }
}
