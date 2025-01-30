import React from "react";
import axios from "axios";
import '../assets/css/NuevoPersonal.css';
import { urlApi } from '../services/apirest';
import { useNavigate } from "react-router-dom";

class EditarLectivo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mostrarModal: false,
            form: {
                idlectivo: "",
                nombre: "",
                estado: "",
                inicia: "",
                acaba: "",
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
        const url = `${urlApi}lectivo`;
        axios
            .post(url, this.state.form)
            .then(response => {
                console.log(response);
                this.setState({ success: true, successMsg: "año lectivo editado con éxito." });
                setTimeout(() => this.props.navigate('/ListaLectivo'), 1500);
            })
            .catch(error => {
                console.error(error);
                this.setState({ error: true, errorMsg: "Error al editar año lectivo Intente de nuevo." });
            });
    };

    salir = () => {
        this.props.navigate('/ListaLectivo');
    };

    async componentDidMount() {
        const idlectivo = sessionStorage.getItem("IdRegistroSeleccionado");
        if (!idlectivo) {
            this.props.navigate('/ListaLectivo');
            return;
        }

        const url_getid = `${urlApi}lectivo?id=${idlectivo}`;
        try {
            const response = await axios.get(url_getid);
            if (response.data && response.data.length > 0) {
                const usuarioData = response.data[0];
                this.setState({
                    form: {
                        ...this.state.form,
                        idlectivo,
                        nombre: usuarioData.nombre,
                        estado: usuarioData.estado,
                        inicia: usuarioData.inicia,
                        acaba: usuarioData.acaba,

                    }
                });
            } else {
                console.error("año lectivo no encontrado");
                this.props.navigate('/ListaLectivo');
            }
        } catch (error) {
            console.error("Error al obtener los datos del año lectivo:", error);
            this.props.navigate('/ListaLectivo');
        }
    }

    render() {
        const { form, error, errorMsg, success, successMsg } = this.state;

        return (
            <div className="position-absolute top-1 start-50 translate-middle-x">
                <div className="Container">
                    <h2>EDITAR AÑO LECTIVO</h2>
                </div>
                <div className="Container">
                    <form className="form-horizontal">
                        <div className="row">
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="nombre" className="form-label">Nombre</label>
                                    <input
                                        className="form-control"
                                        name="nombre"
                                        placeholder="Nombre"
                                        type="text"
                                        value={form.nombre}
                                        onChange={this.manejadorOnchange}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="estado" className="form-label">Estado</label>
                                    <input
                                        className="form-control"
                                        name="estado"
                                        placeholder="Estado"
                                        type="text"
                                        value={form.estado}
                                        onChange={this.manejadorOnchange}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="inicia" className="form-label">Inicia</label>
                                    <input
                                        className="form-control"
                                        name="inicia"
                                        placeholder="Inicia"
                                        type="text"
                                        value={form.inicia}
                                        onChange={this.manejadorOnchange}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="acaba" className="form-label">Acaba</label>
                                    <input
                                        className="form-control"
                                        name="acaba"
                                        placeholder="Acaba"
                                        type="text"
                                        value={form.acaba}
                                        onChange={this.manejadorOnchange}
                                    />
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
    return <EditarLectivo {...props} navigate={navigate} />;
}

export default Navegacion;