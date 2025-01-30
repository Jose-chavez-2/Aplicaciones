package com.example.appmovil;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.appmovil.Configuraciones.Constantes;

import org.jetbrains.annotations.Nullable;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class registro extends AppCompatActivity {
    ArrayList<String > listaEstado =new ArrayList<>();
    ArrayList<String > listaUsuario =new ArrayList<>();
    private EditText etCedula,etNombres,etApellidos,etTelefono,etDireccion,etDistancia,etClave;
    private Spinner spEstado,spTipoUsuario;
    private RequestQueue requestQueue;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_registro);
        etCedula=findViewById(R.id.etCedula);
        etNombres=findViewById(R.id.etNombres);
        etApellidos=findViewById(R.id.etApellidos);
        etTelefono=findViewById(R.id.etTelefono);
        etDireccion=findViewById(R.id.etDireccion);
        etDistancia=findViewById(R.id.etDistancia);
        spTipoUsuario=findViewById(R.id.spTipoUsuario);
        spEstado=findViewById(R.id.spEstado);
        etClave=findViewById(R.id.etClave);
        cargarEstado();
        cargarTipoUsuario();

        ArrayAdapter<CharSequence> adaptadorEstado =new ArrayAdapter(this, android.R.layout.simple_list_item_1,listaEstado);
        spEstado.setAdapter(adaptadorEstado);

        ArrayAdapter<CharSequence> adaptadorUsuario =new ArrayAdapter(this, android.R.layout.simple_list_item_1,listaUsuario);
        spTipoUsuario.setAdapter(adaptadorUsuario);
    }
    private void cargarEstado(){
        listaEstado.add("inactivo");
    }
    private void cargarTipoUsuario(){
        listaUsuario.add("proveedor");
    }
    private void servicioGuardar(String url){
        StringRequest servicio = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Toast.makeText(registro.this, "Guardado", Toast.LENGTH_SHORT).show();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(registro.this, "Error " + error.toString(), Toast.LENGTH_SHORT).show();
            }
        }) {
            @Nullable
            @Override
            protected Map<String, String> getParams() throws AuthFailureError {
                Map<String, String> parametros = new HashMap<String, String>();
                parametros.put("cedula", etCedula.getText().toString());
                parametros.put("nombres", etNombres.getText().toString());
                parametros.put("apellidos", etApellidos.getText().toString());
                parametros.put("telefono", etTelefono.getText().toString());
                parametros.put("direccion", etDireccion.getText().toString());
                parametros.put("distancia_km", etDistancia.getText().toString());
                parametros.put("tipo_usuario", spTipoUsuario.getSelectedItem().toString());
                parametros.put("estado", spEstado.getSelectedItem().toString());
                parametros.put("clave", etClave.getText().toString());
                return parametros;
            }
        };
        requestQueue = Volley.newRequestQueue(this);
        requestQueue.add(servicio);
    }

    public void Guardar(View view) {
        servicioGuardar(Constantes.ipGlobal+"/app/Registrar.php");
    }

    public void regresar(View view) {
        finish();
    }
}