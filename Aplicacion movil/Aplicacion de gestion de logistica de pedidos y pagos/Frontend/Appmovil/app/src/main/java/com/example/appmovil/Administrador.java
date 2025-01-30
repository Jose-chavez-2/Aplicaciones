package com.example.appmovil;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;


import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;

import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.appmovil.Clases.AdministradorLista;
import com.example.appmovil.Configuraciones.Constantes;

import org.jetbrains.annotations.Nullable;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;


public class Administrador extends AppCompatActivity {

    private RequestQueue requestQueue;
    private ListView lvLista;
    private ArrayList<String> lista = new ArrayList<>();
    private ArrayList<AdministradorLista> listaUsuarios = new ArrayList<>();
    private AdministradorLista usuarioNuevo;

    private TextView txtCedula, txtNombres, txtTipo_usuario, txtEstado;

    private int filaSeleccionada;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_administrador);

        lvLista = findViewById(R.id.lvLista);
        txtCedula = findViewById(R.id.txtCedula);
        txtNombres = findViewById(R.id.txtNombres);
        txtTipo_usuario = findViewById(R.id.txtTipo_usuario);
        txtEstado = findViewById(R.id.txtEstado);

        servicioConsultarTodos(Constantes.ipGlobal+"/app/ConsultarTodo.php");

        lvLista.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int position, long id) {
                AdministradorLista usuarioSeleccionado = listaUsuarios.get(position);
                txtCedula.setText("Cedula: " + usuarioSeleccionado.getCedula());
                txtNombres.setText("Nombre: " + usuarioSeleccionado.getNombres());
                txtTipo_usuario.setText("Tipo: " + usuarioSeleccionado.getTipo_usuario());
                txtEstado.setText("Estado: " + usuarioSeleccionado.getEstado());
                filaSeleccionada = position;
            }
        });
    }

    public void servicioConsultarTodos(String url) {
        JsonArrayRequest consulta = new JsonArrayRequest(url, new Response.Listener<JSONArray>() {
            @Override
            public void onResponse(JSONArray response) {
                Toast.makeText(Administrador.this, "Número de registros: " + response.length(), Toast.LENGTH_SHORT).show();
                listaUsuarios.clear(); // Limpiar lista de usuarios
                lista.clear(); // Limpiar lista de nombres

                for (int i = 0; i < response.length(); i++) {
                    try {
                        JSONObject jsonObject = response.getJSONObject(i);
                        usuarioNuevo = new AdministradorLista();
                        usuarioNuevo.setCedula(jsonObject.getString("cedula"));
                        usuarioNuevo.setNombres(jsonObject.getString("nombres"));
                        usuarioNuevo.setApellidos(jsonObject.getString("apellidos"));
                        usuarioNuevo.setTipo_usuario(jsonObject.getString("tipo_usuario"));
                        usuarioNuevo.setEstado(jsonObject.getString("estado"));
                        listaUsuarios.add(usuarioNuevo);
                        lista.add(usuarioNuevo.getNombres());
                    } catch (JSONException e) {
                        Toast.makeText(Administrador.this, "Error al procesar datos: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                    }
                }
                llenarLista();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(Administrador.this, "Error de consulta: " + error.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
        requestQueue = Volley.newRequestQueue(this);
        requestQueue.add(consulta);
    }
    private void servicioActivarDesactivar(String url, String cedula, String estado) {
        StringRequest servicio = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Toast.makeText(Administrador.this, response, Toast.LENGTH_SHORT).show();

                servicioConsultarTodos(Constantes.ipGlobal+"/app/ConsultarTodo.php");
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(Administrador.this, "Error " + error.toString(), Toast.LENGTH_SHORT).show();
            }
        }) {
            @Nullable
            @Override
            protected Map<String, String> getParams() throws AuthFailureError {
                Map<String, String> parametros = new HashMap<>();
                parametros.put("cedula", cedula);
                parametros.put("estado", estado);
                return parametros;
            }
        };
        requestQueue = Volley.newRequestQueue(this);
        requestQueue.add(servicio);
    }

    private void llenarLista() {
        lista.clear();
        for (AdministradorLista usuario : listaUsuarios) {
            String detalles = "Cédula: " + usuario.getCedula() + "\n" +
                    "Nombres: " + usuario.getNombres() + "\n " +
                    "Tipo: " + usuario.getTipo_usuario() + "\n" +
                    "Estado: " + usuario.getEstado();
            lista.add(detalles);
        }
        ArrayAdapter<String> adaptador = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, lista);
        lvLista.setAdapter(adaptador);
    }

    public void regresar_Lista(View view) {
        finish();
    }

    public void Activar(View view) {
        String cedula = txtCedula.getText().toString().replace("Cedula: ", "");
        String estado = "activo";
        servicioActivarDesactivar(Constantes.ipGlobal+"/app/ActualizarAdministrador.php", cedula, estado);
    }

    public void Desactivar(View view) {
        String cedula = txtCedula.getText().toString().replace("Cedula: ", "");
        String estado = "inactivo";
        servicioActivarDesactivar(Constantes.ipGlobal+"/app/ActualizarAdministrador.php", cedula, estado);
    }
}

