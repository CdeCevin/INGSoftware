import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Login from './Componentes/login/login';
import Menu from './Componentes/Bienvenida/menu';
import Home from './Componentes/Bienvenida/Home';
import Inicio from './Componentes/Bienvenida/inicio';

//Clientes
import ActualizarCliente from './Componentes/Clientes/ActualizarCliente';
import BuscarCliente from './Componentes/Clientes/BuscarCliente';
import EliminarCliente from './Componentes/Clientes/EliminarCliente';
import ListadoClientes from './Componentes/Clientes/ListadoClientes';
//Empresa
import ActualizarDatos from './Componentes/Empresa/ActualizarDatos';
import VisualizarDatos from './Componentes/Empresa/VisualizarDatos';
//Pendientes
import VentasPendientes from './Componentes/Pendientes/VentasPendientes';
//Productos
import IngresoProducto from './Componentes/Productos/IngresarProducto';
import BuscarProducto from './Componentes/Productos/BuscarProducto';
import ActualizarProducto from './Componentes/Productos/ActualizarProducto';
import EliminarProducto from './Componentes/Productos/EliminarProducto';
import ListadoProductos from './Componentes/Productos/ListadoProductos';
import StockCritico from './Componentes/Productos/StockCritico';
//Reportes
import ReporteGral from './Componentes/Reportes/ReporteGral';
//Ventas
import HistorialVentas from './Componentes/Ventas/HistorialVentas';
import VentaClienteEx from './Componentes/Ventas/VentaClienteEx';
import VentaClienteNu from './Componentes/Ventas/VentaClienteNu';

import { Navigate } from 'react-router-dom';

function AppContent() {
  const location = useLocation();

  // Define rutas donde el menú no debe mostrarse
  const hideMenuRoutes = ['/', '/login'];

  const shouldHideMenu = hideMenuRoutes.includes(location.pathname);

  return (
    <div style={{ display: 'block' }}>
      {!shouldHideMenu && <Menu />}
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/Bienvenido/inicio" element={<Inicio />} />
          {/* Cliente */}
          <Route path="/ActualizarCliente" element={<ActualizarCliente />} />
          <Route path="/BuscarCliente" element={<BuscarCliente />} />
          <Route path="/EliminarCliente" element={<EliminarCliente />} />
          <Route path="/ListadoClientes" element={<ListadoClientes />} />
          {/* Empresa */}
          <Route path="/ActualizarDatos" element={<ActualizarDatos />} />
          <Route path="/VisualizarDatos" element={<VisualizarDatos />} />
          {/* Pendientes */}
          <Route path="/VentasPendientes" element={<VentasPendientes />} />
          {/* Productos */}
          <Route path="/IngresoProducto" element={<IngresoProducto />} />
          <Route path="/BuscarProducto" element={<BuscarProducto />} />
          <Route path="/ActualizarProducto" element={<ActualizarProducto />} />
          <Route path="/EliminarProducto" element={<EliminarProducto />} />
          <Route path="/ListadoProducto" element={<ListadoProductos />} />
          <Route path="/StockCritico" element={<StockCritico />} />
          {/* Reporte */}
          <Route path="/ReporteGral" element={<ReporteGral />} />
          {/* Ventas */}
          <Route path="/HistorialVentas" element={<HistorialVentas />} />
          <Route path="/VentaClienteEx" element={<VentaClienteEx />} />
          <Route path="/VentaClienteNu" element={<VentaClienteNu />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
