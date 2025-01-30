import React from "react";
import axios from "axios";
import '../assets/css/NuevoPersonal.css';
import { urlApi } from "../services/apirest";
import { useNavigate } from "react-router-dom";


class EditarEstudiantes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mostrarModal: false,
            form: {
                idestudiantes: "",
                nombres: "",
                apellidos: "",
                cedula: "",
                direccion: "",
                correo: "",
                telefono: "",
                idpadres: localStorage.getItem("idpadres"),
                token: sessionStorage.getItem("token"),
                metodo: "put"
            },
            error: false,
            errorMsg: "",
            success: false,
            successMsg: ""
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

    put = () => {
        const url = `${urlApi}estudiantes`;
        axios
            .post(url, this.state.form)
            .then(response => {
                console.log(response);
                this.setState({ success: true, successMsg: "estudiante editado con éxito." });
                setTimeout(() => this.props.navigate('/ListaEstudiantes'), 1500);
            })
            .catch(error => {
                console.error(error);
                this.setState({ error: true, errorMsg: "Error al editar el estudiante Intente de nuevo." });
            });
    };

    salir = () => {
        this.props.navigate('/ListaEstudiantes');
    };

    async componentDidMount() {
        const idestudiantes = sessionStorage.getItem("IdRegistroSeleccionado");
        if (!idestudiantes) {
            this.props.navigate('/ListaEstudiantes');
            return;
        }

        const url_getid = `${urlApi}estudiantes?id=${idestudiantes}`;
        try {
            const response = await axios.get(url_getid);
            if (response.data && response.data.length > 0) {
                const usuarioData = response.data[0];
                this.setState({
                    form: {
                        ...this.state.form,
                        idestudiantes,
                        nombres: usuarioData.nombres,
                        apellidos: usuarioData.apellidos,
                        cedula: usuarioData.cedula,
                        direccion: usuarioData.direccion,
                        correo: usuarioData.correo,
                        telefono: usuarioData.telefono,
                        estado: usuarioData.estado,
                        idpadres: usuarioData.idpadres,
                   
                    }
                });
            } else {
                console.error("estudiante no encontrado");
                this.props.navigate('/ListaEstudiantes');
            }
        } catch (error) {
            console.error("Error al obtener los datos del estudiante:", error);
            this.props.navigate('/ListaEstudiantes');
        }
    }

    render() {
        const { form, error, errorMsg, success, successMsg } = this.state;

        return (
            <div className="position-absolute top-1 start-50 translate-middle-x">
                <div className="Container">
                    <h2>EDITAR ESTUDIANTES</h2>
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
                                        placeholder="Nombre"
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
                                    <label htmlFor="direccion" className="form-label">Direccion</label>
                                    <input
                                        className="form-control"
                                        name="direccion"
                                        placeholder="Direccion"
                                        type="text"
                                        value={form.direccion}
                                        onChange={this.manejadorOnchange}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="correo" className="form-label">Correo</label>
                                    <input
                                        className="form-control"
                                        name="correo"
                                        placeholder="Correo"
                                        type="text"
                                        value={form.correo}
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
                                    <label htmlFor="estado" className="form-label">Estado</label>
                                    <select className="form-control" name="estado" value={form.estado} onChange={this.manejadorOnchange}>
                                        <option value="pagado">pagado</option>
                                        <option value="debe">debe</option>
                                    </select>
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
    let navigate = useNavigate();
    return <EditarEstudiantes {...props} navigate={navigate} />;
}

export default Navegacion; 