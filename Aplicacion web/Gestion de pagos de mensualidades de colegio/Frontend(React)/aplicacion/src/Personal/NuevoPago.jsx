import React from "react";
import axios from "axios";
import '../assets/css/NuevoPersonal.css';
import { urlApi } from "../services/apirest";
import { useNavigate } from "react-router-dom";

class NuevoPago extends React.Component {
    state = {
        form: {
            "idpagos": "",
            "fecha": "",
            "pagado": "",
            "numerofactura": "",
            "tipopago": "",
            "idmatricula": localStorage.getItem('idmatricula'),
            "idusuario": sessionStorage.getItem('idusuario'),
            "token": localStorage.getItem('token'),
            "metodo": "post"
        },
        error: false,
        errorMsg: "",
        success: false,
        successMsg: ""
    };

    manejadorOnchange = async e => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.form);
    };

    validarCampos = () => {
        const { fecha, pagado, numerofactura, tipopago, idmatricula, idusuario } = this.state.form;
        return fecha && pagado && numerofactura && tipopago && idmatricula && idusuario;
    };

    post = () => {
        if (this.validarCampos()) {
            const url = `${urlApi}pagos`;
            axios
                .post(url, this.state.form)
                .then(response => {
                    this.setState({
                        success: true,
                        successMsg: "Pago registrado correctamente.",
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
    };

    salir = () => {
        this.props.navigate('/ListaPagos');
    };

    render() {
        const { idusuario, idmatricula } = this.state.form;

        return (
            <div className="position-absolute top-1 start-50 translate-middle-x">
                <div className="Container">
                    <h2>REGISTRAR PAGO</h2>
                </div>
                <div className="Container">
                    <form className="form-horizontal">
                        <div className="row">
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="fecha" className="form-label">Fecha</label>
                                    <input className="form-control" name="fecha" placeholder="Fecha" type="date" onChange={this.manejadorOnchange} />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="pagado" className="form-label">Pagado</label>
                                    <input className="form-control" name="pagado" placeholder="Pagado" type="text" onChange={this.manejadorOnchange} />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="numerofactura" className="form-label">Numero de factura</label>
                                    <input className="form-control" name="numerofactura" placeholder="Numero de factura" type="text" onChange={this.manejadorOnchange} />
                                </div>
                            </div>
                            
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="estado" className="form-label">Estado</label>
                                    <select className="form-control" name="estado" onChange={this.manejadorOnchange}>
                                        <option value="pagado">Pagado</option>
                                        <option value="pendiente">Pendiente</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="idusuario" className="form-label">ID Usuario</label>
                                    <input
                                        className="form-control"
                                        name="idusuario"
                                        type="text"
                                        value={idusuario}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="idmatricula" className="form-label">ID Matrícula</label>
                                    <input
                                        className="form-control"
                                        name="idmatricula"
                                        type="text"
                                        value={idmatricula}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="tipopago" className="form-label">Forma de pago</label>
                                    <select className="form-control" name="tipopago" onChange={this.manejadorOnchange}>
                                        <option value="Efectivo">Efectivo</option>
                                        <option value="Transferencia/deposito">Transferencia/Deposito</option>
                                    </select>
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
    return <NuevoPago {...props} navigate={navigate} />;
}

export default Navegacion;
