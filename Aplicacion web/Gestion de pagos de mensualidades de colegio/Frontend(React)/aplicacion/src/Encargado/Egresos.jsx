import React from "react";
import Header from "../Plantilla/Header";
import '../assets/css/ListaPersonal.css';
import { urlApi } from '../services/apirest';
import axios from "axios";
import { confirm } from "../Confirmation";
import { useNavigate } from 'react-router-dom';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import html2canvas from "html2canvas";

// Registrar los componentes necesarios de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

let pagina = 1;
let pagina2 = 1;
let cadena = "";
let cadena2 = "";

// Función para pasar navigate como prop

class Egresos extends React.Component {
    state = {
        egresos: [],
        ingresos: [],
        num_paginas: 0,
        num_paginas2: 0,
        totalEgresos: 0, // Total de egresos (monto)
        totalIngresos: 0, // Total de ingresos (monto_pagado)
        diferencia: 0 // Diferencia entre ingresos y egresos
    }

    componentDidMount = () => {
        const token = sessionStorage.getItem("token"); // Validar si el token está presente
        if (token === null) {
            this.props.navigate('/'); // Redirigir al inicio de sesión si no hay token
            return; // Detener la ejecución si no hay token
        }
        this.fetchUsuarios();
        this.fetchIngresos();
    }

    fetchUsuarios = async () => {
       
        const url = `${urlApi}egresos.php?page=${pagina}&cadena=${cadena}`;
        try {
            const response = await axios.get(url);
            const totalEgresos = response.data[0].reduce((acc, item) => acc + parseFloat(item.monto || 0), 0);
            this.setState((prevState) => ({
                egresos: response.data[0],
                num_paginas: response.data[1],
                totalEgresos,
                diferencia: prevState.totalIngresos - totalEgresos // Calcula la diferencia
            }));
            if (pagina > response.data[1][0]?.numpag) {
                this.paginaAnterior();
            }
        } catch (error) {
            console.error("Error fetching egresos:", error);
        }
    };

