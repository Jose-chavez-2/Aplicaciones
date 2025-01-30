import React from 'react';
import './assets/css/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Encargado/Dashboard';
import Login from './components/Login';
import NuevoUsuariosPadres from './Personal/NuevoUsuariosPadres';
import NuevoPersonal from './Encargado/NuevoPersonal';
import EditarPersonal from './Encargado/EditarPersonal';
import Reportes from './Encargado/Reportes';
import PagoPadres from './Padres/PagoPadres';
import EditarPadres from './Personal/EditarPadres';
import ListaPersonal from './Encargado/ListaPersonal';
import ListaPadres from './Personal/ListaPadres';
import ListaEstudiantes from './Personal/ListaEstudiantes';
import PersonalMenu from './Personal/PersonalMenu';
import ListaLectivo from './Personal/ListaLectivo';
import ListaParalelo from './Personal/ListaParalelo';
import ListaPagos from './Personal/ListaPagos';
import ListaMatricula from './Personal/ListaMatricula';
import NuevaMatricula from './Personal/NuevaMatricula';
import NuevoLectivo from './Personal/NuevoLectivo';
import NuevoParalelo from './Personal/NuevoParalelo';
import NuevoPago from './Personal/NuevoPago';
import EditarEstudiantes from './Personal/EditarEstudiantes';
import EditarParalelo from './Personal/EditarParalelo';
import EditarLectivo from './Personal/EditarLectivo';
import EditarPagos from './Personal/EditarPagos';
import EditarMatricula from './Personal/EditarMatricula';
import Egresos from './Encargado/Egresos';
import NuevoEgresos from './Encargado/NuevoEgresos';
import EditarEgresos from './Encargado/EditarEgresos';
import RegistrarEstudiantes from './Personal/RegistrarEstudiantes';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      NoModal: true,
      idForaneo: "0",
      datoForaneo: "0"
    };
    this.EditarVariable = this.EditarVariable.bind(this);
  }

  EditarVariable = (valorid, valorDato) => {
    this.setState({ 
      idForaneo: valorid,
      datoForaneo: valorDato
     });
  }
render() {
    return (
      <React.Fragment>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/EditarPersonal" element={<EditarPersonal />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/personalmenu" element={<PersonalMenu />} />
            <Route path="/NuevoPersonal" element={<NuevoPersonal />} />
            <Route path="/NuevoUsuariosPadres" element={<NuevoUsuariosPadres />} />
            <Route path="/RegistrarEstudiantes" element={<RegistrarEstudiantes NoModal={this.state.NoModal} />} />
            <Route path="/ListaPersonal" element={<ListaPersonal />} />
            <Route path="/ListaPadres" element={<ListaPadres />} />
            <Route path="/ListaEstudiantes" element={<ListaEstudiantes />} />
            <Route path="/ListaLectivo" element={<ListaLectivo />} />
            <Route path="/ListaParalelo" element={<ListaParalelo />} />
            <Route path="/ListaMatricula" element={<ListaMatricula />} />
            <Route path="/ListaPagos" element={<ListaPagos />} />
            <Route path="/EditarEstudiantes" element={<EditarEstudiantes />} />
            <Route path="/EditarPadres" element={<EditarPadres />} />
            <Route path="/EditarLectivo" element={<EditarLectivo />} />
            <Route path="/NuevoLectivo" element={<NuevoLectivo />} />
            <Route path="/NuevaMatricula"element={<NuevaMatricula EditarVariable={this.EditarVariable} idForaneo={this.state.idForaneo} datoForaneo={this.state.datoForaneo} ModoModal={this.state.ModoModal}/>}/>
            <Route path="/NuevoParalelo" element={<NuevoParalelo />} />
            <Route path="/NuevoPago" element={<NuevoPago />} />
            <Route path="/Reportes" element={<Reportes />} />
            <Route path="/EditarParalelo" element={<EditarParalelo />} />
            <Route path="/EditarPagos" element={<EditarPagos />} />
            <Route path="/EditarMatricula" element={<EditarMatricula />} />
            <Route path="/Egresos" element={<Egresos />} />
            <Route path="/NuevoEgresos" element={<NuevoEgresos />} />
            <Route path="/EditarEgresos" element={<EditarEgresos />} />
            <Route path="/PagoPadres" element={<PagoPadres />} />
          </Routes>
        </Router>
      </React.Fragment>
    );
  }
}

export default App;