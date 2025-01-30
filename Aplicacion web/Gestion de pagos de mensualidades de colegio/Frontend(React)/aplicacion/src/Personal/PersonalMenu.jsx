import React from "react";
import '../assets/css/PersonalMenu.css';
import miImagen from '../assets/img/imPersonal.jpg';
import { useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaUserPlus, 
  FaSchool, 
  FaChalkboardTeacher, 
  FaFileAlt, 
  FaMoneyBill, 
  FaSignOutAlt 
} from "react-icons/fa";

function MenuPersonal() {
  const navigate = useNavigate();

  const irNuevoUsuario = () => {
    navigate("/ListaPadres");
  };

  const irNuevoEstudiante = () => {
    navigate("/ListaEstudiantes");
  };

  const irLectivo = () => {
    navigate("/ListaLectivo");
  };

  const irParalelo = () => {
    navigate("/ListaParalelo");
  };

  const irMatricula = () => {
    navigate("/ListaMatricula");
  };

  const irPagos = () => {
    navigate("/ListaMatricula");
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
        <h1>MENÚ DEL PERSONAL</h1>
      </div>

      <div className="menu-card">
        <div className="section-card">
          <FaUser className="icon" />
          <h2>Usuarios</h2>
          <p>Creación de nuevos usuarios de los padres de familia.</p>
          <button className="button" onClick={irNuevoUsuario}>
            Ver Usuarios
          </button>
        </div>

        <div className="section-card">
          <FaUserPlus className="icon" />
          <h2>Registrar Estudiantes</h2>
          <p>Registra nuevos estudiantes en el sistema.</p>
          <button className="button" onClick={irNuevoEstudiante}>
            Registrar
          </button>
        </div>

        <div className="section-card">
          <FaSchool className="icon" />
          <h2>Año lectivo</h2>
          <p>Registrar/modificar los años lectivos.</p>
          <button className="button" onClick={irLectivo}>
            Ingresar
          </button>
        </div>

        <div className="section-card">
          <FaChalkboardTeacher className="icon" />
          <h2>Paralelo</h2>
          <p>Registrar/modificar los paralelos y cursos de la institución.</p>
          <button className="button" onClick={irParalelo}>
            Ingresar
          </button>
        </div>

        <div className="section-card">
          <FaFileAlt className="icon" />
          <h2>Matrícula</h2>
          <p>Registrar/modificar las matrículas.</p>
          <button className="button" onClick={irMatricula}>
            Ingresar
          </button>
        </div>

        <div className="section-card">
          <FaMoneyBill className="icon" />
          <h2>Pagos</h2>
          <p>Registrar los pagos de las mensualidades.</p>
          <button className="button" onClick={irPagos}>
            Ingresar
          </button>
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
    </div>
  );
}

export default MenuPersonal;
