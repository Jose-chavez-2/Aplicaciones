import React from "react";
import Header3 from "../Plantilla/Header3";
import '../assets/css/ListaPersonal.css';
import { urlApi } from '../services/apirest';
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';
import jsPDF from "jspdf";
import "jspdf-autotable";

let pagina = 1;
let cadena = "";

class ListaReporte extends React.Component {
    state = {
        Reporte: [], // Inicializado como array vacío
        num_paginas: 0,
        totalCantidadPagada: 0,
        cedula: null // Cédula capturada desde las props
    };

    componentDidMount = () => {
        const queryParams = new URLSearchParams(this.props.location.search);
        const cedula = queryParams.get('cedula');

        console.log("Cedula recibida:", cedula); // Verifica si la cédula está siendo capturada
        this.setState({ cedula }, this.fetchUsuarios);
    };

    fetchUsuarios = async () => {
        const url = `${urlApi}pagoPadres.php?page=${pagina}&cadena=${cadena}&cedula=${this.state.cedula}`;
        try {
            const response = await axios.get(url);
            console.log(response.data);
            this.setState({
                Reporte: response.data[0] || [],
                num_paginas: response.data[1] || 0
            });
            const total = response.data[0]?.reduce((acc, item) => acc + parseFloat(item.monto_pagado || 0), 0) || 0;
            this.setState({ totalCantidadPagada: total });
        } catch (error) {
            console.error("Error fetching users:", error);
            this.setState({ Reporte: [] });
        }
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

    generarPDF = () => {
        const doc = new jsPDF('p', 'mm', 'a4');
        const fechaHoraActual = new Date();
        const fechaFormateada = fechaHoraActual.toLocaleString();
    
        // Columnas de la tabla
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
            "Paralelo"
        ];
    
        // Filas de la tabla (extraídas de this.state.Reporte)
        const tableRows = this.state.Reporte.map(value => [
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
            value.paralelo_nombre
        ]);
    
        // Establecer título y evitar espacio innecesario
        doc.setFontSize(14); // Ajuste del tamaño de fuente
        doc.text("Reporte de Pagos", 14, 10); // Cambié la coordenada Y a 10 para que no haya espacio arriba
    
        // Ajustar startY de la tabla para que comience justo después del título
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
    
        // Añadir la fecha y total, asegurándonos de que no se superpongan con la tabla
        doc.setFontSize(10);
        doc.text(fechaFormateada, 14, doc.lastAutoTable.finalY + 10); // La fecha se coloca después de la tabla
        doc.text(`Total Cantidad Pagada: ${this.state.totalCantidadPagada}`, 14, doc.lastAutoTable.finalY + 20); // El total se coloca después de la fecha
    
        // Guardar el PDF
        doc.save("ReportePagos.pdf");
    };
    

    render() {
        return (
            <div>
                <Header3 />
                <heder>
                    <h1>Lista de sus pagos</h1>
                </heder>
                <div className="container">
                    <p><strong>Cédula:</strong> {this.state.cedula}</p> {/* Mostrar la cédula en la interfaz */}
                    <button type="button" className="btn btn-secondary" onClick={this.generarPDF} style={{ marginRight: "10px" }}>Exportar a PDF</button>
                    <input type="text" onKeyPress={this.buscarTexto} />
                    <div className="container">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Nombres del estudiante</th>
                                    <th>Apellido del estudiantes</th>
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
    const location = useLocation(); // Para acceder a la URL
    return <ListaReporte navigate={navigate} location={location} />;
}

export default ListaReporteWrapper;

