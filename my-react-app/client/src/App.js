import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Login from './Componentes/login/login';
import Menu from './Componentes/Bienvenida/menu';
import Home from './Componentes/Bienvenida/Home';
import Inicio from './Componentes/Bienvenida/inicio';

// ... (all your other imports) ...

// A component for pages that *do* have the sidebar
function StandardLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      <Menu />
      <div className="content" style={{ flexGrow: 1 }}> {/* Content takes remaining space */}
        {children}
      </div>
    </div>
  );
}

// A component for the login page (no sidebar, centered)
function LoginLayout({ children }) {
  return (
    <div style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        justifyContent: 'center', // Center content horizontally
        alignItems: 'center',     // Center content vertically
        backgroundColor: '#f5f5f5' // Example background for login page
    }}>
      {children}
    </div>
  );
}

function App() {
  const location = useLocation(); // Keep useLocation here if you prefer to use it to decide which layout to render

  // Determine if the current path is a "no sidebar" path
  const hideMenuOn = ['/', '/login'];
  const shouldHideMenu = hideMenuOn.includes(location.pathname);

  return (
    <Routes>
      {/* Route for Login page (uses LoginLayout) */}
      <Route path="/" element={<LoginLayout><Login /></LoginLayout>} />
      <Route path="/login" element={<LoginLayout><Login /></LoginLayout>} />

      {/* Routes for pages with the menu (uses StandardLayout) */}
      <Route path="/home" element={<StandardLayout><Home /></StandardLayout>} />
      <Route path="/Bienvenido/inicio" element={<StandardLayout><Inicio /></StandardLayout>} />

      {/* Clientes */}
      <Route path="/ActualizarCliente" element={<StandardLayout><ActualizarCliente /></StandardLayout>} />
      <Route path="/BuscarCliente" element={<StandardLayout><BuscarCliente /></StandardLayout>} />
      <Route path="/EliminarCliente" element={<StandardLayout><EliminarCliente /></StandardLayout>} />
      <Route path="/ListadoClientes" element={<StandardLayout><ListadoClientes /></StandardLayout>} />

      {/* Empresa */}
      <Route path="/ActualizarDatos" element={<StandardLayout><ActualizarDatos /></StandardLayout>} />
      <Route path="/VisualizarDatos" element={<StandardLayout><VisualizarDatos /></StandardLayout>} />

      {/* Pendientes */}
      <Route path="/VentasPendientes" element={<StandardLayout><VentasPendientes /></StandardLayout>} />

      {/* Productos */}
      <Route path="/IngresoProducto" element={<StandardLayout><IngresoProducto /></StandardLayout>} />
      <Route path="/BuscarProducto" element={<StandardLayout><BuscarProducto /></StandardLayout>} />
      <Route path="/ActualizarProducto" element={<StandardLayout><ActualizarProducto /></StandardLayout>} />
      <Route path="/EliminarProducto" element={<StandardLayout><EliminarProducto /></StandardLayout>} />
      <Route path="/ListadoProducto" element={<StandardLayout><ListadoProductos /></StandardLayout>} />
      <Route path="/StockCritico" element={<StandardLayout><StockCritico /></StandardLayout>} />

      {/* Reportes */}
      <Route path="/ReporteGral" element={<StandardLayout><ReporteGral /></StandardLayout>} />

      {/* Ventas */}
      <Route path="/HistorialVentas" element={<StandardLayout><HistorialVentas /></StandardLayout>} />
      <Route path="/VentaClienteEx" element={<StandardLayout><VentaClienteEx /></StandardLayout>} />
      <Route path="/VentaClienteNu" element={<StandardLayout><VentaClienteNu /></StandardLayout>} />

      {/* Usuarios */}
      <Route path="/AgregarUsuarios" element={<StandardLayout><AgregarUsuarios /></StandardLayout>} />
      <Route path="/EliminarUsuario" element={<StandardLayout><EliminarUsuario /></StandardLayout>} />
      <Route path="/ActualizarUsuario" element={<StandardLayout><ActualizarUsuario /></StandardLayout>} />
      <Route path="/ListadoUsuarios" element={<StandardLayout><ListadoUsuarios /></StandardLayout>} />
    </Routes>
  );
}

export default App;