import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FaList, FaHome, FaFileInvoiceDollar, FaChartBar } from 'react-icons/fa'; // Importa los iconos
import '../assets/css/Header.css';
import logo from '../assets/img/imPersonal.jpg';

class Header extends React.Component {
    render() {
        return (
            <header>
                <Navbar expand="lg">
                    <Container className="d-flex flex-column align-items-center">
                        <Navbar.Brand href="#home">
                            <img src={logo} alt="Logo" /> {/* Logo en la parte superior izquierda */}
                        </Navbar.Brand>
                        <Nav className="flex-column">
                            <Link to="/ListaPersonal" className="nav-link">
                                <FaList /> Lista del Personal {/* Icono de lista */}
                            </Link>
                            <Link to="/Dashboard" className="nav-link">
                                <FaHome /> Menú {/* Icono de inicio */}
                            </Link>
                            <Link to="/Reportes" className="nav-link">
                                <FaFileInvoiceDollar /> Reporte de pagos {/* Icono de reporte*/}
                            </Link>
                            <Link to="/Egresos" className="nav-link">
                                <FaChartBar /> Egresos y ingresos {/* Icono de egresos */}
                            </Link>
                        </Nav>
                    </Container>
                </Navbar>
                <hr />
            </header>
        );
    }
}

export default Header;

