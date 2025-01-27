package com.example.appmovil;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
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
import com.android.volley.toolbox.Volley;
import com.example.appmovil.Clases.AdministradorLista;
import com.example.appmovil.Clases.PedidosProveedorLista;
import com.example.appmovil.Configuraciones.Constantes;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.sql.Timestamp;
import java.util.ArrayList;

public class PedidosProveedor extends AppCompatActivity {

    private RequestQueue requestQueue;
    private ListView lvListaP;
    private ArrayList<String> lista = new ArrayList<>();
    private ArrayList<PedidosProveedorLista> listaPedidos = new ArrayList<>();
    private TextView txtIdUsuario, txtFechaPedido, txtEstadoCajas, txtCantidadCajas, txtFechaEntrega, txtComentario, txtIdPedido;
    private int filaSeleccionada = -1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_pedidos_proveedor);

        txtIdUsuario = findViewById(R.id.txtIdUsuario);
        txtFechaPedido = findViewById(R.id.txtFechaPedido);
        txtEstadoCajas = findViewById(R.id.txtEstadoCajas);
        txtCantidadCajas = findViewById(R.id.txtCantidadCajas);
        txtFechaEntrega = findViewById(R.id.txtFechaEntrega);
        txtComentario = findViewById(R.id.txtComentario);
        txtIdPedido = findViewById(R.id.txtIdPedido);
        lvListaP = findViewById(R.id.lvListaP);

        lvListaP.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int position, long id) {

                filaSeleccionada = position;

                // Llena los campos de texto con la información del pedido seleccionado
                if (filaSeleccionada >= 0 && filaSeleccionada < listaPedidos.size()) {
                    PedidosProveedorLista pedidoSeleccionado = listaPedidos.get(filaSeleccionada);
                    txtIdPedido.setText(String.valueOf(pedidoSeleccionado.getId_pedido()));
                    txtIdUsuario.setText(String.valueOf(pedidoSeleccionado.getId_usuario()));
                    txtFechaPedido.setText(pedidoSeleccionado.getFecha_pedido());
                    txtEstadoCajas.setText(pedidoSeleccionado.getEstado_cajas());
                    txtCantidadCajas.setText(String.valueOf(pedidoSeleccionado.getCantidad_cajas()));
                    txtFechaEntrega.setText(pedidoSeleccionado.getFecha_entrega());
                    txtComentario.setText(pedidoSeleccionado.getComentario());
                } else {
                    Log.e("PedidosProveedor", "Posición seleccionada no válida.");
                }
            }
        });

        servicioConsultarPedidos(Constantes.ipGlobal+"/app/ConsultarPedidosProveedor.php");
    }

    public void servicioConsultarPedidos(String url) {
        JsonArrayRequest consulta = new JsonArrayRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        Log.d("PedidosProveedor", "Número de registros: " + response.length());
                        Toast.makeText(PedidosProveedor.this, "Número de registros: " + response.length(), Toast.LENGTH_SHORT).show();
                        listaPedidos.clear();
                        lista.clear();

                        for (int i = 0; i < response.length(); i++) {
                            try {
                                JSONObject jsonObject = response.getJSONObject(i);
                                PedidosProveedorLista pedidoNuevo = new PedidosProveedorLista();
                                pedidoNuevo.setId_pedido(jsonObject.getInt("id_pedido"));
                                pedidoNuevo.setId_usuario(jsonObject.getInt("id_usuario"));
                                pedidoNuevo.setFecha_pedido(jsonObject.getString("fecha_pedido"));
                                pedidoNuevo.setEstado_cajas(jsonObject.getString("estado_cajas"));
                                pedidoNuevo.setCantidad_cajas(jsonObject.getInt("cantidad_cajas"));
                                pedidoNuevo.setFecha_entrega(jsonObject.getString("fecha_entrega"));
                                pedidoNuevo.setComentario(jsonObject.getString("comentario"));
                                listaPedidos.add(pedidoNuevo);
                                lista.add("Pedido ID: " + pedidoNuevo.getId_usuario());
                            } catch (JSONException e) {
                                Log.e("PedidosProveedor", "Error al procesar datos: " + e.getMessage());
                                Toast.makeText(PedidosProveedor.this, "Error al procesar datos: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                            }
                        }
                        llenarLista();
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.e("PedidosProveedor", "Error de consulta: " + error.getMessage());
                        Toast.makeText(PedidosProveedor.this, "Error de consulta: " + error.getMessage(), Toast.LENGTH_SHORT).show();
                    }
                }
        );
        requestQueue = Volley.newRequestQueue(this);
        requestQueue.add(consulta);
    }

    private void llenarLista() {
        lista.clear();
        for (PedidosProveedorLista pedido : listaPedidos) {
            String detalles = "ID: " + pedido.getId_usuario() + "\n" +
                    "ID pedido: " + pedido.getId_pedido() + "\n" +
                    "Fecha Pedido: " + pedido.getFecha_pedido() + "\n" +
                    "Estado Cajas: " + pedido.getEstado_cajas() + "\n" +
                    "Cantidad: " + pedido.getCantidad_cajas() + "\n" +
                    "Fecha Entrega: " + pedido.getFecha_entrega() + "\n" +
                    "Comentario: " + pedido.getComentario();
            lista.add(detalles);
        }
        ArrayAdapter<String> adaptador = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, lista);
        lvListaP.setAdapter(adaptador);
        Log.d("PedidosProveedor", "Lista llena con " + lista.size() + " elementos.");
    }

    public void VerPedidos(View view) {
        if (filaSeleccionada >= 0 && filaSeleccionada < listaPedidos.size()) {
            String idPedido = txtIdPedido.getText().toString();
            String idUsuario = txtIdUsuario.getText().toString();
            String fechaPedido = txtFechaPedido.getText().toString();
            String estadoCajas = txtEstadoCajas.getText().toString();
            String cantidadCajas = txtCantidadCajas.getText().toString();
            String fechaEntrega = txtFechaEntrega.getText().toString();
            String comentario = txtComentario.getText().toString();

            Intent intent = new Intent(PedidosProveedor.this, Proveedor.class);
            intent.putExtra("id_pedido", idPedido);
            intent.putExtra("id_usuario", idUsuario);
            intent.putExtra("fecha_pedido", fechaPedido);
            intent.putExtra("estado_cajas", estadoCajas);
            intent.putExtra("cantidad_cajas", cantidadCajas);
            intent.putExtra("fecha_entrega", fechaEntrega);
            intent.putExtra("comentario", comentario);

            intent.putExtra("pedidos_visualizados", true);
            startActivity(intent);
        } else {
            Toast.makeText(this, "Seleccione un pedido", Toast.LENGTH_SHORT).show();
        }
    }


    public void Atras(View view) {
        finish();
    }
}



