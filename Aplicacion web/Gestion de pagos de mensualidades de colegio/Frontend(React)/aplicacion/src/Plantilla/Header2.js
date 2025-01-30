import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FaUsers, FaUserGraduate, FaCalendarAlt, FaFileAlt, FaColumns, FaBars, FaMoneyBill } from 'react-icons/fa';
import '../assets/css/Header.css';
import logo from '../assets/img/imPersonal.jpg';

class Header2 extends React.Component {
    render() {
        return (
            <header>
                <Navbar expand="lg">
                    <Container className="d-flex flex-column align-items-center">
                        <Navbar.Brand href="#home">
                            <img src={logo} alt="Logo" />
                        </Navbar.Brand>
                        <Nav className="flex-column">
                            <Link to="/ListaPadres" className="nav-link">
                                <FaUsers /> Lista de padres {/* Icono de usuarios */}
                            </Link>
                            <Link to="/ListaEstudiantes" className="nav-link">
                                <FaUserGraduate /> Lista de estudiantes {/* Icono de estudiante */}
                            </Link>
                            <Link to="/ListaLectivo" className="nav-link">
                                <FaCalendarAlt /> Lista de años lectivos {/* Icono de calendario */}
                            </Link>
                            <Link to="/ListaLectivo" className="nav-link">
                                <FaFileAlt /> Lista de matrículas {/* Icono de archivo */}
                            </Link>
                            <Link to="/ListaParalelo" className="nav-link">
                                <FaColumns /> Lista de paralelos {/* Icono de columnas */}
                            </Link>
                            <Link to="/ListaPagos" className="nav-link">
                                <FaMoneyBill /> Lista de pagos {/* Icono de columnas */}
                            </Link>
                            <Link to="/PersonalMenu" className="nav-link">
                                <FaBars /> Menú {/* Icono de barra */}
                            </Link>
                           
                        </Nav>
                    </Container>
                </Navbar>
                <hr />
            </header>
        );
    }
}

export default Header2;
