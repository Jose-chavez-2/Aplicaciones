import React from "react";
import axios from "axios";
import '../assets/css/NuevoPersonal.css';
import { urlApi } from "../services/apirest";
import { useNavigate } from "react-router-dom";
import ListaEstudiantes from '../Personal/ListaEstudiantes';
import '../assets/css/Modal.css';

class NuevaMatricula extends React.Component {
    state = {
        form: {
            "codigo": "",
            "fechamatricula": "",
            "costo": "",
            "pension": "",
            "pago": "",
            "idestudiantes": sessionStorage.getItem('idestudiantes'), 
            "idparalelo": localStorage.getItem('idparalelo'),
            "token": localStorage.getItem('token'),
            "metodo": "post"
        },
        mostrarModal: false,
    }

    // Actualiza el valor del estudiante seleccionado en el formulario
    actualizarIdEstudiante = (idestudiantes) => {
        this.setState({
            form: {
                ...this.state.form,
                idestudiantes // Actualiza solo el campo idestudiantes
            },
            mostrarModal: false, // Cierra el modal después de seleccionar
        });
    }

    manejadorOnchange = e => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
    }
    abrirModal = () => {
        this.setState({ mostrarModal: true });
    }

    cerrarModal = () => {
        this.setState({ mostrarModal: false });
    }
    validarCampos = () => {
        const { codigo, fechamatricula, costo, pension, pago, idestudiantes, idparalelo } = this.state.form;
        return codigo && fechamatricula && costo && pension && pago && idestudiantes && idparalelo;
    }

    post = () => {
        if (this.validarCampos()) {
            let url = urlApi + "matricula";
            axios
                .post(url, this.state.form)
                .then(response => {
                    this.setState({
                        success: true,
                        successMsg: "Matrícula guardada correctamente.",
                        error: false
                    });

                    setTimeout(() => {
                        this.setState({ success: false, successMsg: "" });
                    }, 3000);
                })
                .catch(error => {
                    console.error("Error al guardar:", error.response?.data || error);
                    this.setState({
                        error: true,
                        errorMsg: error.response?.data?.message || "Error desconocido",
                        success: false
                    });

                    setTimeout(() => {
                        this.setState({ error: false, errorMsg: "" });
                    }, 3000);
                });
        } else {
            this.setState({
                error: true,
                errorMsg: "Por favor, complete todos los campos.",
                success: false
            });

            setTimeout(() => {
                this.setState({ error: false, errorMsg: "" });
            }, 3000);
        }
    }

    salir = () => {
        this.props.navigate('/ListaMatricula');
    }

    render() {
        return (
            <div className="position-absolute top-1 start-50 translate-middle-x">
                <div className="Container">
                    <h2>REGISTRAR MATRÍCULA</h2>
                </div>
                <div className="Container">
                    <form className="form-horizontal">
                        <div className="row">
                            <div className="col-12 col-sm-6">
                                <label htmlFor="codigo" className="form-label">Código</label>
                                <input className="form-control" name="codigo" placeholder="Código" type="text" onChange={this.manejadorOnchange} />
                            </div>
                            <div className="col-12 col-sm-6">
                                <label htmlFor="fechamatricula" className="form-label">Fecha de matrícula</label>
                                <input className="form-control" name="fechamatricula" placeholder="Fecha de matrícula" type="date" onChange={this.manejadorOnchange} />
                            </div>
                            <div className="col-12 col-sm-6">
                                <label htmlFor="costo" className="form-label">Costo</label>
                                <input className="form-control" name="costo" placeholder="Costo" type="text" onChange={this.manejadorOnchange} />
                            </div>
                            <div className="col-12 col-sm-6">
                                <label htmlFor="pension" className="form-label">Pensión</label>
                                <input className="form-control" name="pension" placeholder="Pensión" type="text" onChange={this.manejadorOnchange} />
                            </div>
                            <div className="col-12 col-sm-6">
                                <label htmlFor="pago" className="form-label">Pago</label>
                                <input className="form-control" name="pago" placeholder="Pago" type="text" onChange={this.manejadorOnchange} />
                            </div>
                            <div className="col-12 col-sm-6">
                                <label htmlFor="idestudiantes" className="form-label">Estudiante</label>
                                <input
                                    className="form-control"
                                    name="idestudiantes"
                                    placeholder="ID Estudiante"
                                    type="text"
                                    value={this.state.form.idestudiantes}
                                    onClick={this.abrirModal}
                                    readOnly
                                />

                            </div>
                        </div>
                        <button type="button" className="btn btn-primary" onClick={this.post}>Guardar</button>
                        <button type="button" className="btn btn-dark" onClick={this.salir} style={{ marginRight: "10px" }}>Salir</button>
                    </form>
                    {this.state.error &&
                        <div className="alert alert-danger">{this.state.errorMsg}</div>
                    }
                    {this.state.success &&
                        <div className="alert alert-success">{this.state.successMsg}</div>
                    }
                </div>

                {this.state.mostrarModal &&
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={this.cerrarModal}>&times;</span>
                            <ListaEstudiantes seleccionarEstudiante={this.actualizarIdEstudiante} />
                        </div>
                    </div>
                }
            </div>
        );
    }
}

function Navegacion(props) {
    let navigate = useNavigate();
    return <NuevaMatricula {...props} navigate={navigate} />;
}
export default Navegacion;
