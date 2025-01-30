package com.example.appmovil;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

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


public class MainActivity extends AppCompatActivity {
    private EditText etCedula, etClave;
    private RequestQueue requestQueue;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        etCedula = findViewById(R.id.etUsu);
        etClave = findViewById(R.id.etPas);

    }
    private void validarUsuario(String url){
        StringRequest servicio = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject jsonResponse = new JSONObject(response);
                    boolean success = jsonResponse.getBoolean("success");

                    if (success) {
                        String tipoUsuario = jsonResponse.getString("tipo_usuario");
                        Intent intent;
                        if (tipoUsuario.equals("proveedor")) {
                            intent = new Intent(getApplicationContext(), MenuProveedor.class);
                        } else if (tipoUsuario.equals("administrador")) {
                            intent = new Intent(getApplicationContext(), MenuAdministrador.class);
                        } else {
                            Toast.makeText(MainActivity.this, "Tipo de usuario desconocido", Toast.LENGTH_SHORT).show();
                            return;
                        }
                        String usuario = etCedula.getText().toString();
                        intent.putExtra("usuario", usuario);

                        startActivity(intent);
                    } else {
                        String message = jsonResponse.getString("message");
                        if (message.equals("Usuario inactivo")) {
                            Toast.makeText(MainActivity.this, "El usuario está inactivo", Toast.LENGTH_SHORT).show();
                        } else {
                            Toast.makeText(MainActivity.this, "Usuario o contraseña incorrecta", Toast.LENGTH_SHORT).show();
                        }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                    Toast.makeText(MainActivity.this, "Error en la respuesta del servidor", Toast.LENGTH_SHORT).show();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(MainActivity.this, "Error " + error.toString(), Toast.LENGTH_SHORT).show();
            }
        }) {
            @Nullable
            @Override
            protected Map<String, String> getParams() throws AuthFailureError {
                Map<String, String> parametros = new HashMap<>();
                parametros.put("cedula", etCedula.getText().toString());
                parametros.put("clave", etClave.getText().toString());
                return parametros;
            }
        };
        requestQueue = Volley.newRequestQueue(this);
        requestQueue.add(servicio);
    }


    public void Ingresar(View view) {
        validarUsuario(Constantes.ipGlobal+"/app/Login.php");
    }

    public void Registrarse(View view) {
        Intent intento = new Intent(MainActivity.this, registro.class);
        startActivity(intento);
    }

    public void Salir(View view) {
        finish();
    }
}


