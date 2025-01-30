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

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

public class Suministros extends AppCompatActivity {
    private EditText etIdUsuarioSuministros,etNombresSuministro,etCantidad,etFecha;
    private RequestQueue requestQueue;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_suministros);
        etIdUsuarioSuministros = findViewById(R.id.etIdUsuarioSuministros);
        etNombresSuministro = findViewById(R.id.etNombresSuministro);
        etCantidad = findViewById(R.id.etCantidad);
        etFecha = findViewById(R.id.etFecha);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        requestQueue = Volley.newRequestQueue(this);

        Calendar currentDate = Calendar.getInstance();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd", Locale.getDefault());
        etFecha.setText(dateFormat.format(currentDate.getTime()));
    }
    private void servicioGuardarSuministros(String url) {
        StringRequest servicio = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Toast.makeText(Suministros.this, "Guardado", Toast.LENGTH_SHORT).show();
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
                parametros.put("id_usuario", etIdUsuarioSuministros.getText().toString());
                parametros.put("nombre_suministro", etNombresSuministro.getText().toString());
                parametros.put("cantidad", etCantidad.getText().toString());
                parametros.put("fecha_suministro", etFecha.getText().toString());
                return parametros;
            }
        };
        requestQueue.add(servicio);
    }

    public void guardar_Suministros(View view) {
        servicioGuardarSuministros(Constantes.ipGlobal+"/app/GuardarSuministros.php");
    }

    public void regresar_menu(View view) {
        finish();
    }
}