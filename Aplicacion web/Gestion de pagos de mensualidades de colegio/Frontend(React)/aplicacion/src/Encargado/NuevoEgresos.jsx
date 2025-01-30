import React from "react";
import axios from "axios";
import '../assets/css/NuevoPersonal.css';
import { urlApi } from '../services/apirest';
import { useNavigate } from "react-router-dom";

class NuevoEgresos extends React.Component {
    state = {
        form: {
            "idegreso": "",
            "tipo": "",
            "monto": "",
            "fecha": "",
            "idusuario": sessionStorage.getItem("idusuario"),
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
        const { tipo, monto, fecha } = this.state.form;
        return tipo && monto && fecha;
    }

    post = () => {
        if (this.validarCampos()) {
            let url = urlApi + "egresos";
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
        this.props.navigate('/Egresos');
    }

    render() {
        return (
            <div className="position-absolute top-1 start-50 translate-middle-x">
                <div className="Container">
                    <h2>NUEVOS EGRESOS</h2>
                </div>
                <div className="Container">
                    <form className="form-horizontal">
                        <div className="row">
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="tipo" className="form-label">Tipo</label>
                                    <input className="form-control" name="tipo" placeholder="Tipo" type="text" onChange={this.manejadorOnchange} />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="monto" className="form-label">Monto</label>
                                    <input className="form-control" name="monto" placeholder="Monto" type="text" onChange={this.manejadorOnchange} />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="fecha" className="form-label">Fecha</label>
                                    <input className="form-control" name="fecha" placeholder="Fecha" type="Date" onChange={this.manejadorOnchange} />
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
    return <NuevoEgresos {...props} navigate={navigate} />;
}

export default Navegacion;

