package com.example.appmovil;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
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
import com.example.appmovil.Clases.LlamarNumeroCuentaLista;
import com.example.appmovil.Clases.PedidosProveedorLista;
import com.example.appmovil.Clases.RecepcionPagosLista;
import com.example.appmovil.Configuraciones.Constantes;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class GestionarPagos extends AppCompatActivity {
    private RequestQueue requestQueue;
    private ListView lvListaProveedor;
    private ArrayList<String> lista = new ArrayList<>();
    private ArrayList<LlamarNumeroCuentaLista> listaProveedor = new ArrayList<>();
    private TextView txtNombresB, txtApellidosB, txtNumeroCuentaB, txtNumeroCajasB, txtFechaP, txtIdPedidoB;
    private EditText etIdUsuarioB;
    private int filaSeleccionada = -1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_gestionar_pagos);

        // Inicialización de las vistas
        txtNombresB = findViewById(R.id.txtNombresB);
        txtApellidosB = findViewById(R.id.txtApellidosB);
        txtNumeroCuentaB = findViewById(R.id.txtNumeroCuentaB);
        txtIdPedidoB = findViewById(R.id.txtIdPedidoB);
        txtNumeroCajasB = findViewById(R.id.txtCantidadCajasB);
        txtFechaP = findViewById(R.id.txtFechaP);
        etIdUsuarioB = findViewById(R.id.etIdUsuarioB);
        lvListaProveedor = findViewById(R.id.lvListaPagos);

        lvListaProveedor.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int position, long id) {
                filaSeleccionada = position;

                if (filaSeleccionada >= 0 && filaSeleccionada < listaProveedor.size()) {
                    LlamarNumeroCuentaLista pedidoSeleccionado = listaProveedor.get(filaSeleccionada);
                    txtNombresB.setText(pedidoSeleccionado.getNombres());
                    txtApellidosB.setText(pedidoSeleccionado.getApellidos());
                    txtIdPedidoB.setText(String.valueOf(pedidoSeleccionado.getId_pedido()));
                    txtFechaP.setText(pedidoSeleccionado.getFecha_pedido());
                    txtNumeroCajasB.setText(String.valueOf(pedidoSeleccionado.getCantidad_cajas()));
                    txtNumeroCuentaB.setText(String.valueOf(pedidoSeleccionado.getNumero_cuenta()));
                } else {
                    Log.e("GestionarPagos", "Posición seleccionada no válida.");
                }
            }
        });
    }
    public void BuscarProveedor(View view) {
        String idUsuario = etIdUsuarioB.getText().toString();

        if (!idUsuario.isEmpty()) {
            servicioBuscarProveedor(Constantes.ipGlobal+"/app/ConsultarProveedor.php", idUsuario);
        } else {
            Toast.makeText(GestionarPagos.this, "Por favor, ingrese un ID de usuario.", Toast.LENGTH_SHORT).show();
        }
    }

    public void servicioBuscarProveedor(String url, final String idUsuario) {
        StringRequest stringRequest = new StringRequest(Request.Method.POST, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONArray jsonArray = new JSONArray(response);
                            Log.d("GestionarPagos", "Número de registros: " + jsonArray.length());
                            listaProveedor.clear();
                            lista.clear();

                            for (int i = 0; i < jsonArray.length(); i++) {
                                JSONObject jsonObject = jsonArray.getJSONObject(i);
                                LlamarNumeroCuentaLista pagoNuevo = new LlamarNumeroCuentaLista();
                                pagoNuevo.setNombres(jsonObject.getString("nombres"));
                                pagoNuevo.setApellidos(jsonObject.getString("apellidos"));
                                pagoNuevo.setId_pedido(jsonObject.getInt("id_pedido"));
                                pagoNuevo.setFecha_pedido(jsonObject.getString("fecha_pedido"));
                                pagoNuevo.setCantidad_cajas(jsonObject.getInt("cantidad_cajas"));
                                pagoNuevo.setNumero_cuenta(jsonObject.getString("numero_cuenta"));
                                listaProveedor.add(pagoNuevo);
                                lista.add("Pedido ID: " + pagoNuevo.getId_pedido());
                            }
                            llenarLista();
                        } catch (JSONException e) {
                            Log.e("GestionarPagos", "Error al procesar datos: " + e.getMessage());
                            Toast.makeText(GestionarPagos.this, "Error al procesar datos: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.e("GestionarPagos", "Error de consulta: " + error.getMessage());
                        Toast.makeText(GestionarPagos.this, "Error de consulta: " + error.getMessage(), Toast.LENGTH_SHORT).show();
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

    private void llenarLista() {
        lista.clear();
        for (LlamarNumeroCuentaLista pago : listaProveedor) {
            String detalles = "ID: " + pago.getId_pedido() + "\n" +
                    "Nombres: " + pago.getNombres() + "\n" +
                    "Apellidos: " + pago.getApellidos() + "\n" +
                    "Cantidad de cajas: " + pago.getCantidad_cajas() + "\n" +
                    "Numero de cuenta: " + pago.getNumero_cuenta() + "\n" +
                    "Fecha del pedido: " + pago.getFecha_pedido();

            lista.add(detalles);
        }
        ArrayAdapter<String> adaptador = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, lista);
        lvListaProveedor.setAdapter(adaptador);
        Log.d("GestionarPagos", "Lista llena con " + lista.size() + " elementos.");
    }

    public void Pagos(View view) {
        Intent intento = new Intent(GestionarPagos.this, EnvioPagos.class);
        intento.putExtra("id_pedido", txtIdPedidoB.getText().toString());
        intento.putExtra("id_usuario", etIdUsuarioB.getText().toString());
        intento.putExtra("nombres", txtNombresB.getText().toString());
        intento.putExtra("apellidos", txtApellidosB.getText().toString());
        intento.putExtra("numero_cuenta", txtNumeroCuentaB.getText().toString());
        startActivity(intento);
    }
}
