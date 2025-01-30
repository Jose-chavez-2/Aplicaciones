
import React from "react";
import axios from "axios";
import '../assets/css/NuevoPersonal.css';
import { urlApi } from "../services/apirest";
import { useNavigate } from "react-router-dom";

class NuevoPadre extends React.Component {
    state = {
        form: {
            "nombres": "",
            "apellidos": "",
            "cedula": "",
            "telefono": "",
            "clave": "",
            "token": localStorage.getItem('token'),
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
    }

    validarCampos = () => {
        const { nombres, apellidos, cedula, telefono, clave } = this.state.form;
        return nombres && apellidos && cedula && telefono && clave;

    }

    post = () => {
        if (this.validarCampos()) {
            let url = urlApi + "padres";
            axios
                .post(url, this.state.form)
                .then(response => {
                    this.setState({
                        success: true,
                        successMsg: "Padre registrado correctamente.",
                        error: false
                    });
                })
                .catch(error => {
                    setTimeout(() => {
                        console.error("Error al guardar:", error.response?.data || error);
                        this.setState({
                            error: true,
                            errorMsg: error.response?.data?.message || "Error desconocido",
                            success: false
                        }, 3000);
                    });
                });
        } else {
            setTimeout(() => {
                this.setState({
                    error: true,
                    errorMsg: "Por favor, complete todos los campos.",
                    success: false
                }, 3000);
            });
        }
    }

    salir = () => {
        this.props.navigate('/Listapadres');
    }

    render() {
        return (
            <div className="position-absolute top-1 start-50 translate-middle-x">
                <div className="Container">
                    <h2>NUEVO USUARIO PADRE</h2>
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
                                    <label htmlFor="cedula" className="form-label">Cédula</label>
                                    <input className="form-control" name="cedula" placeholder="Cédula" type="text" onChange={this.manejadorOnchange} />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="telefono" className="form-label">Teléfono</label>
                                    <input className="form-control" name="telefono" placeholder="Teléfono" type="text" onChange={this.manejadorOnchange} />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="clave" className="form-label">Contraseña</label>
                                    <input className="form-control" name="clave" placeholder="Contraseña" type="password" onChange={this.manejadorOnchange} />
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
    return <NuevoPadre {...props} navigate={navigate} />;
}

export default Navegacion;


