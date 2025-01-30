import React from "react";
import axios from "axios";
import '../assets/css/NuevoPersonal.css';
import { urlApi } from "../services/apirest";
import { useNavigate } from "react-router-dom";

class EditarPago extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mostrarModal: false,
            form: {
                idpagos: "",
                fecha: "",
                pagado: "",
                numerofactura: "",
                tipopago: "",
                idmatricula: localStorage.getItem('idmatricula'),
                idusuario: sessionStorage.getItem('idusuario'),
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
        const { fecha, pagado, numerofactura, tipopago, idmatricula, idusuario } = this.state.form;
        return fecha && pagado && numerofactura && tipopago && idmatricula && idusuario;
    }

    put = () => {
        const url = `${urlApi}pagos`;
        axios
            .post(url, this.state.form)
            .then(response => {
                console.log(response);
                this.setState({ success: true, successMsg: "Pago editado con éxito." });
                setTimeout(() => this.props.navigate('/ListaPagos'), 1500);
            })
            .catch(error => {
                console.error(error);
                this.setState({ error: true, errorMsg: "Error al editar el pago. Intente de nuevo." });
            });
    };

    salir = () => {
        this.props.navigate('/ListaPagos');
    }

    async componentDidMount() {
        const idpagos = sessionStorage.getItem("IdRegistroSeleccionado");
        if (!idpagos) {
            this.props.navigate('/ListaPagos');
            return;
        }

        const url_getid = `${urlApi}pagos?id=${idpagos}`;
        try {
            const response = await axios.get(url_getid);
            if (response.data && response.data.length > 0) {
                const pagoData = response.data[0];
                this.setState({
                    form: {
                        ...this.state.form,
                        idpagos,
                        fecha: pagoData.fecha,
                        pagado: pagoData.pagado,
                        numerofactura: pagoData.numerofactura,
                        tipopago: pagoData.tipopago,
                        idmatricula: pagoData.idmatricula,
                        idusuario: pagoData.idusuario,
                    }
                });
            } else {
                console.error("Pago no encontrado");
                this.props.navigate('/ListaPagos');
            }
        } catch (error) {
            console.error("Error al obtener los datos del pago:", error);
            this.props.navigate('/ListaPagos');
        }
    }

    render() {
        const { form, error, errorMsg, success, successMsg } = this.state;
        return (
            <div className="position-absolute top-1 start-50 translate-middle-x">
                <div className="Container">
                    <h2>EDITAR PAGO</h2>
                </div>
                <div className="Container">
                    <form className="form-horizontal">
                        <div className="row">
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="fecha" className="form-label">Fecha</label>
                                    <input className="form-control" name="fecha" placeholder="Fecha" type="date" value={form.fecha} onChange={this.manejadorOnchange} />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="pagado" className="form-label">Pagado</label>
                                    <input className="form-control" name="pagado" placeholder="Pagado" type="text" value={form.pagado} onChange={this.manejadorOnchange} />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="numerofactura" className="form-label">Número de factura</label>
                                    <input className="form-control" name="numerofactura" placeholder="Número de factura" type="text" value={form.numerofactura} onChange={this.manejadorOnchange} />
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mb-1">
                                    <label htmlFor="tipopago" className="form-label">Forma de pago</label>
                                    <select className="form-control" name="tipopago" value={form.tipopago} onChange={this.manejadorOnchange}>
                                        <option value="Efectivo">Efectivo</option>
                                        <option value="Transferencia/deposito">Transferencia/Depósito</option>
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
    return <EditarPago {...props} navigate={navigate} />;
}

export default Navegacion;
