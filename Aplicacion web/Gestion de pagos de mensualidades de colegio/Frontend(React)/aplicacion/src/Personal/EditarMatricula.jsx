import React from "react";
import axios from "axios";
import '../assets/css/NuevoPersonal.css';
import { urlApi } from "../services/apirest";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class NuevaMatricula extends React.Component {
    state = {
        form: {
            "codigo": "",
            "fechamatricula": "",
            "costo": "",
            "pension": "",
            "pago": "",
            "idestudiantes": "",
            "idparalelo": localStorage.getItem('idparalelo'),
            "token": localStorage.getItem('token'),
            "metodo": "post"
        },
        estudiantes: [],
        showModal: false,
        error: false,
        errorMsg: "",
        success: false,
        successMsg: ""
    }

    // Maneja los cambios en los campos del formulario
    manejadorOnchange = e => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
    }

    // Valida que todos los campos necesarios estén completos
    validarCampos = () => {
        const { codigo, fechamatricula, costo, pension, pago, idestudiantes, idparalelo } = this.state.form;
        return codigo && fechamatricula && costo && pension && pago && idestudiantes && idparalelo;
    }

    // Maneja la solicitud POST para guardar la matrícula
    post = () => {
        if (this.validarCampos()) {
            let url = urlApi + "matricul";
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

    // Carga la lista de estudiantes desde la API
    cargarEstudiantes = () => {
        const url = `${urlApi}estudiantes.php?`;
        axios.get(url)
            .then(response => {
                console.log("Respuesta de la API:", response.data);
                // Validar si response.data tiene la estructura correcta
                if (response.data && Array.isArray(response.data)) {
                    this.setState({ estudiantes: response.data });
                } else if (response.data?.message) {
                    console.warn("Mensaje de la API:", response.data.message);
                    this.setState({ estudiantes: [] });
                } else {
                    console.error("La API no retornó un arreglo ni un mensaje válido:", response.data);
                    this.setState({ estudiantes: [] });
                }
            })
            .catch(error => {
                console.error("Error al cargar estudiantes:", error);
                this.setState({ estudiantes: [] });
            });
    };
    

    // Maneja la selección de un estudiante
    seleccionarEstudiante = (idestudiantes, nombres) => {
        this.setState({
            form: {
                ...this.state.form,
                idestudiantes: idestudiantes
            },
            showModal: false,
            success: true,
            successMsg: `Estudiante seleccionado: ${nombres}`
        });

        setTimeout(() => {
            this.setState({ success: false, successMsg: "" });
        }, 3000);
    }

    render() {
        return (
            <div className="position-absolute top-1 start-50 translate-middle-x">
                <div className="Container">
                    <h2>EDITAR MATRÍCULA</h2>
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
                                <label htmlFor="pension" className="form-label">Pension</label>
                                <input className="form-control" name="pension" placeholder="pension" type="text" onChange={this.manejadorOnchange} />
                            </div>
                            <div className="col-12 col-sm-6">
                                <label htmlFor="pago" className="form-label">Pago</label>
                                <input className="form-control" name="pago" placeholder="Pago" type="text" onChange={this.manejadorOnchange} />
                            </div>
                            <div className="col-12 col-sm-6">
                                <label htmlFor="idestudiantes" className="form-label">Estudiante</label>
                                <div className="input-group">
                                    <input className="form-control" value={this.state.form.idestudiantes || ""} readOnly />
                                    <button type="button" className="btn btn-secondary" onClick={() => {
                                        this.cargarEstudiantes();
                                        this.setState({ showModal: true });
                                    }}>
                                        Seleccionar
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button type="button" className="btn btn-primary" onClick={this.post}>Editar</button>
                        <button type="button" className="btn btn-dark" onClick={() => this.salir()} style={{ marginRight: "10px" }}>Salir</button>
                    </form>
                    {this.state.error &&
                        <div className="alert alert-danger">{this.state.errorMsg}</div>
                    }
                    {this.state.success &&
                        <div className="alert alert-success">{this.state.successMsg}</div>
                    }
                </div>

                {/* Modal para seleccionar estudiantes */}
                <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Seleccionar Estudiante</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ul className="list-group">
                            {Array.isArray(this.state.estudiantes) && this.state.estudiantes.map(estudiante => (
                                <li
                                    key={estudiante.idestudiantes}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                    onClick={() => this.seleccionarEstudiante(estudiante.idestudiantes, estudiante.nombre)}
                                >
                                    {estudiante.nombre}
                                </li>
                                
                            ))}
                        </ul>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ showModal: false })}>Cerrar</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

function Navegacion(props) {
    let navigate = useNavigate();
    return <NuevaMatricula {...props} navigate={navigate} />;
}
export default Navegacion;
