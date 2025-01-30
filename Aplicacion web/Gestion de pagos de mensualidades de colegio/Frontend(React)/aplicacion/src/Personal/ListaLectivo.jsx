import React from "react";
import Header2 from "../Plantilla/Header2";
import '../assets/css/ListaPersonal.css';
import { urlApi } from '../services/apirest';
import axios from "axios";
import { confirm } from "../Confirmation";
import { useNavigate } from 'react-router-dom';

let pagina = 1;
let cadena = "";

// Función para pasar navigate como prop

class ListaLectivo extends React.Component {
    state = {
        lectivo: [],
        num_paginas: 0
    }

    componentDidMount = () => {
        // Eliminamos la verificación del token para permitir acceso sin token
        const token = sessionStorage.getItem("token");
        if (!token) {
            alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
            this.props.navigate('/');
            return;
        }
        this.fetchUsuarios();
    }

    fetchUsuarios = async () => {
        const url = `${urlApi}lectivo.php?page=${pagina}&idparalelo=${localStorage.getItem(
            "idparalelo"
          )}&cadena=${cadena}`;
        try {
            const response = await axios.get(url);
            this.setState({
                lectivo: response.data[0],
                num_paginas: response.data[1]
            });
            if (pagina > response.data[1][0].numpag) {
                this.paginaAnterior();
            }
        } catch (error) {
            console.error("Error fetching users:", error);
           
        }
    };

    clickEditar = (id) => {
        sessionStorage.setItem("IdRegistroSeleccionado", id);
        this.props.navigate('/EditarLectivo');
    };

    nuevoRegistro = () => {
        this.props.navigate('/NuevoLectivo');
    };

    irparalelos(id) {
        console.log(id);
        localStorage.setItem("idlectivo", id);
        this.props.navigate('/ListaParalelo');
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

    eliminarUsuario = async (idlectivo, nombre) => {
        if (await confirm(`¿Desea eliminar al año lectivo ${nombre}?`)) {
            const url = `${urlApi}lectivo.php`;
            const datos = {
                "token": sessionStorage.getItem("token"),
                "idlectivo": idlectivo,
                "metodo": "delete"
            };
            try {
                await axios.post(url, datos);
                this.fetchUsuarios();
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    render() {
        return (
            <div>
                <Header2 />
                <heder>
                    <h1>Lista de los años lectivos</h1>
                </heder>
                <div className="container">
                    <button type="button" className="btn btn-primary" onClick={this.nuevoRegistro} style={{ marginRight: "10px" }}>Nuevo Registro</button>
                    <input type="text" onKeyPress={this.buscarTexto} />
                    <div className="container">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Estado</th>
                                    <th>Inicia</th>
                                    <th>Acaba</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.lectivo.map((value, index) => (
                                    <tr key={index}>
                                        <td>{value.idlectivo}</td>
                                        <td>{value.nombre}</td>
                                        <td>{value.estado}</td>
                                        <td>{value.inicia}</td>
                                        <td>{value.acaba}</td>
                                        <td>
                                            <svg onClick={() => this.irparalelos(value.idlectivo)} xmlns="http://www.w3.org/2000/svg"className="icon icon-tabler icon-tabler-edit" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#00abfb" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0" />
                                                <path d="M7 15v-4.5a1.5 1.5 0 0 1 3 0v4.5" />
                                                <path d="M7 13h3" />
                                                <path d="M14 9v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1" />
                                            </svg>

                                            <svg onClick={() => this.clickEditar(value.idlectivo)} xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-edit" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#00abfb" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                                <path d="M16 5l3 3" />
                                            </svg>
                                            <svg onClick={() => this.eliminarUsuario(value.idlectivo, value.nombre)} xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-trash" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ff2825" fill="none" strokeLinecap="round" strokeLinejoin="round">
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
function ListaLectivoWrapper() {
    const navigate = useNavigate();
    return <ListaLectivo navigate={navigate} />;
}
export default ListaLectivoWrapper;