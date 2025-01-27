package com.example.appmovil;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
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


import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import android.util.Base64;


public class EnvioPagos extends AppCompatActivity {

    private static final int PICK_IMAGE_REQUEST = 1;
    private Bitmap imagenEvidencia;
    private RequestQueue requestQueue;
    private TextView txtIdPedido, txtIdUsuario, txtNumeroCuenta, txtNombres, txtApellidos;
    private EditText etFechaPago, etMonto, etComentario;
    private ImageView ivImagenEvidencia;
    private Button btSeleccionar, btGuardar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_envio_pagos);

        txtIdPedido = findViewById(R.id.txtIdPedido);
        txtIdUsuario = findViewById(R.id.txtIdUsuario);
        txtNumeroCuenta = findViewById(R.id.txtNumeroCuenta);
        txtNombres = findViewById(R.id.txtNombres);
        txtApellidos = findViewById(R.id.txtApellidos);
        etFechaPago = findViewById(R.id.etFechaPago);
        etMonto = findViewById(R.id.etMonto);
        etComentario = findViewById(R.id.etComentario);
        ivImagenEvidencia = findViewById(R.id.ivImagenEvidencia);
        btSeleccionar = findViewById(R.id.btSelecionar);
        btGuardar = findViewById(R.id.btGuardar);

        requestQueue = Volley.newRequestQueue(this);

        // Obtener los datos pasados desde el intent
        Intent intent = getIntent();
        String pedidoID = intent.getStringExtra("id_pedido");
        String usuarioID = intent.getStringExtra("id_usuario");
        String numeroCuenta = intent.getStringExtra("numero_cuenta");
        String nombres = intent.getStringExtra("nombres");
        String apellidos = intent.getStringExtra("apellidos");

        txtIdPedido.setText(pedidoID);
        txtIdUsuario.setText(usuarioID);
        txtNumeroCuenta.setText(numeroCuenta);
        txtNombres.setText(nombres);
        txtApellidos.setText(apellidos);

        // Pedir permisos de almacenamiento en tiempo de ejecución
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, 1);
        }

        // Configurar el botón de seleccionar imagen
        btSeleccionar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                abrirGaleria();
            }
        });

        // Configurar el botón de guardar pago
        btGuardar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                guardar_pagos(Constantes.ipGlobal+"/app/GuardarPagos.php");
            }
        });

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        Calendar currentDate = Calendar.getInstance();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd", Locale.getDefault());
        etFechaPago.setText(dateFormat.format(currentDate.getTime()));
    }

    // Método para abrir la galería y seleccionar una imagen
    private void abrirGaleria() {
        Intent intent = new Intent(Intent.ACTION_PICK, android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        startActivityForResult(intent, PICK_IMAGE_REQUEST);
    }

    // Método que maneja la imagen seleccionada
    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == RESULT_OK && requestCode == PICK_IMAGE_REQUEST && data != null && data.getData() != null) {
            Uri imageUri = data.getData();
            try {
                imagenEvidencia = MediaStore.Images.Media.getBitmap(this.getContentResolver(), imageUri);
                ivImagenEvidencia.setImageBitmap(imagenEvidencia); // Mostrar la imagen seleccionada
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    // Método para convertir una imagen Bitmap a una cadena en Base64
    private String convertirImagenBase64(Bitmap bitmap) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        // Cambiar la compresión a JPEG con calidad 90
        bitmap.compress(Bitmap.CompressFormat.JPEG, 90, byteArrayOutputStream);

        byte[] byteArray = byteArrayOutputStream.toByteArray();
        return Base64.encodeToString(byteArray, Base64.DEFAULT);
    }


    // Método para enviar los datos del pago, incluyendo la imagen, al servidor
    private void guardar_pagos(String url) {
        StringRequest servicio = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Toast.makeText(EnvioPagos.this, "Guardado", Toast.LENGTH_SHORT).show();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(EnvioPagos.this, "Error " + error.toString(), Toast.LENGTH_SHORT).show();
            }
        }) {
            @Nullable
            @Override
            protected Map<String, String> getParams() throws AuthFailureError {
                Map<String, String> parametros = new HashMap<>();
                parametros.put("pedido_id", txtIdPedido.getText().toString());
                parametros.put("fecha_pedido", etFechaPago.getText().toString());
                parametros.put("monto", etMonto.getText().toString());

                // Convertir la imagen a base64 y enviarla en el parámetro 'evidencia_pago'
                if (imagenEvidencia != null) {
                    String imagenBase64 = convertirImagenBase64(imagenEvidencia);

                    // Aquí es donde puedes añadir el Log para verificar la conversión a Base64
                    Log.d("EnvioPagos", "Imagen Base64: " + imagenBase64);

                    parametros.put("evidencia_pago", imagenBase64);
                } else {
                    parametros.put("evidencia_pago", "");
                }

                parametros.put("comentario", etComentario.getText().toString());
                return parametros;
            }
        };
        requestQueue.add(servicio);
    }


    public void Regresar_EP(View view) {
        finish();
    }
}

