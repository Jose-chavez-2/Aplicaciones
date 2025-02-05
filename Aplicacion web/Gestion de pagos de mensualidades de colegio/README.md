# Aplicación de Gestión Contable de Pagos de Mensualidades

## Descripción

Esta aplicación permite la gestión de pagos de mensualidades en una institución educativa. Cuenta con diferentes niveles de acceso para el personal administrativo, empleados y padres de familia.  

### Funcionalidades principales:

- **Personal Administrativo**:
  - Gestionar usuarios del personal y encargados (crear, editar, eliminar).
  - Visualizar una hoja de reportes con datos importantes sobre los pagos de mensualidades.
  - Generar reportes en PDF con toda la información de pagos.
  - Gestionar los egresos de la institución (crear, editar, eliminar registros).
  - Visualizar ingresos y egresos totales, incluyendo su diferencia.
  - Representación gráfica de los ingresos y egresos en un gráfico de pastel.
  - Exportar información en PDF.

- **Empleados**:
  - Gestionar usuarios de padres de familia (crear, editar, eliminar).
  - Registrar estudiantes, años lectivos, cursos y matrículas.
  - Procesar pagos de mensualidades.
  - Visualizar datos en listas paginadas y con barra de búsqueda para filtros.

- **Padres de familia**:
  - Consultar el historial de pagos en formato de lista mediante su cedula.
  - Exportar la información de pagos en PDF.

## Tecnologías utilizadas

- **Frontend**: React.js
- **Backend**: PHP
- **Base de Datos**: MySQL

## Instalación y ejecución del proyecto

### Requisitos previos

- Tener instalado **Node.js** y **npm**.
- Tener configurado un servidor local para PHP (XAMPP, WAMP, Laravel Valet, etc.).
- MySQL en funcionamiento.

### Instalación del backend (PHP + MySQL)

1. Clonar el repositorio e ingresar al directorio del backend:  
   cd backend
2. Configurar la base de datos MySQL.

3. Asegurarse de que el archivo de conexión (conexion.php) tenga los datos correctos.


## Instalacion del Frontend (React.js)
1. cd frontend

2. npm install

3. Instalar librerias necesarias
npm install react-router-dom bootstrap react-bootstrap react-icons chart.js axios jspdf jspdf-autotable html2canvas

4. Iniciar el servidor de desarrollo
npm start

## Funcionalidades adicionales: 

1. Uso de Bootstrap para mejorar la interfaz gráfica.

2. Uso de React Router para la navegación entre páginas.

3. Uso de Chart.js para gráficos estadísticos.

4. Uso de jsPDF y html2canvas para exportación de reportes en PDF.
