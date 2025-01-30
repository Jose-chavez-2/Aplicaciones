import React from "react";
import axios from "axios";
import '../assets/css/NuevoPersonal.css';
import { urlApi } from "../services/apirest";
import { useNavigate } from "react-router-dom";

class NuevoLectivo extends React.Component {
    state = {
        form: {
            "idlectivo": "",
            "nombre": "",
            "estado": "",
            "inicia": "",
            "acaba": "",
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
        const { nombre, estado, inicia, acaba} = this.state.form;
        return nombre && estado && inicia && acaba;
    }

    post = () => {
        if (this.validarCampos()) {
            let url = urlApi + "lectivo";
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
        this.props.navigate('/ListaLectivo');
    }

    render() {
        return (
            <div className="position-absolute top-1 start-50 translate-middle-x">
                <div className="Container">
                    <h2>REGISTRAR NUEVO AÑO LECTIVO</h2>
                </div>
                <div className="Container">
                    <form className="form-horizontal">
                        <div className="row">
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="nombre" className="form-label">Nombre</label>
                                    <input className="form-control" name="nombre" placeholder="Nombre" type="text" onChange={this.manejadorOnchange} />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="estado" className="form-label">Estado</label>
                                    <input className="form-control" name="estado" placeholder="Estado" type="text" onChange={this.manejadorOnchange} />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="inicia" className="form-label">Inicia</label>
                                    <input className="form-control" name="inicia" placeholder="Inicia" type="text" onChange={this.manejadorOnchange} />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="acaba" className="form-label">Acaba</label>
                                    <input className="form-control" name="acaba" placeholder="Acaba" type="text" onChange={this.manejadorOnchange} />
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
    return <NuevoLectivo {...props} navigate={navigate} />;
}

export default Navegacion;