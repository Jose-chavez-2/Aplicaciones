import React from "react";
import '../assets/css/Dashboard.css';
import { useNavigate } from "react-router-dom";
import miImagen from '../assets/img/imPersonal.jpg';
import { FaUser, FaFileInvoiceDollar, FaChartBar, FaSignOutAlt  } from "react-icons/fa";


function MenuEncargado() {
  const navigate = useNavigate();
  

  const irNuevoUsuario = () => {
    navigate("/ListaPersonal");
  };

  const irVerPagos = () => {
    navigate("/Reportes");
  };

  const irEgresos = () => {
    navigate("/Egresos");
  };
  const irSalir = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container-menu">
      <div className="logo-container text-center">
        <img src={miImagen} className="img-fluid logo w-50" alt="Logo" />
      </div>

      <div className="menu-title text-center">
        <h1>MENU DEL ADMINISTRADOR</h1>
      </div>
      <div className="menu-card">
        <div className="section-card">
          <FaUser className="icon" />
          <h2>Creacion de Usuarios</h2>
          <p>Creacion de Nuevos usuarios de Encargado y personal.</p>
          <button className="button" onClick={irNuevoUsuario}>
            Ver Usuarios
          </button>
        </div>

        <div className="section-card">
          <FaFileInvoiceDollar className="icon" />
          <h2>Creacion de reportes</h2>
          <p>creacion de reportes de los pagos de las mensualidades.</p>
          <button className="button" onClick={irVerPagos}>
            Nuevo Pago
          </button>
        </div>

        <div className="section-card">
          <FaChartBar className="icon" />
          <h2>Calcular egresos</h2>
          <p>Calcula los ingresos y egregsos.</p>
          <button className="button" onClick={irEgresos}>
            Ver Informes
          </button>
        </div>
      </div>
      <div className="section-card">
      <FaSignOutAlt className="icon" />
        <h2>Salir</h2>
        <p>Salir de la página.</p>
        <button className="button" onClick={irSalir}>
          Salir
        </button>
      </div>
    </div>
  );
}

export default MenuEncargado;