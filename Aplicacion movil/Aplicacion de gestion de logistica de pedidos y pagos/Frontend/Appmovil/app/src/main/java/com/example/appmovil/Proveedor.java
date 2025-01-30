package com.example.appmovil;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
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
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

public class Proveedor extends AppCompatActivity {
    private EditText etFechaPedido, etEstadoCaja, etCantidadCajas, etFechaEntrega, etComentario, etCantidadStock;
    private TextView txtUsuario, txtIdPedido;
    private Button btnGuardar, btnModificar;
    private RequestQueue requestQueue;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_proveedor);

        txtUsuario = findViewById(R.id.txtUsuario);
        txtIdPedido = findViewById(R.id.txtIdPedido);
        etFechaPedido = findViewById(R.id.etFechaPedido);
        etEstadoCaja = findViewById(R.id.etEstadoCaja);
        etCantidadCajas = findViewById(R.id.etCantidadCajas);
        etFechaEntrega = findViewById(R.id.etFechaEntrega);
        etCantidadStock = findViewById(R.id.etCantidadStock);
        etComentario = findViewById(R.id.etComentario);
        btnGuardar = findViewById(R.id.btnGuardar);
        btnModificar = findViewById(R.id.btnModificar);

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        requestQueue = Volley.newRequestQueue(this);

        Intent intent = getIntent();
        String pedidoID = intent.getStringExtra("id_pedido");
        String usuarioId = intent.getStringExtra("usuario_id");
        String fechaPedido = intent.getStringExtra("fecha_pedido");
        String estadoCajas = intent.getStringExtra("estado_cajas");
        String cantidadCajas = intent.getStringExtra("cantidad_cajas");
        String fechaEntrega = intent.getStringExtra("fecha_entrega");
        String comentario = intent.getStringExtra("comentario");
        boolean pedidosVisualizados = intent.getBooleanExtra("pedidos_visualizados", false);

        txtIdPedido.setText(pedidoID);
        txtUsuario.setText(usuarioId);
        etFechaPedido.setText(fechaPedido);
        etEstadoCaja.setText(estadoCajas);
        etCantidadCajas.setText(cantidadCajas);
        etFechaEntrega.setText(fechaEntrega);
        etComentario.setText(comentario);

        // Configuración de botones según si los pedidos fueron visualizados
        if (pedidosVisualizados) {
            btnGuardar.setEnabled(false);
            btnModificar.setEnabled(true);
            etEstadoCaja.setEnabled(true);
            etCantidadCajas.setEnabled(false);
            etFechaEntrega.setEnabled(true);
        }

        Calendar currentDate = Calendar.getInstance();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd", Locale.getDefault());
        etFechaPedido.setText(dateFormat.format(currentDate.getTime()));

        obtenerStock();
    }

    // Método para guardar los datos
    private void servicioGuardar(String url) {
        StringRequest servicio = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Toast.makeText(Proveedor.this, "Guardado", Toast.LENGTH_SHORT).show();
                obtenerStock(); // Actualizar stock después de guardar
                btnGuardar.setEnabled(false); // Desactivar el botón de guardar tras completar
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(Proveedor.this, "Error " + error.toString(), Toast.LENGTH_SHORT).show();
            }
        }) {
            @Nullable
            @Override
            protected Map<String, String> getParams() throws AuthFailureError {
                Map<String, String> parametros = new HashMap<>();
                parametros.put("id_usuario", txtUsuario.getText().toString());
                parametros.put("fecha_pedido", etFechaPedido.getText().toString());
                parametros.put("estado_cajas", etEstadoCaja.getText().toString());
                parametros.put("cantidad_cajas", etCantidadCajas.getText().toString());
                parametros.put("fecha_entrega", etFechaEntrega.getText().toString());
                parametros.put("comentario", etComentario.getText().toString());
                return parametros;
            }
        };
        requestQueue.add(servicio);
    }

    // Método para actualizar los datos
    private void servicioActualizar(String url) {
        StringRequest servicio = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Toast.makeText(Proveedor.this, "Actualizado", Toast.LENGTH_SHORT).show();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(Proveedor.this, "Error " + error.toString(), Toast.LENGTH_SHORT).show();
            }
        }) {
            @Nullable
            @Override
            protected Map<String, String> getParams() throws AuthFailureError {
                Map<String, String> parametros = new HashMap<>();
                parametros.put("id_pedido", txtIdPedido.getText().toString());
                parametros.put("estado_cajas", etEstadoCaja.getText().toString());
                parametros.put("fecha_entrega", etFechaEntrega.getText().toString());
                parametros.put("comentario", etComentario.getText().toString());
                return parametros;
            }
        };
        requestQueue.add(servicio);
    }

    // Método para obtener el stock
    private void obtenerStock() {
        StringRequest servicio = new StringRequest(Request.Method.POST, Constantes.ipGlobal + "/app/LlamarCantidaSuministros.php", new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject jsonResponse = new JSONObject(response);
                    boolean success = jsonResponse.getBoolean("success");

                    if (success) {
                        JSONArray jsonArray = jsonResponse.getJSONArray("data");

                        // Recorre el array de suministro para extraer las cantidades
                        StringBuilder cantidades = new StringBuilder();
                        for (int i = 0; i < jsonArray.length(); i++) {
                            JSONObject producto = jsonArray.getJSONObject(i);
                            String cantidad = producto.getString("cantidad");

                            // Agrega la cantidad al StringBuilder
                            cantidades.append(cantidad);
                        }
                        etCantidadStock.setText(cantidades.toString());
                    } else {
                        String message = jsonResponse.getString("message");
                        Toast.makeText(Proveedor.this, message, Toast.LENGTH_SHORT).show();
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                    Toast.makeText(Proveedor.this, "Error en la respuesta del servidor", Toast.LENGTH_SHORT).show();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(Proveedor.this, "Error " + error.toString(), Toast.LENGTH_SHORT).show();
            }
        });

        requestQueue.add(servicio);
    }

    // Método para regresar a la pantalla anterior
    public void regresar_proveedor(View view) {
        finish();
    }

    // Método para guardar pedidos
    public void guardar_pedidos(View view) {
        int cantidadCajas = Integer.parseInt(etCantidadCajas.getText().toString());
        int cantidadStock = Integer.parseInt(etCantidadStock.getText().toString());

        if (cantidadCajas > cantidadStock) {
            Toast.makeText(this, "No hay suficiente stock para este pedido.", Toast.LENGTH_SHORT).show();
        } else {
            servicioGuardar(Constantes.ipGlobal + "/app/GuardarPedidos.php");
        }
    }

    // Método para modificar pedidos
    public void Modificar(View view) {
        servicioActualizar(Constantes.ipGlobal + "/app/ModificarPedidos.php");
    }
}




