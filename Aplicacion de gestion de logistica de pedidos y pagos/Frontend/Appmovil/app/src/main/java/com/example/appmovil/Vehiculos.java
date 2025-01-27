package com.example.appmovil;

import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
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

import java.util.HashMap;
import java.util.Map;

public class Vehiculos extends AppCompatActivity {
    private EditText etMarca, etModelo, etPlaca, etCapacidadCarga, etAFabrica, etColor, etCombustible, etEstado;
    private RequestQueue requestQueue;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_vehiculos);
        etMarca = findViewById(R.id.etMarca);
        etModelo = findViewById(R.id.etModelo);
        etPlaca = findViewById(R.id.etPlaca);
        etCapacidadCarga = findViewById(R.id.etCapacidadCarga);
        etAFabrica = findViewById(R.id.etAFabrica);
        etColor = findViewById(R.id.etColor);
        etCombustible = findViewById(R.id.etCombustible);
        //etNumeroIdentificacion = findViewById(R.id.etNumeroIdentificacion);
        //etFechaMatriculacion = findViewById(R.id.etFechaMatriculacion);
        etEstado = findViewById(R.id.etEstado);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        requestQueue = Volley.newRequestQueue(this);

    }
    private void servicioGuardarVehiculos(String url) {
        StringRequest servicio = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Toast.makeText(Vehiculos.this, "Guardado", Toast.LENGTH_SHORT).show();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(Vehiculos.this, "Error " + error.toString(), Toast.LENGTH_SHORT).show();
            }
        }) {
            @Nullable
            @Override
            protected Map<String, String> getParams() throws AuthFailureError {
                Map<String, String> parametros = new HashMap<>();
                parametros.put("marca", etMarca.getText().toString());
                parametros.put("modelo", etModelo.getText().toString());
                parametros.put("placa", etPlaca.getText().toString());
                parametros.put("capacidad_carga", etCapacidadCarga.getText().toString());
                parametros.put("ano_fabricacion", etAFabrica.getText().toString());
                parametros.put("color", etColor.getText().toString());
                parametros.put("combustible", etCombustible.getText().toString());
                //parametros.put("numero_identificacion", etNumeroIdentificacion.getText().toString());
                //parametros.put("fecha_matriculacion", etFechaMatriculacion.getText().toString());
                parametros.put("estado", etEstado.getText().toString());
                return parametros;
            }
        };
        requestQueue.add(servicio);
    }

    public void guardar_Vehiculo(View view) {
        servicioGuardarVehiculos(Constantes.ipGlobal+"/app/GuardarVehiculos.php");
    }

    public void regresar_Vehiculos(View view) {
        finish();
    }
}