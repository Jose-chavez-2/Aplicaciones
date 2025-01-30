import React from "react";
import axios from "axios";
import '../assets/css/NuevoPersonal.css';
import { urlApi } from '../services/apirest';
import { useNavigate } from "react-router-dom";

class EditarPadres extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mostrarModal: false,
            form: {
                idpadres: "",
                nombres: "",
                apellidos: "",
                cedula: "",
                telefono: "",
                clave: "",
                token: sessionStorage.getItem("token"),
                metodo: "put"
            },
            error: false,
            errorMsg: "",
            success: false,
            successMsg: "",
            modificarClave: false  // Estado para manejar el checkbox
        };
    }

    abrirModal = () => {
        this.setState({ mostrarModal: true });
    };

    cerrarModal = () => {
        this.setState({ mostrarModal: false });
    };

    manejadorOnchange = (e) => {
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
    };

    // Método para manejar el cambio en el checkbox
    manejarCheckbox = (e) => {
        this.setState({
            modificarClave: e.target.checked,
            form: {
                ...this.state.form,
                clave: "" // Limpiar la contraseña si no se va a modificar
            }
        });
    };

    validarCampos = () => {
        const { nombres, apellidos, cedula, telefono, clave } = this.state.form;
        return nombres && apellidos && cedula && telefono && (this.state.modificarClave ? clave : true);
    };

    put = () => {
        if (this.validarCampos()) {
            const { form, modificarClave } = this.state;
    
            // Si no se va a modificar la contraseña, no la incluimos en la solicitud
            if (!modificarClave) {
                delete form.clave;
            }
    
            const url = `${urlApi}padres`;
            axios
                .post(url, form)
                .then(response => {
                    console.log(response);
                    this.setState({ success: true, successMsg: "padre editado con éxito." });
                    setTimeout(() => this.props.navigate('/ListaPadres'), 1500);
                })
                .catch(error => {
                    console.error(error);
                    this.setState({ error: true, errorMsg: "Error al editar el padre. Intente de nuevo." });
                });
        } else {
            this.setState({
                error: true,
                errorMsg: "Por favor, complete todos los campos.",
                success: false
            });
        }
    };
    

    salir = () => {
        this.props.navigate('/ListaPadres');
    };

    async componentDidMount() {
        const idpadres = sessionStorage.getItem("IdRegistroSeleccionado");
        if (!idpadres) {
            this.props.navigate('/ListaPadres');
            return;
        }

        const url_getid = `${urlApi}padres?id=${idpadres}`;
        try {
            const response = await axios.get(url_getid);
            if (response.data && response.data.length > 0) {
                const usuarioData = response.data[0];
                this.setState({
                    form: {
                        ...this.state.form,
                        idpadres,
                        nombres: usuarioData.nombres,
                        apellidos: usuarioData.apellidos,
                        cedula: usuarioData.cedula,
                        telefono: usuarioData.telefono,
                        clave: usuarioData.clave
                    }
                });
            } else {
                console.error("Padre no encontrado");
                this.props.navigate('/ListaPadres');
            }
        } catch (error) {
            console.error("Error al obtener los datos del padre:", error);
            this.props.navigate('/ListaPadres');
        }
    }

    render() {
        const { form, error, errorMsg, success, successMsg, modificarClave } = this.state;

        return (
            <div className="position-absolute top-1 start-50 translate-middle-x">
                <div className="Container">
                    <h2>EDITAR USUARIOS DE PADRES</h2>
                </div>
                <div className="Container">
                    <form className="form-horizontal">
                        <div className="row">
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="nombres" className="form-label">Nombres</label>
                                    <input
                                        className="form-control"
                                        name="nombres"
                                        placeholder="Nombres"
                                        type="text"
                                        value={form.nombres}
                                        onChange={this.manejadorOnchange}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="apellidos" className="form-label">Apellidos</label>
                                    <input
                                        className="form-control"
                                        name="apellidos"
                                        placeholder="Apellidos"
                                        type="text"
                                        value={form.apellidos}
                                        onChange={this.manejadorOnchange}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="cedula" className="form-label">Cedula</label>
                                    <input
                                        className="form-control"
                                        name="cedula"
                                        placeholder="Cedula"
                                        type="text"
                                        value={form.cedula}
                                        onChange={this.manejadorOnchange}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="telefono" className="form-label">Telefono</label>
                                    <input
                                        className="form-control"
                                        name="telefono"
                                        placeholder="Telefono"
                                        type="text"
                                        value={form.telefono}
                                        onChange={this.manejadorOnchange}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="clave" className="form-label">Clave</label>
                                    <input
                                        className="form-control"
                                        name="clave"
                                        placeholder="Clave"
                                        type="password"
                                        value={form.clave}
                                        onChange={this.manejadorOnchange}
                                        disabled={!modificarClave}  // Deshabilitar si no se debe modificar
                                    />
                                </div>
                            </div>
                            {/* Checkbox para habilitar/deshabilitar la contraseña */}
                            <div className="col-12">
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="modificarClave"
                                        checked={modificarClave}
                                        onChange={this.manejarCheckbox}
                                    />
                                    <label className="form-check-label" htmlFor="modificarClave">
                                        Modificar contraseña
                                    </label>
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={this.put}
                            style={{ marginRight: "10px" }}
                        >
                            Editar
                        </button>
                        <button
                            type="button"
                            className="btn btn-dark"
                            onClick={this.salir}
                            style={{ marginRight: "10px" }}
                        >
                            Salir
                        </button>
                    </form>
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {errorMsg}
                        </div>
                    )}
                    {success && (
                        <div className="alert alert-success" role="alert">
                            {successMsg}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

function Navegacion(props) {
    const navigate = useNavigate();
    return <EditarPadres {...props} navigate={navigate} />;
}

export default Navegacion;