package com.example.appmovil;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Typeface;
import android.graphics.pdf.PdfDocument;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;
import android.widget.TableLayout;
import android.widget.TableRow;
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
import com.example.appmovil.Clases.PedidosProveedorLista;
import com.example.appmovil.Configuraciones.Constantes;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;

public class Reportes extends AppCompatActivity {
    private RequestQueue requestQueue;
    private ListView lvListaP;
    private ArrayList<String> lista = new ArrayList<>();
    private TableLayout tableLayout;
    private ArrayList<PedidosProveedorLista> listaPedidos = new ArrayList<>();
    private int filaSeleccionada = -1;
    private Button btnGenerarPDF;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_reportes);
        btnGenerarPDF = findViewById(R.id.btnGenerarPDF);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        servicioConsultarPedidos(Constantes.ipGlobal+"/app/Reportes.php");

        Button btnGenerarPDF = findViewById(R.id.btnGenerarPDF);
        btnGenerarPDF.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                generatePdfFromTable();  // Llamar al método para generar el PDF
            }
        });

    }

    public void servicioConsultarPedidos(String url) {
        JsonArrayRequest consulta = new JsonArrayRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        Log.d("Reportes", "Número de registros: " + response.length());
                        Toast.makeText(Reportes.this, "Número de registros: " + response.length(), Toast.LENGTH_SHORT).show();
                        listaPedidos.clear();
                        lista.clear();

                        for (int i = 0; i < response.length(); i++) {
                            try {
                                JSONObject jsonObject = response.getJSONObject(i);
                                PedidosProveedorLista pedidoNuevo = new PedidosProveedorLista();
                                pedidoNuevo.setId_usuario(jsonObject.getInt("id_usuario"));
                                pedidoNuevo.setNombres(jsonObject.getString("nombres"));
                                pedidoNuevo.setFecha_entrega(jsonObject.getString("fecha_entrega"));
                                pedidoNuevo.setCantidad_cajas(jsonObject.getInt("cantidad_cajas"));
                                listaPedidos.add(pedidoNuevo);
                                lista.add("usuario ID: " + pedidoNuevo.getId_usuario());
                            } catch (JSONException e) {
                                Log.e("Reportes", "Error al procesar datos: " + e.getMessage());
                                Toast.makeText(Reportes.this, "Error al procesar datos: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                            }
                        }
                        llenarLista();
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.e("Reportes", "Error de consulta: " + error.getMessage());
                        Toast.makeText(Reportes.this, "Error de consulta: " + error.getMessage(), Toast.LENGTH_SHORT).show();
                    }
                }
        );
        requestQueue = Volley.newRequestQueue(this);
        requestQueue.add(consulta);
    }

    private void llenarLista() {
        TableLayout tableLayout = findViewById(R.id.tableLayout);
        tableLayout.removeAllViews(); // Limpiar las filas anteriores si es necesario

        // Establecer la configuración de la tabla para las divisiones
        tableLayout.setStretchAllColumns(true);
        tableLayout.setShrinkAllColumns(true);

        // Agregar encabezados de columna con color
        TableRow headerRow = new TableRow(this);
        headerRow.setBackgroundColor(Color.GRAY); // Color de fondo para los encabezados

        headerRow.addView(createTextView("ID", true));
        headerRow.addView(createTextView("Nombres", true));
        headerRow.addView(createTextView("Fecha Entrega", true));
        headerRow.addView(createTextView("Cantidad Cajas", true));
        tableLayout.addView(headerRow);

        // Llenar la tabla con los datos
        for (PedidosProveedorLista pedido : listaPedidos) {
            TableRow tableRow = new TableRow(this);

            // Agregar una línea divisoria para cada celda (usando fondo con borde)


            tableRow.addView(createTextView(String.valueOf(pedido.getId_usuario()), false));
            tableRow.addView(createTextView(pedido.getNombres(), false));
            tableRow.addView(createTextView(pedido.getFecha_entrega(), false));
            tableRow.addView(createTextView(String.valueOf(pedido.getCantidad_cajas()), false));

            tableLayout.addView(tableRow);
        }
    }

    // Método para crear un TextView con estilo para las celdas de la tabla
    private TextView createTextView(String text, boolean isHeader) {
        TextView textView = new TextView(this);
        textView.setText(text);
        textView.setPadding(16, 16, 16, 16);
        textView.setGravity(Gravity.CENTER);

        // Si es un encabezado, darle un estilo diferente
        if (isHeader) {
            textView.setBackgroundColor(Color.LTGRAY); // Fondo gris claro para encabezado
            textView.setTextColor(Color.WHITE);        // Texto blanco
            textView.setTypeface(null, Typeface.BOLD); // Texto en negrita
        } else {
            textView.setBackgroundColor(Color.WHITE); // Fondo blanco para las celdas
            textView.setTextColor(Color.BLACK);       // Texto negro
        }

        return textView;
    }

    public void generatePdfFromTable() {
        // Crear un documento PDF
        PdfDocument pdfDocument = new PdfDocument();

        // Crear una página en el PDF
        PdfDocument.PageInfo pageInfo = new PdfDocument.PageInfo.Builder(450, 600, 1).create();  // Ajustar el ancho total
        PdfDocument.Page page = pdfDocument.startPage(pageInfo);
        Canvas canvas = page.getCanvas();
        Paint paint = new Paint();
        paint.setTextSize(12);  // Aumentar el tamaño de la fuente para mejorar la legibilidad

        // Coordenadas iniciales (posiciones) para dibujar las celdas en el PDF
        int startX = 10;  // Posición inicial en X
        int startY = 25;  // Posición inicial en Y
        int rowHeight = 30;  // Altura entre filas

        // Anchos de cada columna
        int idColumnWidth = 50;          // Ancho de la columna ID
        int nameColumnWidth = 150;       // Ancho de la columna Nombres
        int dateColumnWidth = 150;       // Ancho de la columna Fecha Entrega
        int quantityColumnWidth = 100;   // Ancho de la columna Cantidad de Cajas

        // Cambiar el color de texto para el encabezado
        paint.setColor(Color.BLACK);  // Texto negro para el encabezado

        // Obtener la tabla desde el layout
        TableLayout tableLayout = findViewById(R.id.tableLayout);

        // Iterar a través de las filas de la tabla
        for (int i = 0; i < tableLayout.getChildCount(); i++) {
            TableRow tableRow = (TableRow) tableLayout.getChildAt(i);

            // Cambiar color del encabezado si es la primera fila
            if (i == 0) {
                // Dibujar fondo para el encabezado (opcional)
                paint.setColor(Color.LTGRAY);  // Color gris claro para el fondo
                canvas.drawRect(startX, startY - rowHeight + 10, startX + idColumnWidth + nameColumnWidth + dateColumnWidth + quantityColumnWidth, startY + 10, paint);

                // Cambiar color de texto a blanco para el encabezado
                paint.setColor(Color.WHITE);
            } else {
                // Restablecer color para el contenido
                paint.setColor(Color.BLACK);
            }

            // Iterar a través de las celdas de la fila
            for (int j = 0; j < tableRow.getChildCount(); j++) {
                TextView cell = (TextView) tableRow.getChildAt(j);

                // Dibujar el texto de la celda en el PDF
                String cellText = cell.getText().toString();

                // Ajustar la posición de cada celda según la columna
                if (j == 0) {
                    // Columna ID
                    canvas.drawText(cellText, startX, startY, paint);
                } else if (j == 1) {
                    // Columna Nombres
                    canvas.drawText(cellText, startX + idColumnWidth, startY, paint);
                } else if (j == 2) {
                    // Columna Fecha Entrega
                    canvas.drawText(cellText, startX + idColumnWidth + nameColumnWidth, startY, paint);
                } else if (j == 3) {
                    // Columna Cantidad de Cajas
                    canvas.drawText(cellText, startX + idColumnWidth + nameColumnWidth + dateColumnWidth, startY, paint);
                }
            }

            // Aumentar la coordenada Y para la siguiente fila
            startY += rowHeight;
        }

        // Finalizar la página
        pdfDocument.finishPage(page);

        // Guardar el documento en el directorio de descargas
        String fileName = "reporte_pedidos.pdf";

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            ContentValues contentValues = new ContentValues();
            contentValues.put(MediaStore.MediaColumns.DISPLAY_NAME, fileName);
            contentValues.put(MediaStore.MediaColumns.MIME_TYPE, "application/pdf");
            contentValues.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);

            ContentResolver contentResolver = getContentResolver();
            Uri uri = contentResolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, contentValues);

            try {
                if (uri != null) {
                    OutputStream outputStream = contentResolver.openOutputStream(uri);
                    pdfDocument.writeTo(outputStream);
                    outputStream.close();
                    Toast.makeText(this, "PDF generado y guardado en descargas.", Toast.LENGTH_LONG).show();
                }
            } catch (IOException e) {
                e.printStackTrace();
                Toast.makeText(this, "Error al generar PDF: " + e.getMessage(), Toast.LENGTH_SHORT).show();
            }
        } else {
            // Para versiones anteriores a Android 10
            File file = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), fileName);
            try {
                pdfDocument.writeTo(new FileOutputStream(file));
                Toast.makeText(this, "PDF generado en " + file.getAbsolutePath(), Toast.LENGTH_LONG).show();
            } catch (IOException e) {
                e.printStackTrace();
                Toast.makeText(this, "Error al generar PDF: " + e.getMessage(), Toast.LENGTH_SHORT).show();
            }
        }

        // Cerrar el documento
        pdfDocument.close();
    }

    public void Atras(View view) {
        finish();
    }
}