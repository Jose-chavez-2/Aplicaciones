import React from "react";
import axios from "axios";
import '../assets/css/NuevoPersonal.css';
import { urlApi } from "../services/apirest";
import { useNavigate } from "react-router-dom";

class NuevoParalelo extends React.Component {
    state = {
        form: {
            "idparalelo": "",
            "paralelo": "",
            "curso": "",
            "especialidad": "",
            "codigo": "",
            "idlectivo": localStorage.getItem('idlectivo'),
            "token": sessionStorage.getItem('token'),
            "metodo": "post"
        },
        error: false,
        errorMsg: "",
        success: false,
        successMsg: ""
    }

    manejadorOnchange = async e => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.form);
    }

    validarCampos = () => {
        const { paralelo, curso, especialidad, codigo, idlectivo } = this.state.form;
        return paralelo && curso && especialidad && codigo && idlectivo;
    }

    post = () => {
        if (this.validarCampos()) {
            let url = urlApi + "paralelo";
            axios
                .post(url, this.state.form)
                .then(response => {
                    this.setState({
                        success: true,
                        successMsg: "paralelo registrado correctamente.",
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
        this.props.navigate('/ListaParalelo');
    }

    render() {
        return (
            <div className="position-absolute top-1 start-50 translate-middle-x">
                <div className="Container">
                    <h2>REGISTRAR PARALELO</h2>
                </div>
                <div className="Container">
                    <form className="form-horizontal">
                        <div className="row">
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="paralelo" className="form-label">Paralelo</label>
                                    <input className="form-control" name="paralelo" placeholder="Paralelo" type="text" onChange={this.manejadorOnchange} />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="curso" className="form-label">Curso</label>
                                    <input className="form-control" name="curso" placeholder="Curso" type="text" onChange={this.manejadorOnchange} />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="especialidad" className="form-label">Especialidad</label>
                                    <input className="form-control" name="especialidad" placeholder="especialidad" type="text" onChange={this.manejadorOnchange} />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="codigo" className="form-label">Codigo</label>
                                    <input className="form-control" name="codigo" placeholder="Codigo" type="text" onChange={this.manejadorOnchange} />
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
    return <NuevoParalelo {...props} navigate={navigate} />;
}

export default Navegacion;