// src/Componentes/Bienvenida/Menu.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';

export default function Menu() {
  // 1) Lee el rol desde localStorage  
  const role = localStorage.getItem('userRole'); // "Administrador" o "Vendedor"

  // 2) Define helpers  
  const isAdmin  = role === 'Administrador';
  const isVendor = role === 'Vendedor';

  return (
    <div className="sidebar" style={{ width: "12%" }}>
      <Link to="/home" className='Menu-button'>
        <i className="fa fa-home"></i> Menu
      </Link>

      {/* Nueva Venta: ambos roles */}
      <div className="w3-dropdown-hover">
        <a className="w3-button">
          <i className="fa fa-credit-card"></i> Nueva Venta <i className="fa fa-caret-down"></i>
        </a>
        <div className="w3-dropdown-content w3-bar-block">
          <Link to="/VentaClienteNu">Cliente Nuevo</Link>
          <Link to="/VentaClienteEx">Cliente Antiguo</Link>
          <Link to="/HistorialVentas">Historial Ventas</Link>
        </div>
      </div>

      {/* Pendientes: ambos */}
      <Link to="/VentasPendientes" className="w3-button">
        <i className="fa fa-clock-o" aria-hidden="true"></i> Pendientes
      </Link>

      {/* Clientes: ambos */}
      <div className="w3-dropdown-hover">
        <a className="w3-button">
          <i className="fa fa-address-card"></i> Clientes <i className="fa fa-caret-down"></i>
        </a>
        <div className="w3-dropdown-content w3-bar-block">
          <Link to="/ActualizarCliente">Actualizar Cliente</Link>
          <Link to="/BuscarCliente">Buscar Cliente</Link>
          <Link to="/EliminarCliente">Eliminar Cliente</Link>
          <Link to="/ListadoClientes">Listado Clientes</Link>
        </div>
      </div>

      {/* Productos: ambos */}
      <div className="w3-dropdown-hover">
        <a className="w3-button">
          <i className="fa fa-cubes"></i> Productos <i className="fa fa-caret-down"></i>
        </a>
        <div className="w3-dropdown-content w3-bar-block">
          <Link to="/IngresoProducto">Ingresar Producto</Link>
          <Link to="/ActualizarProducto">Actualizar Producto</Link>
          <Link to="/BuscarProducto">Buscar Producto</Link>
          <Link to="/EliminarProducto">Eliminar Producto</Link>
          <Link to="/ListadoProducto">Listado Productos</Link>
          <Link to="/StockCritico">Stock Crítico</Link>
        </div>
      </div>

      {/* Reporte: ambos */}
      <Link to="/ReporteGral" className="w3-button">
        <i className="fa fa-bar-chart"></i> Reporte
      </Link>

      {/* Empresa: solo admin */}
      {isAdmin && (
        <div className="w3-dropdown-hover">
          <a className="w3-button">
            <i className="fa fa-industry"></i> Datos Empresa <i className="fa fa-caret-down"></i>
          </a>
          <div className="w3-dropdown-content w3-bar-block">
            <Link to="/ActualizarDatos">Actualizar Datos</Link>
            <Link to="/VisualizarDatos">Visualizar Datos</Link>
          </div>
        </div>
      )}

      {/* Usuarios: solo admin */}
      {isAdmin && (
        <div className="w3-dropdown-hover">
          <a className="w3-button">
            <i className="fa fa-user"></i> Usuarios <i className="fa fa-caret-down"></i>
          </a>
          <div className="w3-dropdown-content w3-bar-block">
            <Link to="/AgregarUsuarios">Añadir Usuario</Link>
            <Link to="/ActualizarUsuario">Actualizar Usuario</Link>
            <Link to="/EliminarUsuario">Eliminar Usuario</Link>
            <Link to="/ListadoUsuarios">Listado de Usuarios</Link>
          </div>
        </div>
      )}

      {/* Cerrar Sesión: ambos */}
      <Link to="/login" replace className='Cerrar-button'>
        <i className="fa fa-sign-out"></i> Cerrar Sesión
      </Link>
    </div>
  );
}
