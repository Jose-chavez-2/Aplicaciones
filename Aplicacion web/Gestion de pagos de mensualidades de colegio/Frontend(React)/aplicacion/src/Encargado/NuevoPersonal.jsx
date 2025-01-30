import React from "react";
import axios from "axios";
import '../assets/css/NuevoPersonal.css';
import { urlApi } from '../services/apirest';
import { useNavigate } from "react-router-dom";

class NuevoUsuario extends React.Component {
    state = {
        form: {
            "idusuario": "",
            "nombres": "",
            "apellidos": "",
            "puesto": "",
            "usuario": "",
            "contrasena": "",
            "token": sessionStorage.getItem("token"),
            "metodo": "post"
        },
        error: false,
        errorMsg: "",
        success: false,
        successMsg: ""
    }

    manejadorOnchange = async e => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
            this.props.navigate('/');
            return;
        }
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.form);
    }

    validarCampos = () => {
        const { nombres, apellidos, puesto, usuario, contrasena } = this.state.form;
        return nombres && apellidos && puesto && usuario && contrasena;
    }

    post = () => {
        if (this.validarCampos()) {
            let url = urlApi + "usuarios";
            axios
                .post(url, this.state.form)
                .then(response => {
                    this.setState({
                        success: true,
                        successMsg: "Usuario registrado correctamente.",
                        error: false
                    });
                })
                .catch(error => {
                    console.error("Error al guardar:", error.response?.data || error);
                    this.setState({
                        error: true,
                        errorMsg: error.response?.data?.message || "Error desconocido",
                        success: false
                    });
                });
        } else {
            this.setState({
                error: true,
                errorMsg: "Por favor, complete todos los campos.",
                success: false
            });
        }
    }

    salir = () => {
        this.props.navigate('/ListaPersonal');
    }

    render() {
        return (
            <div className="position-absolute top-1 start-50 translate-middle-x">
                <div className="Container">
                    <h2>NUEVOS USUARIOS DEL PERSONAL</h2>
                </div>
                <div className="Container">
                    <form className="form-horizontal">
                        <div className="row">
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="nombres" className="form-label">Nombres</label>
                                    <input className="form-control" name="nombres" placeholder="Nombres" type="text" onChange={this.manejadorOnchange} />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="apellidos" className="form-label">Apellidos</label>
                                    <input className="form-control" name="apellidos" placeholder="Apellidos" type="text" onChange={this.manejadorOnchange} />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="puesto" className="form-label">Puesto</label>
                                    <select className="form-control" name="puesto" onChange={this.manejadorOnchange}>
                                        <option value="">Seleccionar Puesto</option>
                                        <option value="Encargado">Encargado</option>
                                        <option value="Personal">Personal</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="usuario" className="form-label">Usuario</label>
                                    <input className="form-control" name="usuario" placeholder="Usuario" type="text" onChange={this.manejadorOnchange} />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="contrasena" className="form-label">Contraseña</label>
                                    <input className="form-control" name="contrasena" placeholder="Contraseña" type="password" onChange={this.manejadorOnchange} />
                                </div>
                            </div>
                        </div>
                        <button type="button" className="btn btn-primary" onClick={() => this.post()} style={{ marginRight: "10px" }}>Guardar</button>
                        <button type="button" className="btn btn-dark" onClick={() => this.salir()} style={{ marginRight: "10px" }}>Salir</button>
                    </form>
                    {this.state.error &&
                        <div className="alert alert-danger" role="alert">
                            {this.state.errorMsg}
                        </div>
                    }
                    {this.state.success &&
                        <div className="alert alert-success" role="alert">
                            {this.state.successMsg}
                        </div>
                    }
                </div>
            </div>
        );
    }
}

function Navegacion(props) {
    let navigate = useNavigate();
    return <NuevoUsuario {...props} navigate={navigate} />;
}

export default Navegacion;

