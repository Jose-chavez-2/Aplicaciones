import React from "react";
import Header from "../Plantilla/Header";
import '../assets/css/ListaPersonal.css';
import { urlApi } from '../services/apirest';
import axios from "axios";
import { confirm } from "../Confirmation";
import { useNavigate } from 'react-router-dom';

let pagina = 1;
let cadena = "";

class ListaPersonal extends React.Component {
    state = {
        usuarios: [],
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
    };
    
    fetchUsuarios = async () => {
        const url = `${urlApi}usuarios.php?page=${pagina}&cadena=${cadena}`;
        try {
            const response = await axios.get(url);
            this.setState({
                usuarios: response.data[0],
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

    clickEditar = (idusuario) => {
        sessionStorage.setItem("IdRegistroSeleccionado", idusuario);
        this.props.navigate('/EditarPersonal');
    };

    nuevoRegistro = () => {
        this.props.navigate('/NuevoPersonal');
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

    buscarTexto = async (e) => {
        if (e.charCode === 13) {
            pagina = 1;
            cadena = e.target.value;
            await this.fetchUsuarios();
        }
    };

    eliminarUsuario = async (idusuario, usuario) => {
        const confirmar = await confirm(`¿Desea eliminar al usuario con nombre ${usuario}?`);
        if (confirmar) {
            const url = `${urlApi}usuarios.php`;
            const datos = {
                "token": sessionStorage.getItem("token"),
                "idusuario": idusuario,
                "metodo": "delete"
            };
            try {
                await axios.post(url, datos);
                this.fetchUsuarios();
                alert("Usuario eliminado exitosamente.");
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("No se pudo eliminar el usuario. Por favor, intenta nuevamente.");
            }
        }
    };
    render() {
        return (
            <div>
                <Header />
                <heder>
                    <h1>Lista de Personal</h1>
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
                                    <th>Puesto</th>
                                    <th>Usuario</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.usuarios.map((value, index) => (
                                    <tr key={index}>
                                        <td>{value.idusuario}</td>
                                        <td>{value.nombres}</td>
                                        <td>{value.apellidos}</td>
                                        <td>{value.puesto}</td>
                                        <td>{value.usuario}</td>
                                        <td>
                                            <svg onClick={() => this.clickEditar(value.idusuario)} xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-edit" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#00abfb" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                                <path d="M16 5l3 3" />
                                            </svg>
                                            <svg onClick={() => this.eliminarUsuario(value.idusuario, value.usuario)} xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-trash" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ff2825" fill="none" strokeLinecap="round" strokeLinejoin="round">
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
function ListaPersonalWrapper() {
    const navigate = useNavigate();
    return <ListaPersonal navigate={navigate} />;
}
export default ListaPersonalWrapper;



