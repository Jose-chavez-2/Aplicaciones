import React from "react";
import axios from "axios";
import '../assets/css/NuevoPersonal.css';
import { urlApi } from '../services/apirest';
import { useNavigate } from "react-router-dom";

class EditarPersonal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mostrarModal: false,
            form: {
                idusuario: "",
                nombres: "",
                apellidos: "",
                puesto: "",
                usuario: "",
                contrasena: "",
                token: sessionStorage.getItem("token"),
                metodo: "put"
            },
            error: false,
            errorMsg: "",
            success: false,
            successMsg: "",
            modificarContrasena: false  // Estado para manejar el checkbox
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
            modificarContrasena: e.target.checked,
            form: {
                ...this.state.form,
                contrasena: "" // Limpiar la contraseña si no se va a modificar
            }
        });
    };

    validarCampos = () => {
        const { nombres, apellidos, puesto, usuario, contrasena } = this.state.form;
        return nombres && apellidos && puesto && usuario && (this.state.modificarContrasena ? contrasena : true);
    };

    put = () => {
        if (this.validarCampos()) {
            const { form, modificarContrasena } = this.state;
    
            // Si no se va a modificar la contraseña, no la incluimos en la solicitud
            if (!modificarContrasena) {
                delete form.contrasena;
            }
    
            const url = `${urlApi}usuarios`;
            axios
                .post(url, form)
                .then(response => {
                    console.log(response);
                    this.setState({ success: true, successMsg: "Usuario editado con éxito." });
                    setTimeout(() => this.props.navigate('/ListaPersonal'), 1500);
                })
                .catch(error => {
                    console.error(error);
                    this.setState({ error: true, errorMsg: "Error al editar el usuario. Intente de nuevo." });
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
        this.props.navigate('/ListaPersonal');
    };

    async componentDidMount() {
        const idusuario = sessionStorage.getItem("IdRegistroSeleccionado");
        if (!idusuario) {
            this.props.navigate('/ListaPersonal');
            return;
        }

        const url_getid = `${urlApi}usuarios?id=${idusuario}`;
        try {
            const response = await axios.get(url_getid);
            if (response.data && response.data.length > 0) {
                const usuarioData = response.data[0];
                this.setState({
                    form: {
                        ...this.state.form,
                        idusuario,
                        nombres: usuarioData.nombres,
                        apellidos: usuarioData.apellidos,
                        puesto: usuarioData.puesto,
                        usuario: usuarioData.usuario,
                        contrasena: usuarioData.contrasena
                    }
                });
            } else {
                console.error("Usuario no encontrado");
                this.props.navigate('/ListaPersonal');
            }
        } catch (error) {
            console.error("Error al obtener los datos del usuario:", error);
            this.props.navigate('/ListaPersonal');
        }
    }

    render() {
        const { form, error, errorMsg, success, successMsg, modificarContrasena } = this.state;

        return (
            <div className="position-absolute top-1 start-50 translate-middle-x">
                <div className="Container">
                    <h2>EDITAR USUARIOS DEL PERSONAL</h2>
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
                                    <label htmlFor="puesto" className="form-label">Puesto</label>
                                    <select
                                        className="form-control"
                                        name="puesto"
                                        value={form.puesto}
                                        onChange={this.manejadorOnchange}
                                    >
                                        <option value="">Seleccionar Puesto</option>
                                        <option value="Encargado">Encargado</option>
                                        <option value="Personal">Personal</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="usuario" className="form-label">Usuario</label>
                                    <input
                                        className="form-control"
                                        name="usuario"
                                        placeholder="Usuario"
                                        type="text"
                                        value={form.usuario}
                                        onChange={this.manejadorOnchange}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="contrasena" className="form-label">Contraseña</label>
                                    <input
                                        className="form-control"
                                        name="contrasena"
                                        placeholder="Contraseña"
                                        type="password"
                                        value={form.contrasena}
                                        onChange={this.manejadorOnchange}
                                        disabled={!modificarContrasena}  // Deshabilitar si no se debe modificar
                                    />
                                </div>
                            </div>
                            {/* Checkbox para habilitar/deshabilitar la contraseña */}
                            <div className="col-12">
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="modificarContrasena"
                                        checked={modificarContrasena}
                                        onChange={this.manejarCheckbox}
                                    />
                                    <label className="form-check-label" htmlFor="modificarContrasena">
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
    return <EditarPersonal {...props} navigate={navigate} />;
}

export default Navegacion;
