package com.example.appmovil;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.appmovil.Clases.PedidosProveedorLista;
import com.example.appmovil.Clases.RecepcionPagosLista;
import com.example.appmovil.Configuraciones.Constantes;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class MenuRecepcionPagos extends AppCompatActivity {
    private RequestQueue requestQueue;
    private ListView lvListaRecepcionP;
    private TextView txtIdPedidoPagos;
    private ImageView ivImagenEvidencia;
    private ArrayList<String> lista = new ArrayList<>();
    private ArrayList<RecepcionPagosLista> listaPagos = new ArrayList<>();
    private int filaSeleccionada = -1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_menu_recepcion_pagos);

        lvListaRecepcionP = findViewById(R.id.lvListaRecepcionP);
        txtIdPedidoPagos = findViewById(R.id.txtIdPedidoPagos);
        ivImagenEvidencia = findViewById(R.id.ivImagenEvidencia);

        // Configuración del ListView al seleccionar un elemento
        lvListaRecepcionP.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int position, long id) {
                filaSeleccionada = position;
                if (filaSeleccionada >= 0 && filaSeleccionada < listaPagos.size()) {
                    RecepcionPagosLista pagoSeleccionado = listaPagos.get(filaSeleccionada);

                    // Decodificar la imagen (evidencia_pago) y cargarla en el ImageView
                    if (pagoSeleccionado.getEvidencia_pago() != null) {
                        ivImagenEvidencia.setImageBitmap(pagoSeleccionado.getEvidencia_pago());
                    } else {
                        Log.e("MenuRecepcionPagos", "La evidencia de pago es nula.");
                    }
                } else {
                    Log.e("MenuRecepcionPagos", "Posición seleccionada no válida.");
                }
            }
        });

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        Intent intent = getIntent();
        String usuarioId = intent.getStringExtra("usuario_id");
        txtIdPedidoPagos.setText(usuarioId);

    }

    // Método para buscar datos al presionar el botón
    public void Buscar_Datos(View view) {
        String idUsuario = txtIdPedidoPagos.getText().toString();

        if (!idUsuario.isEmpty()) {
            servicioConsultarPagos(Constantes.ipGlobal+"/app/ConfirmarPago.php", idUsuario);
        } else {
            Toast.makeText(MenuRecepcionPagos.this, "Por favor, ingrese un ID de usuario.", Toast.LENGTH_SHORT).show();
        }
    }
    public void Buscar_Datos2(View view) {
        String idUsuario = txtIdPedidoPagos.getText().toString();

        if (!idUsuario.isEmpty()) {
            servicioConsultarPagos(Constantes.ipGlobal+"/app/ConfirmarPago.php", idUsuario);
        } else {
            Toast.makeText(MenuRecepcionPagos.this, "Por favor, ingrese un ID de usuario.", Toast.LENGTH_SHORT).show();
        }
    }

    // Modificación del método para incluir el ID del usuario en la solicitud POST
    public void servicioConsultarPagos(String url, final String idUsuario) {
        StringRequest stringRequest = new StringRequest(Request.Method.POST, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONArray jsonArray = new JSONArray(response);
                            Log.d("MenuRecepcionPagos", "Número de registros: " + jsonArray.length());
                            listaPagos.clear();
                            for (int i = 0; i < jsonArray.length(); i++) {
                                JSONObject jsonObject = jsonArray.getJSONObject(i);
                                RecepcionPagosLista pagoNuevo = new RecepcionPagosLista();
                                pagoNuevo.setPedido_id(jsonObject.getInt("pedido_id"));
                                pagoNuevo.setFecha_pago(jsonObject.getString("fecha_pago"));
                                String imagenBase64 = jsonObject.getString("evidencia_pago");
                                byte[] decodedString = Base64.decode(imagenBase64, Base64.DEFAULT);
                                Bitmap decodedByte = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);
                                pagoNuevo.setEvidencia_pago(decodedByte);
                                listaPagos.add(pagoNuevo);
                                lista.add("Pedido ID: " + pagoNuevo.getPedido_id());
                            }
                            llenarLista();
                        } catch (JSONException e) {
                            Log.e("MenuRecepcionPagos", "Error al procesar datos: " + e.getMessage());
                            Toast.makeText(MenuRecepcionPagos.this, "Error al procesar datos: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.e("MenuRecepcionPagos", "Error de consulta: " + error.getMessage());
                        Toast.makeText(MenuRecepcionPagos.this, "Error de consulta: " + error.getMessage(), Toast.LENGTH_SHORT).show();
                    }
                }) {
            @Override
            protected Map<String, String> getParams() {
                Map<String, String> params = new HashMap<>();
                params.put("id_usuario", idUsuario);
                return params;
            }
        };

        requestQueue = Volley.newRequestQueue(this);
        requestQueue.add(stringRequest);
    }

    // Método para llenar la lista del ListView
    private void llenarLista() {
        lista.clear();
        for (RecepcionPagosLista pago : listaPagos) {
            String detalles = "ID: " + pago.getPedido_id() + "\n" +
                    "Fecha pago: " + pago.getFecha_pago() + "\n" +
                    "Evidencia: " + pago.getEvidencia_pago();

            lista.add(detalles);
        }
        ArrayAdapter<String> adaptador = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, lista);
        lvListaRecepcionP.setAdapter(adaptador);
        Log.d("MenuRecepcionPagos", "Lista llena con " + lista.size() + " elementos.");
    }

    public void regresarMenu(View view) {
        finish();
    }
}


