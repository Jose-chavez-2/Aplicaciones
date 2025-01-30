import React from "react";
import Header from "../Plantilla/Header";
import '../assets/css/ListaPersonal.css';
import { urlApi } from '../services/apirest';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import jsPDF from "jspdf";
import "jspdf-autotable";

let pagina = 1;
let cadena = "";

class ListaReporte extends React.Component {
    state = {
        Reporte: [],
        num_paginas: 0,
        totalCantidadPagada: 0 // Total global de los pagos
    }

    componentDidMount = () => {
        const token = sessionStorage.getItem("token"); // Validar si el token está presente
            if (token === null) {
                this.props.navigate('/'); // Redirigir al inicio de sesión si no hay token
                return; // Detener la ejecución si no hay token
            }
        this.fetchUsuarios();
    }

    fetchUsuarios = async () => {
        const url = `${urlApi}Reporte.php?page=${pagina}&cadena=${cadena}`;
        try {
            const response = await axios.get(url);
            this.setState({
                Reporte: response.data[0],
                num_paginas: response.data[1]
            });

            // Calcular el total de la página actual
            const total = response.data[0].reduce((acc, item) => acc + parseFloat(item.monto_pagado || 0), 0);
            this.setState({ totalCantidadPagada: total });

            if (pagina > response.data[1][0]?.numpag) {
                this.paginaAnterior();
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    fetchAllPages = async () => {
        let allData = [];
        let totalSum = 0;
        let currentPage = 1;

        while (true) {
            const url = `${urlApi}Reporte.php?page=${currentPage}&cadena=${cadena}`;
            try {
                const response = await axios.get(url);
                const data = response.data[0];
                const numPages = response.data[1][0]?.numpag || 0;

                // Concatenar los datos de la página actual
                allData = allData.concat(data);

                // Sumar el monto de los pagos de la página actual
                totalSum += data.reduce((acc, item) => acc + parseFloat(item.monto_pagado || 0), 0);

                // Detener si es la última página
                if (currentPage >= numPages) break;

                currentPage++;
            } catch (error) {
                console.error("Error fetching all pages:", error);
                break;
            }
        }

        return { allData, totalSum };
    };

    generarPDF = async () => {
        const doc = new jsPDF('p', 'mm', 'a4'); // Tamaño de página A4 en milímetros
        const fechaHoraActual = new Date();
        const fechaFormateada = fechaHoraActual.toLocaleString();

        const tableColumn = [
            "Nombre de estudiante",
            "Apellido de estudiante",
            "Nombre de padres",
            "Apellidos de padres",
            "Usuario del personal",
            "Fecha de pago",
            "Cantidad pagada",
            "Tipo de pago",
            "Pensión a pagar",
            "Curso",
            "Paralelo",
            "Año lectivo",
            "Estado"
        ];

        // Obtener todos los datos de todas las páginas
        const { allData, totalSum } = await this.fetchAllPages();

        const tableRows = allData.map(value => [
            value.estudiante_nombre,
            value.estudiante_apellido,
            value.padre_nombre,
            value.padre_apellido,
            value.usuario_nombre,
            value.fecha_pago,
            value.monto_pagado,
            value.tipo_pago,
            value.pension_mensual,
            value.curso_nombre,
            value.paralelo_nombre,
            value.nombre_lectivo,
            value.estudiante_estado
        ]);

         // Establecer título y evitar espacio innecesario
         doc.setFontSize(14); // Ajuste del tamaño de fuente
         doc.text("Reporte de Pagos", 14, 10); // Cambié la coordenada Y a 10 para que no haya espacio arriba
     

        // Añadir la tabla con estilo compacto
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20, // Se ajusta el inicio de la tabla después del título
            styles: {
                fontSize: 8,
                cellPadding: 2,
                halign: 'center',
                valign: 'middle'
            },
            margin: { top: 10, left: 10, right: 10 },
            tableWidth: 'auto',
        });

        // Guardar el archivo PDF
        doc.setFontSize(10);
        doc.text(fechaFormateada, 14, 80);
        doc.text(`Total Cantidad Pagada: ${totalSum.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);

        doc.save("ReportePagos.pdf");
    };

    paginaSiguiente = () => {
        const num_p = this.state.num_paginas[0]?.numpag || 0;
        if (num_p > pagina) {
            pagina += 1;
            this.fetchUsuarios();
        }
    };

    paginaAnterior = () => {
        if (pagina > 1) {
            pagina -= 1;
            this.fetchUsuarios();
        }
    };

    buscarTexto = (e) => {
        if (e.charCode === 13) {
            pagina = 1;
            cadena = e.target.value;
            this.fetchUsuarios();
        }
    };

    render() {
        return (
            <div>
                <Header />
                <heder>
                    <h1>Reporte de pagos</h1>
                </heder>
                <div className="container">
                    <button type="button" className="btn btn-secondary" onClick={this.generarPDF} style={{ marginRight: "10px" }}>Exportar a PDF</button>
                    <input type="text" onKeyPress={this.buscarTexto} />
                    <div className="container">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Nombre de estudiante</th>
                                    <th>Apellido de estudiantes</th>
                                    <th>Nombre de padres</th>
                                    <th>Apellidos de padres</th>
                                    <th>Usuario del personal</th>
                                    <th>Fecha de pago</th>
                                    <th>Cantidad pagada</th>
                                    <th>Tipo de pago</th>
                                    <th>Pensión a pagar</th>
                                    <th>Curso</th>
                                    <th>Paralelo</th>
                                    <th>Año lectivo</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.Reporte.map((value, index) => (
                                    <tr key={index}>
                                        <td>{value.estudiante_nombre}</td>
                                        <td>{value.estudiante_apellido}</td>
                                        <td>{value.padre_nombre}</td>
                                        <td>{value.padre_apellido}</td>
                                        <td>{value.usuario_nombre}</td>
                                        <td>{value.fecha_pago}</td>
                                        <td>{value.monto_pagado}</td>
                                        <td>{value.tipo_pago}</td>
                                        <td>{value.pension_mensual}</td>
                                        <td>{value.curso_nombre}</td>
                                        <td>{value.paralelo_nombre}</td>
                                        <td>{value.nombre_lectivo}</td>
                                        <td>{value.estudiante_estado}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <tr>
                            <td colSpan="6"></td>
                            <td><strong>Total:</strong> {this.state.totalCantidadPagada}</td>
                            <td colSpan="4"></td>
                        </tr>
                        <nav>
                            <center>
                                <button type="button" onClick={this.paginaAnterior} style={{ marginRight: "10px" }} className="btn btn-success">{"< "}Anterior</button>
                                <input type="text" value={`${pagina} de ${this.state.num_paginas[0]?.numpag || 0}`} readOnly style={{ marginRight: "10px", width: "120px", textAlign: "center" }} />
                                <button type="button" onClick={this.paginaSiguiente} style={{ marginRight: "10px" }} className="btn btn-success">Siguiente{" >"}</button>
                            </center>
                        </nav>
                    </div>
                </div>
            </div>
        );
    }
}

function ListaReporteWrapper() {
    const navigate = useNavigate();
    return <ListaReporte navigate={navigate} />;
}

export default ListaReporteWrapper;