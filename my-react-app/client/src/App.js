import React from 'react';
import { BrowserRouter as Navigate, Route, Routes } from 'react-router-dom';
import Menu from '../src/Componentes/Bienvenida/menu';
import Home from '../src/Componentes/Bienvenida/Home';

//Clientes
import ActualizarCliente from '../src/Componentes/Clientes/ActualizarCliente';
import BuscarCliente from '../src/Componentes/Clientes/BuscarCliente';
import EliminarCliente from '../src/Componentes/Clientes/EliminarCliente';
import ListadoClientes from '../src/Componentes/Clientes/ListadoClientes';
//Empresa
import ActualizarDatos from '../src/Componentes/Empresa/ActualizarDatos';
import VisualizarDatos from '../src/Componentes/Empresa/VisualizarDatos';
//Pendientes
import VentasPendientes from '../src/Componentes/Pendientes/VentasPendientes';
//Productos
import IngresoProducto from '../src/Componentes/Productos/IngresarProducto';
import BuscarProducto from '../src/Componentes/Productos/BuscarProducto';
import ActualizarProducto from '../src/Componentes/Productos/ActualizarProducto';
import EliminarProducto from '../src/Componentes/Productos/EliminarProducto';
import ListadoProductos from '../src/Componentes/Productos/ListadoProductos';
import StockCritico from '../src/Componentes/Productos/StockCritico'; 
//Reportes
import ReporteGral from '../src/Componentes/Reportes/ReporteGral';
//Ventas
import HistorialVentas from '../src/Componentes/Ventas/HistorialVentas';
import VentaClienteEx from '../src/Componentes/Ventas/VentaClienteEx';
import VentaClienteNu from '../src/Componentes/Ventas/VentaClienteNu';


function App() {
    return (
            <div style={{ display: 'block' }}>
                
                <div>
                    <Routes>
                        <Route path="" element={<Home />} /> {/* Ruta por defecto para que comience en home*/}
                        <Route path="/home" element={<Home />} />
                        {/*Cliente*/}
                        
                        <Route path="/ActualizarCliente" element={<ActualizarCliente />} />
                        <Route path="/BuscarCliente" element={<BuscarCliente />} />
                        <Route path="/EliminarCliente" element={<EliminarCliente />} />
                        <Route path="/ListadoClientes" element={<ListadoClientes />} />
                        {/*Empresa*/}
                        <Route path="/ActualizarDatos" element={<ActualizarDatos />} />
                        <Route path="/VisualizarDatos" element={<VisualizarDatos />} />
                        {/*Pendientes*/}
                        <Route path="/VentasPendientes" element={<VentasPendientes />} />
                        {/*Productos*/}
                        <Route path="/IngresoProducto" element={<IngresoProducto />} />
                        <Route path="/BuscarProducto" element={<BuscarProducto />} />
                        <Route path="/ActualizarProducto" element={<ActualizarProducto />} />
                        <Route path="/EliminarProducto" element={<EliminarProducto />} />
                        <Route path="/ListadoProducto" element={<ListadoProductos />} />
                        <Route path="/StockCritico" element={<StockCritico />} />
                        {/*Reporte*/}
                        <Route path="/ReporteGral" element={<ReporteGral />} />
                        {/*Ventas*/}
                        <Route path="/HistorialVentas" element={<HistorialVentas />} />
                        <Route path="/VentaClienteEx" element={<VentaClienteEx />} />
                        <Route path="/VentaClienteNu" element={<VentaClienteNu />} />
                    </Routes>
                </div>
            </div>
    );
}

export default App;