    fetchIngresos = async () => {
        const url = `${urlApi}ingreso.php?page=${pagina2}&cadena=${cadena2}`;
        try {
            const response = await axios.get(url);
            const totalIngresos = response.data[0].reduce((acc, item) => acc + parseFloat(item.monto_pagado || 0), 0);
            this.setState((prevState) => ({
                ingresos: response.data[0],
                num_paginas2: response.data[1],
                totalIngresos,
                diferencia: totalIngresos - prevState.totalEgresos // Calcula la diferencia
            }));
            if (pagina2 > response.data[1][0]?.numpag) {
                this.paginaAnterior2();
            }
        } catch (error) {
            console.error("Error fetching ingresos:", error);
        }
    };
    fetchAllPages = async (urlBase) => {
        let allData = [];
        let totalSum = 0;
        let currentPage = 1;

        while (true) {
            const url = `${urlBase}?page=${currentPage}&cadena=${cadena}`;
            try {
                const response = await axios.get(url);
                const data = response.data[0];
                const numPages = response.data[1][0]?.numpag || 0;

                // Concatenar los datos de la página actual
                allData = allData.concat(data);

                // Sumar el monto de los pagos de la página actual
                totalSum += data.reduce((acc, item) => acc + parseFloat(item.monto || item.monto_pagado || 0), 0);

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
    getChartData = () => {
        const { totalIngresos, totalEgresos } = this.state;
        const diferencia = totalIngresos - totalEgresos;

        // Calcular porcentajes
        const porcentajeEgresos = totalIngresos > 0 ? ((totalEgresos / totalIngresos) * 100).toFixed(2) : 0;
        const porcentajeRestante = totalIngresos > 0 ? ((diferencia / totalIngresos) * 100).toFixed(2) : 0;

        return {
            labels: [
                `Egresos (${porcentajeEgresos}%)`,
                `Restante (${porcentajeRestante}%)`
            ],
            datasets: [
                {
                    data: [totalEgresos, diferencia > 0 ? diferencia : 0],
                    backgroundColor: ['#FF6384', '#36A2EB'],
                    hoverBackgroundColor: ['#FF6384', '#36A2EB']
                }
            ]
        };
    };

    generarPDF = async () => {
        const doc = new jsPDF('p', 'mm', 'a4'); // Tamaño de página A4
        const fechaHoraActual = new Date();
        const fechaFormateada = fechaHoraActual.toLocaleString();
    
        const egresosUrl = `${urlApi}egresos.php`;
        const ingresosUrl = `${urlApi}ingreso.php`;
    
        // Obtener datos de egresos e ingresos de todas las páginas
        const { allData: egresosData, totalSum: totalEgresos } = await this.fetchAllPages(egresosUrl);
        const { allData: ingresosData, totalSum: totalIngresos } = await this.fetchAllPages(ingresosUrl);
    
        // Preparar tablas
        const egresosColumns = ["ID", "Tipo", "Monto", "Fecha", "ID Usuario"];
        const ingresosColumns = ["Personal", "Fecha", "Monto Pagado", "Tipo de Pago", "Pensión"];
        const egresosRows = egresosData.map(e => [e.idegreso, e.tipo, e.monto, e.fecha, e.idusuario]);
        const ingresosRows = ingresosData.map(i => [i.usuario_nombre, i.fecha_pago, i.monto_pagado, i.tipo_pago, i.pension_mensual]);
    
        doc.text("Reporte de Egresos e Ingresos", 70, 20); // Título
        doc.text(`Fecha: ${fechaFormateada}`, 14, 30);
    
        // Añadir tabla de Egresos
        doc.text("Egresos", 14, 40);
        doc.autoTable({
            head: [egresosColumns],
            body: egresosRows,
            startY: 45,
            styles: { fontSize: 8 }
        });
    
        // Añadir total de Egresos
        doc.text(`Total Egresos: ${totalEgresos.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
    
        // Añadir tabla de Ingresos
        doc.text("Ingresos", 14, doc.lastAutoTable.finalY + 20);
        doc.autoTable({
            head: [ingresosColumns],
            body: ingresosRows,
            startY: doc.lastAutoTable.finalY + 25,
            styles: { fontSize: 8 }
        });
    
        // Añadir total de Ingresos
        doc.text(`Total Ingresos: ${totalIngresos.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
    
        // Añadir diferencia
        const diferencia = totalIngresos - totalEgresos;
        doc.text(`Diferencia entre Ingresos y Egresos: ${diferencia.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 20);
    
        // Capturar el gráfico de pastel
        const chartElement = document.getElementById("chart-container");
        if (chartElement) {
            const canvas = await html2canvas(chartElement);
            const imgData = canvas.toDataURL("image/png");
    
            // Añadir el gráfico al PDF
            const chartPosition = doc.lastAutoTable.finalY + 30;
            doc.addImage(imgData, 'PNG', 15, chartPosition, 90, 90);
        }
    
        // Guardar el archivo
        doc.save("ReporteEgresosIngresos.pdf");
    };
    
    clickEditar = (idegreso) => {
        sessionStorage.setItem("IdRegistroSeleccionado", idegreso);
        this.props.navigate('/EditarEgresos');
    };

    nuevoRegistro = () => {
        this.props.navigate('/NuevoEgresos');
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

    paginaSiguiente2 = () => {
        const num_p = this.state.num_paginas2[0]?.numpag || 0;
        if (num_p > pagina2) {
            pagina2 += 1;
            this.fetchIngresos();
        }
    };

    paginaAnterior2 = () => {
        if (pagina2 > 1) {
            pagina2 -= 1;
            this.fetchIngresos();
        }
    };

    buscarTexto2 = (e) => {
        if (e.charCode === 13) {
            pagina2 = 1;
            cadena2 = e.target.value;
            this.fetchIngresos();
        }
    };

    eliminarRegistro = async (idegreso, tipo) => {
        const confirmar = await confirm(`¿Desea eliminar el egreso de ${tipo}?`);
        if (confirmar) {
            const url = `${urlApi}egresos.php`;
            const datos = {
                "token": sessionStorage.getItem("token"),
                "idegreso": idegreso,
                "metodo": "delete"
            };
            try {
                await axios.post(url, datos);
                this.fetchUsuarios();
                alert("egreso eliminado exitosamente.");
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("No se pudo eliminar el egreso. Por favor, intenta nuevamente.");
            }
        }
    };

    render() {
        return (
            <div>
                <Header />
                <heder>
                    <h1>Egresos y Ingresos</h1>
                </heder>
                <div className="container">
                    <button type="button" className="btn btn-primary" onClick={this.nuevoRegistro} style={{ marginRight: "10px" }}>Nuevo Registro</button>
                    <input type="text" onKeyPress={this.buscarTexto} />
                    <button type="button" className="btn btn-primary" onClick={this.generarPDF} style={{ marginRight: "10px", marginLeft: "300px" }}>Generar PDF</button>
                    <input type="text" onKeyPress={this.buscarTexto2} />
                    <div className="row">

                        {/* Primera tabla */}
                        <div className="col-12 col-md-6">
                            <h2 style={{ textAlign: "center" }}>Tabla de Egresos</h2>
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tipo</th>
                                        <th>Monto</th>
                                        <th>Fecha</th>
                                        <th>ID del Usuario</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.egresos.map((value, index) => (
                                        <tr key={index}>
                                            <td>{value.idegreso}</td>
                                            <td>{value.tipo}</td>
                                            <td>{value.monto}</td>
                                            <td>{value.fecha}</td>
                                            <td>{value.idusuario}</td>
                                            <td>
                                                <svg onClick={() => this.clickEditar(value.idegreso)} xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-edit" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#00abfb" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                                    <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                                    <path d="M16 5l3 3" />
                                                </svg>
                                                <svg onClick={() => this.eliminarRegistro(value.idegreso, value.tipo)} xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-trash" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ff2825" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M4 7l16 0" />
                                                    <path d="M10 11l0 6" />
                                                    <path d="M14 11l0 6" />
                                                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                                </svg>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan="2"><strong>Total Egresos:</strong></td>
                                        <td><strong>{this.state.totalEgresos.toFixed(2)}</strong></td>
                                        <td colSpan="3"></td>
                                    </tr>
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

                        {/* Segunda tabla */}

                        <div className="col-12 col-md-6">
                            <h2 style={{ textAlign: "center" }}>Tabla de Ingresos</h2>
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Personal</th>
                                        <th>Fecha</th>
                                        <th>Monto Pagado</th>
                                        <th>Tipo de Pago</th>
                                        <th>Pensión a Pagar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.ingresos.map((value, index) => (
                                        <tr key={index}>
                                            <td>{value.usuario_nombre}</td>
                                            <td>{value.fecha_pago}</td>
                                            <td>{value.monto_pagado}</td>
                                            <td>{value.tipo_pago}</td>
                                            <td>{value.pension_mensual}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan="2"><strong>Total Ingresos:</strong></td>
                                        <td><strong>{this.state.totalIngresos.toFixed(2)}</strong></td>
                                        <td colSpan="2"></td>
                                    </tr>
                                </tbody>
                            </table>
                            <nav>
                                <center>
                                    <button type="button" onClick={this.paginaAnterior2} style={{ marginRight: "10px" }} className="btn btn-success">{"< "}Anterior</button>
                                    <input type="text" value={`${pagina2} de ${this.state.num_paginas2[0]?.numpag || 0}`} readOnly style={{ marginRight: "10px", width: "120px", textAlign: "center" }} />
                                    <button type="button" onClick={this.paginaSiguiente2} style={{ marginRight: "10px" }} className="btn btn-success">Siguiente{" >"}</button>
                                </center>
                            </nav>
                        </div>
                    </div>

                    {/* Diferencia entre ingresos y egresos */}
                    <div style={{ marginTop: "20px" }}>
                        <h3>Diferencia entre Ingresos y Egresos: <strong>{this.state.diferencia.toFixed(2)}</strong></h3>
                    </div>
                </div>
                <div style={{ marginTop: "20px" }}>
                    <div style={{ maxWidth: "350px", margin: "20px auto" }} id="chart-container">
                        <Pie data={this.getChartData()} />
                    </div>
                </div>
            </div>
        );
    }
}

function EgresosWrapper() {
    const navigate = useNavigate();
    return <Egresos navigate={navigate} />;
}

export default EgresosWrapper;


