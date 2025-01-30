import React from "react";
import Header2 from "../Plantilla/Header2";
import '../assets/css/ListaPersonal.css';
import { urlApi } from '../services/apirest';
import axios from "axios";
import { confirm } from "../Confirmation";
import { useNavigate } from 'react-router-dom';

let pagina = 1;
let cadena = "";

class ListaEstudiantes extends React.Component {
    state = {
        estudiantes: [],
        num_paginas: 0
    }

    componentDidMount = () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
            this.props.navigate('/');
            return;
        }
        this.fetchUsuarios();
    }
    cambiar = (idestudiantes) => {
        sessionStorage.setItem("idestudiantes", idestudiantes); 
        window.location.reload();
    };


    fetchUsuarios = async () => {
        let idpa = localStorage.getItem('idpadres');
        console.log(idpa);
        const url = `${urlApi}estudiantes.php?page=${pagina}&cadena=${cadena}&idpadres=${idpa}`;
        try {
            const response = await axios.get(url);
            this.setState({
                estudiantes: response.data[0],
                num_paginas: response.data[1]
            });
            if (pagina > response.data[1][0].numpag) {
                this.paginaAnterior();
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            alert("Ocurrió un error al obtener los usuarios. Por favor, intenta nuevamente.");
        }
    };

    clickEditar = (idestudiantes) => {
        sessionStorage.setItem("IdRegistroSeleccionado", idestudiantes);
        this.props.navigate('/EditarEstudiantes');
    };

    nuevoRegistro = () => {
        this.props.navigate('/RegistrarEstudiantes');
    };

    paginaSiguiente = () => {
        const num_p = this.state.num_paginas[0].numpag;
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

    eliminarUsuario = async (idestudiantes, nombres) => {
        const confirmar = await confirm(`¿Desea eliminar el estudiante con nombre ${nombres}?`);
        if (confirmar) {
            const url = `${urlApi}estudiantes.php`;
            const datos = {
                "token": sessionStorage.getItem("token"),
                "idestudiantes": idestudiantes,
                "metodo": "delete"
            };
            try {
                await axios.post(url, datos);
                this.fetchUsuarios();
                alert("estudiante eliminado exitosamente.");
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("No se pudo eliminar el estudiante. Por favor, intenta nuevamente.");
            }
        }
    };

    render() {
        return (
            <div>
                <Header2 />
                <heder>
                    <h1>Lista de Estudiantes</h1>
                </heder>
                <div className="container">
                    <button type="button" className="btn btn-primary" onClick={this.nuevoRegistro} style={{ marginRight: "10px" }}>Nuevo Registro</button>
                    <input type="text" onKeyPress={this.buscarTexto} />
                    <div className="container">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombres</th>
                                    <th>Apellidos</th>
                                    <th>Cedula</th>
                                    <th>Direccion</th>
                                    <th>Correo</th>
                                    <th>Telefono</th>
                                    <th>Id del padre</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.estudiantes.map((value, index) => (
                                    <tr key={index}>
                                        <td>{value.idestudiantes}</td>
                                        <td>{value.nombres}</td>
                                        <td>{value.apellidos}</td>
                                        <td>{value.cedula}</td>
                                        <td>{value.direccion}</td>
                                        <td>{value.correo}</td>
                                        <td>{value.telefono}</td>
                                        <td>{value.idpadres}</td>
                                        <td>{value.estado}</td>
                                        <td>
                                            <div>
                                                <svg onClick={() => this.clickEditar(value.idestudiantes)} xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-edit" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#00abfb" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                                    <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                                    <path d="M16 5l3 3" />
                                                </svg>
                                                <svg onClick={() => this.eliminarUsuario(value.idestudiantes, value.nombres)} xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-trash" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ff2825" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M4 7l16 0" />
                                                    <path d="M10 11l0 6" />
                                                    <path d="M14 11l0 6" />
                                                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                                </svg>
                                            </div>
                                            <div>
                                                <svg onClick={() => this.cambiar(value.idestudiantes)} xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-click" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#00b341" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M3 12l3 0" />
                                                    <path d="M12 3l0 3" />
                                                    <path d="M7.8 7.8l-2.2 -2.2" />
                                                    <path d="M16.2 7.8l2.2 -2.2" />
                                                    <path d="M7.8 16.2l-2.2 2.2" />
                                                    <path d="M12 12l9 3l-4 2l-2 4l-3 -9" />
                                                </svg>
                                            </div>
                                        </td>
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
function ListaEstudiantesWrapper() {
    const navigate = useNavigate();
    return <ListaEstudiantes navigate={navigate} />;
}
export default ListaEstudiantesWrapper;