import React from "react";
import axios from "axios";
import '../assets/css/NuevoPersonal.css';
import { urlApi } from "../services/apirest";
import { useNavigate } from "react-router-dom";

class EditarParalelo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mostrarModal: false,
            form: {
                idparalelo: "",
                paralelo: "",
                curso: "",
                especialidad: "",
                codigo: "",
                idlectivo: localStorage.getItem('idlectivo'),
                token: localStorage.getItem('token'),
                metodo: "put"
            },
            error: false,
            errorMsg: "",
            success: false,
            successMsg: ""
        };
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
        const { paralelo, curso, especialidad, codigo, idlectivo } = this.state.form;
        return paralelo && curso && especialidad && codigo && idlectivo;
    }

    put = () => {
        const url = `${urlApi}paralelo`;
        axios
            .post(url, this.state.form)
            .then(response => {
                console.log(response);
                this.setState({ success: true, successMsg: "paralelo editado con éxito." });
                setTimeout(() => this.props.navigate('/ListaParalelo'), 1500);
            })
            .catch(error => {
                console.error(error);
                this.setState({ error: true, errorMsg: "Error al editar el paralelo Intente de nuevo." });
            });
    };


    salir = () => {
        this.props.navigate('/ListaParalelo');
    }

    async componentDidMount() {
        const idparalelo = sessionStorage.getItem("IdRegistroSeleccionado");
        if (!idparalelo) {
            this.props.navigate('/ListaParalelo');
            return;
        }

        const url_getid = `${urlApi}paralelo?id=${idparalelo}`;
        try {
            const response = await axios.get(url_getid);
            if (response.data && response.data.length > 0) {
                const usuarioData = response.data[0];
                this.setState({
                    form: {
                        ...this.state.form,
                        idparalelo,
                        paralelo: usuarioData.paralelo,
                        curso: usuarioData.curso,
                        especialidad: usuarioData.especialidad,
                        codigo: usuarioData.codigo,
                        idlectivo: usuarioData.idlectivo,

                    }
                });
            } else {
                console.error("paralelo no encontrado");
                this.props.navigate('/ListaParalelo');
            }
        } catch (error) {
            console.error("Error al obtener los datos del paralelo:", error);
            this.props.navigate('/ListaParalelo');
        }
    }

    render() {
        const { form, error, errorMsg, success, successMsg } = this.state;
        return (
            <div className="position-absolute top-1 start-50 translate-middle-x">
                <div className="Container">
                    <h2>EDITAR PARALELO</h2>
                </div>
                <div className="Container">
                    <form className="form-horizontal">
                        <div className="row">
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="paralelo" className="form-label">Paralelo</label>
                                    <input className="form-control" name="paralelo" placeholder="Paralelo" type="text" value={form.paralelo} onChange={this.manejadorOnchange} />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="curso" className="form-label">Curso</label>
                                    <input className="form-control" name="curso" placeholder="Curso" type="text"  value={form.curso} onChange={this.manejadorOnchange} />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="especialidad" className="form-label">Especialidad</label>
                                    <input className="form-control" name="especialidad" placeholder="especialidad" type="text"  value={form.especialidad} onChange={this.manejadorOnchange} />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="codigo" className="form-label">Codigo</label>
                                    <input className="form-control" name="codigo" placeholder="Codigo" type="text"  value={form.codigo} onChange={this.manejadorOnchange} />
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
    return <EditarParalelo {...props} navigate={navigate} />;
}

export default Navegacion;