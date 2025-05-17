// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './Componentes/login/login';
import Menu from './Componentes/Bienvenida/menu';
import Home from './Componentes/Bienvenida/Home';
import Inicio from './Componentes/Bienvenida/inicio';
// ... (resto de importaciones)

function LayoutWithMenu({ children }) {
  const { pathname } = useLocation();
  const hideMenuOn = ['/', '/login']; // rutas donde no queremos el menu
  const shouldHideMenu = hideMenuOn.includes(pathname);

  return (
    <div style={{ display: 'flex' }}>
      { !shouldHideMenu && <Menu /> }
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <LayoutWithMenu>
        <Routes>
          {/* Supongamos que tu Login está en la ruta "/" o "/login" */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* A partir de aquí, el Menu sí se renderiza */}
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

          {/* Reportes */}
          <Route path="/ReporteGral" element={<ReporteGral />} />

          {/* Ventas */}
          <Route path="/HistorialVentas" element={<HistorialVentas />} />
          <Route path="/VentaClienteEx" element={<VentaClienteEx />} />
          <Route path="/VentaClienteNu" element={<VentaClienteNu />} />
        </Routes>
      </LayoutWithMenu>
    </Router>
  );
}

export default App;
