import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importa useNavigate
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';

export default function Menu() {
  const role = localStorage.getItem('userRole');
  const isAdmin  = role === 'Administrador';
  const isVendor = role === 'Vendedor';
  const navigate = useNavigate(); // Inicializa useNavigate aquí

  // Nueva función para manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userRut'); 
    document.title = 'Outlet A Tu Hogar';
    navigate('/login', { replace: true });
  };

  return (
    <div className="sidebar">
      {/* Siempre visible */}
      <Link to="/home" className="Menu-button">
        <i className="fa fa-home"></i> Menu
      </Link>

      {/* VENTAS: ambos roles */}
      <div className="w3-dropdown-hover">
        <a className="w3-button">
          <i className="fa fa-credit-card"></i> Nueva Venta <i className="fa fa-caret-down"></i>
        </a>
        <div className="w3-dropdown-content w3-bar-block">
          <Link to="/VentaClienteNu">Cliente Nuevo</Link>
          <Link to="/VentaClienteEx">Cliente Antiguo</Link>
          {isVendor && <Link to="/HistorialVentas">Historial de Ventas</Link>}
          {isAdmin  && <Link to="/HistorialVentas">Historial de Ventas</Link>}
        </div>
      </div>

      {/* PENDIENTES: ambos */}
      <Link to="/VentasPendientes" className="w3-button">
        <i className="fa fa-clock-o"></i> Ventas Pendientes
      </Link>

      {/* PRODUCTOS */}
      <div className="w3-dropdown-hover">
        <a className="w3-button">
          <i className="fa fa-cubes"></i> Productos <i className="fa fa-caret-down"></i>
        </a>
        <div className="w3-dropdown-content w3-bar-block">
          {/* Vendedor puede BUSCAR y LISTAR */}
          {(isVendor || isAdmin) && <Link to="/BuscarProducto">Buscar Producto</Link>}
          {(isVendor || isAdmin) && <Link to="/ListadoProducto">Listado Productos</Link>}

          {/* Solo Admin: ABM y Stock crítico */}
          {isAdmin && <Link to="/IngresoProducto">Ingresar Producto</Link>}
          {isAdmin && <Link to="/ActualizarProducto">Actualizar Producto</Link>}
          {isAdmin && <Link to="/EliminarProducto">Eliminar Producto</Link>}
          {isAdmin && <Link to="/StockCritico">Stock Crítico</Link>}
        </div>
      </div>

      {/* CLIENTES */}
      <div className="w3-dropdown-hover">
        <a className="w3-button">
          <i className="fa fa-address-card"></i> Clientes <i className="fa fa-caret-down"></i>
        </a>
        <div className="w3-dropdown-content w3-bar-block">
          {/* Ambos pueden CONSULTAR y LISTAR */}
          {(isVendor || isAdmin) && <Link to="/BuscarCliente">Buscar Cliente</Link>}
          {(isVendor || isAdmin) && <Link to="/ListadoClientes">Listado Clientes</Link>}

          {/* Solo Admin: ABM de cliente */}
          {isAdmin && <Link to="/ActualizarCliente">Actualizar Cliente</Link>}
          {isAdmin && <Link to="/EliminarCliente">Eliminar Cliente</Link>}
        </div>
      </div>

      {/* REPORTE: ambos */}
      {isAdmin && (
      <Link to="/ReporteGral" className="w3-button">
        <i className="fa fa-bar-chart"></i> Reporte
      </Link>
      )}
      {/* EMPRESA: solo ADMIN */}
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

      {/* USUARIOS: solo ADMIN */}
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

      <a onClick={handleLogout} className="Cerrar-button" ><i className="fa fa-sign-out"></i> Cerrar Sesión</a>
    </div>
  );
}
