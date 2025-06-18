import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Login from './Componentes/login/login';
import Menu from './Componentes/Bienvenida/menu';
import Home from './Componentes/Bienvenida/Home';
import Inicio from './Componentes/Bienvenida/inicio';

// Clientes
import ActualizarCliente from './Componentes/Clientes/ActualizarCliente';
import BuscarCliente from './Componentes/Clientes/BuscarCliente';
import EliminarCliente from './Componentes/Clientes/EliminarCliente';
import ListadoClientes from './Componentes/Clientes/ListadoClientes';
// Empresa
import ActualizarDatos from './Componentes/Empresa/ActualizarDatos';
import VisualizarDatos from './Componentes/Empresa/VisualizarDatos';
// Pendientes
import VentasPendientes from './Componentes/Pendientes/VentasPendientes';
// Productos
import IngresoProducto from './Componentes/Productos/IngresarProducto';
import BuscarProducto from './Componentes/Productos/BuscarProducto';
import ActualizarProducto from './Componentes/Productos/ActualizarProducto';
import EliminarProducto from './Componentes/Productos/EliminarProducto';
import ListadoProductos from './Componentes/Productos/ListadoProductos';
import StockCritico from './Componentes/Productos/StockCritico';
// Reportes
import ReporteGral from './Componentes/Reportes/ReporteGral';
// Ventas
import HistorialVentas from './Componentes/Ventas/HistorialVentas';
import VentaClienteEx from './Componentes/Ventas/VentaClienteEx';
import VentaClienteNu from './Componentes/Ventas/VentaClienteNu';
import PaginaComprobante from './Componentes/Ventas/PaginaComprobante';


// Usuarios
import AgregarUsuarios from './Componentes/Usuarios/AgregarUsuarios';
import EliminarUsuario from './Componentes/Usuarios/EliminarUsuario';
import ActualizarUsuario from './Componentes/Usuarios/ActualizarUsuario';
import ListadoUsuarios from './Componentes/Usuarios/ListadoUsuarios';

function LayoutWithMenu({ children }) {
  const { pathname } = useLocation();
  const hideMenuOn = ['/', '/login','comprobante']; // rutas sin menú
  const shouldHideMenu = hideMenuOn.includes(pathname);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      {!shouldHideMenu && <Menu />}
      <div
        className="content"
        style={shouldHideMenu ? {
            marginLeft: 0,
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100vw', // Ensures it spans full viewport width when sidebar is hidden
            // Optional: If your login page needs a specific background color when centered, add it here.
            // backgroundColor: '#f0f2f5'
        } : { flexGrow: 1 }}
      >
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <LayoutWithMenu>
      <Routes>
        {/* Rutas sin menú */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/comprobante" element={<PaginaComprobante />}/>

        {/* Rutas con menú */}
        <Route path="/home" element={<Home />} />
        <Route path="/Bienvenido/inicio" element={<Inicio />} />

        {/* Clientes */}
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

        {/* Reportes */}
        <Route path="/ReporteGral" element={<ReporteGral />} />

        {/* Ventas */}
        <Route path="/HistorialVentas" element={<HistorialVentas />} />
        <Route path="/VentaClienteEx" element={<VentaClienteEx />} />
        <Route path="/VentaClienteNu" element={<VentaClienteNu />} />

        {/* Usuarios */}
        <Route path="/AgregarUsuarios" element={<AgregarUsuarios />} />
        <Route path="/EliminarUsuario" element={<EliminarUsuario />} />
        <Route path="/ActualizarUsuario" element={<ActualizarUsuario />} />
        <Route path="/ListadoUsuarios" element={<ListadoUsuarios />} />

      </Routes>
    </LayoutWithMenu>
  );
}

export default App;