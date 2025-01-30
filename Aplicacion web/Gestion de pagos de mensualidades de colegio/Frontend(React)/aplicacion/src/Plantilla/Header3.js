import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {FaSignOutAlt } from 'react-icons/fa';
import '../assets/css/Header.css';
import logo from '../assets/img/imPersonal.jpg';

class Header3 extends React.Component {
    render() {
        return (
            <header>
                <Navbar expand="lg">
                    <Container className="d-flex flex-column align-items-center">
                        <Navbar.Brand href="#home">
                            <img src={logo} alt="Logo" />
                        </Navbar.Brand>
                        <Nav className="flex-column">
                            <Link to="/" className="nav-link">
                                <FaSignOutAlt /> Salir de la página {/* Icono de salir */}
                            </Link>
                        </Nav>
                    </Container>
                </Navbar>
                <hr />
            </header>
        );
    }
}

export default Header3;
