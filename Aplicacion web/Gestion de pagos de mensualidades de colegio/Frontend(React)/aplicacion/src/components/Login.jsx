import React from "react";
import '../assets/css/Login.css';
import { urlApi } from "../services/apirest";
import axios from "axios";
import { useNavigate } from "react-router-dom";

class Login extends React.Component {
    state = {
        form: {
            "usuario": "",
            "contrasena": ""
        },
        error: false,
        errorMsg: ""
    };

    manejadorOnchange = async (e) => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
    };

    manejadorLogin = () => {
        const { usuario, contrasena } = this.state.form;
    
        if (!usuario || !contrasena) {
            this.setState({
                error: true,
                errorMsg: "Todos los campos son obligatorios"
            });
            return;
        }
    
        let url = urlApi + "auth.php";
        axios.post(url, this.state.form)
            .then(response => {
                if (response.data.status === "ok") {
                    // Guardar token en sessionStorage
                    sessionStorage.setItem("token", response.data.result.token);
                    const puesto = response.data.result.puesto;
                    const idusuario = response.data.result.idusuario; // Obtener el idusuario
    
                    // Almacenar idusuario en sessionStorage
                    sessionStorage.setItem("idusuario", idusuario);
    
                    if (puesto === "Encargado") {
                        this.props.navigate('/Dashboard');
                    } else if (puesto === "Personal") {
                        this.props.navigate(`/PersonalMenu?idusuario=${idusuario}`);
                    } else if (puesto === "Padre") {
                        const cedula = response.data.result.cedula;
                        this.props.navigate(`/PagoPadres?cedula=${cedula}`);
                    }
                } else {
                    this.setState({
                        error: true,
                        errorMsg: response.data.result.error_msg
                    });
                }
            })
            .catch(() => {
                this.setState({
                    error: true,
                    errorMsg: "Error de conexión"
                });
            });
    };    

    render() {
        return (
            <React.Fragment>
                <section className="login-page vh-100">
                    <div className="container-login">
                        <form>
                            <div className="divider d-flex align-items-center my-4">
                                <p className="text-center fw-bold mx-3 mb-0">COLEGIO PARTICULAR MIXTO IBEROAMERICANO</p>
                            </div>

                            <div className="form-outline mb-4">
                                <input
                                    type="text"
                                    id="form3Example3"
                                    className="form-control form-control-lg"
                                    name="usuario"
                                    placeholder="Ingrese su usuario"
                                    onChange={this.manejadorOnchange}
                                />
                                <label className="form-label" htmlFor="form3Example3">Usuario</label>
                            </div>

                            <div className="form-outline mb-3">
                                <input
                                    type="password"
                                    id="form3Example4"
                                    className="form-control form-control-lg"
                                    name="contrasena"
                                    placeholder="Ingrese su contraseña"
                                    onChange={this.manejadorOnchange}
                                />
                                <label className="form-label" htmlFor="form3Example4">Contraseña</label>
                            </div>

                            <div className="text-center text-lg-start mt-4 pt-2">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-lg"
                                    onClick={this.manejadorLogin}
                                >
                                    Entrar
                                </button>
                            </div>
                        </form>

                        {this.state.error && (
                            <div className="alert alert-danger" role="alert">
                                {this.state.errorMsg}
                            </div>
                        )}
                    </div>
                </section>
            </React.Fragment>
        );
    }
}

function Navegacion(props) {
    let navigate = useNavigate();
    return <Login {...props} navigate={navigate} />;
}

export default Navegacion;

