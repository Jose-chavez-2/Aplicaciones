package com.example.appmovil.Conexiones;

import android.widget.Toast;

import androidx.annotation.Nullable;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.example.appmovil.Suministros;

import java.util.HashMap;
import java.util.Map;

public class Servicio {
    public static void servicioGuardar(String url, String tipoServicio) {
            /*StringRequest servicio = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {
                    Toast.makeText(Suministros.class, "Guardado", Toast.LENGTH_SHORT).show();
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Toast.makeText(Suministros.this, "Error " + error.toString(), Toast.LENGTH_SHORT).show();
                }
            }) {
                @Nullable
                @Override
                protected Map<String, String> getParams() throws AuthFailureError {
                    Map<String, String> parametros = new HashMap<>();

                    // Parámetros comunes
                    parametros.put("id_usuario", etIdUsuarioSuministros.getText().toString());

                    // Parámetros según el tipo de servicio
                    if (tipoServicio.equals("suministros")) {
                        parametros.put("nombre_suministro", etNombresSuministro.getText().toString());
                        parametros.put("cantidad", etCantidad.getText().toString());
                        parametros.put("fecha_suministro", etFecha.getText().toString());
                    } else if (tipoServicio.equals("proveedor")) {
                        parametros.put("fecha_pedido", etFechaPedido.getText().toString());
                        parametros.put("estado_cajas", etEstadoCaja.getText().toString());
                        parametros.put("cantidad_cajas", etCantidadCajas.getText().toString());
                        parametros.put("fecha_entrega", etFechaEntrega.getText().toString());
                        parametros.put("comentario", etComentario.getText().toString());
                    }

                    return parametros;
                }
            };

            requestQueue.add(servicio);*/

    }
}
