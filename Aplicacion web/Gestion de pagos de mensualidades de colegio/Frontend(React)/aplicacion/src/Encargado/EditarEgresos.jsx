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
                idegreso: "",
                tipo: "",
                monto: "",
                fecha: "",
                idusuario: "",
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
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
    };

    put = () => {
        const url = `${urlApi}egresos`;
        axios
            .post(url, this.state.form)
            .then(response => {
                console.log(response);
                this.setState({ success: true, successMsg: "egreso editado con éxito." });
                setTimeout(() => this.props.navigate('/Egresos'), 1500);
            })
            .catch(error => {
                console.error(error);
                this.setState({ error: true, errorMsg: "Error al editar el egreso Intente de nuevo." });
            });
    };

    salir = () => {
        this.props.navigate('/Egresos');
    };

    async componentDidMount() {
        const idegreso = sessionStorage.getItem("IdRegistroSeleccionado");
        if (!idegreso) {
            this.props.navigate('/Egresos');
            return;
        }

        const url_getid = `${urlApi}egresos?id=${idegreso}`;
        try {
            const response = await axios.get(url_getid);
            if (response.data && response.data.length > 0) {
                const usuarioData = response.data[0];
                this.setState({
                    form: {
                        ...this.state.form,
                        idegreso,
                        tipo: usuarioData.tipo,
                        monto: usuarioData.monto,
                        fecha: usuarioData.fecha,
                        idusuario: usuarioData.idusuario,
                   
                    }
                });
            } else {
                console.error("egreso no encontrado");
                this.props.navigate('/Egresos');
            }
        } catch (error) {
            console.error("Error al obtener los datos del egreso:", error);
            this.props.navigate('/Egresos');
        }
    }

    render() {
        const { form, error, errorMsg, success, successMsg } = this.state;

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
                                    <label htmlFor="tipo" className="form-label">Tipo</label>
                                    <input
                                        className="form-control"
                                        name="tipo"
                                        placeholder="Tipo"
                                        type="text"
                                        value={form.tipo}
                                        onChange={this.manejadorOnchange}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="monto" className="form-label">Monto</label>
                                    <input
                                        className="form-control"
                                        name="monto"
                                        placeholder="Monto"
                                        type="decimal"
                                        value={form.monto}
                                        onChange={this.manejadorOnchange}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="fecha" className="form-label">Fecha</label>
                                    <input
                                        className="form-control"
                                        name="fecha"
                                        placeholder="Fecha"
                                        type="date"
                                        value={form.fecha}
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
    const navigate = useNavigate();
    return <EditarPersonal {...props} navigate={navigate} />;
}

export default Navegacion;


