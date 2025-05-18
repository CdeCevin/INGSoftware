import React from 'react';
import { Link } from 'react-router-dom';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';

function Menu() {
    return (
        <div>
            <div className="sidebar" style={{ width: "12%" }}>
                <Link to="/home" className='Menu-button'><i className="fa fa-home"></i> Menu</Link>
                <div className="w3-dropdown-hover">
                    <a className="w3-button"><i className="fa fa-credit-card"></i> Nueva Venta <i className="fa fa-caret-down"></i></a>
                    <div className="w3-dropdown-content w3-bar-block">
                        <Link to="/VentaClienteNu" >Cliente Nuevo</Link>
                        <Link to="/VentaClienteEx" >Cliente Antiguo</Link>
                        <Link to="/HistorialVentas" >Historial Ventas</Link>
                    </div>
                </div>
                <Link to="/VentasPendientes" className="w3-button"><i className="fa fa-clock-o" aria-hidden="true"></i> Pendientes</Link>
                <div className="w3-dropdown-hover">
                    <a className="w3-button"><i className="fa fa-address-card"></i> Clientes <i className="fa fa-caret-down"></i></a>
                    <div className="w3-dropdown-content w3-bar-block">
                        <Link to="/ActualizarCliente">Actualizar Cliente</Link>
                        <Link to="/BuscarCliente" >Buscar Cliente</Link>
                        <Link to="/EliminarCliente" >Eliminar Cliente</Link>
                        <Link to="/ListadoClientes">Listado Clientes</Link>
                    </div>
                </div>
                <div className="w3-dropdown-hover">
                    <a className="w3-button"><i className="fa fa-cubes"></i> Productos <i className="fa fa-caret-down"></i></a>
                    <div className="w3-dropdown-content w3-bar-block">
                        <Link to="/IngresoProducto" >Ingresar Producto</Link>
                        <Link to="/ActualizarProducto" >Actualizar Producto</Link>
                        <Link to="/BuscarProducto" >Buscar Producto</Link>
                        <Link to="/EliminarProducto" >Eliminar Producto</Link>
                        <Link to="/ListadoProducto" >Listado Productos</Link>
                        <Link to="/StockCritico" >Stock Crítico</Link>
                    </div>
                </div>
                <Link to="/ReporteGral" className="w3-button"><i className="fa fa-bar-chart" aria-hidden="true"></i> Reporte</Link>
                <div className="w3-dropdown-hover">
                    <a className="w3-button"><i className="fa fa-industry"></i> Datos Empresa <i className="fa fa-caret-down"></i></a>
                    <div className="w3-dropdown-content w3-bar-block">
                        <Link to="/ActualizarDatos" > Actualizar Datos</Link>
                        <Link to="/VisualizarDatos" > Visualizar Datos</Link>
                    </div>
                </div>
                <div className="w3-dropdown-hover">
                    <a className="w3-button"><i className="fa fa-user"></i> Usuarios <i className="fa fa-caret-down"></i></a>
                    <div className="w3-dropdown-content w3-bar-block">
                        <Link to="/ActualizarDatos" > Añadir Usuario</Link>
                        <Link to="/VisualizarDatos" > Actualizar Usuario</Link>
                        <Link to="/ActualizarDatos" > Eliminar Usuario</Link>
                        <Link to="/VisualizarDatos" > Listado de Usuarios</Link>
                    </div>
                </div>
                <Link to="/login" replace className='Cerrar-button'><i className="fa fa-sign-out"></i> Cerrar Sesión</Link>
            </div>
        </div>
    );
}

export default Menu;
