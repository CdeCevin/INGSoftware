const express = require('express');
const cors = require('cors');

const reportesRoutes = require('./Routes/reportes');
const historialVentasRoutes = require('./Routes/historialVentas');
const clientListRoutes = require('./Routes/clientList');
const pendientesRoutes = require('./Routes/pendientes');
const ingresarProductosRoutes = require('./Routes/IngresarProductos');
const datosEmpresaRoutes = require('./Routes/datosEmpresa');
const productListRoutes = require('./Routes/productList');
const upProductoRoutes = require('./Routes/upProducto'); // Importar la nueva ruta
const stockCriticoRoutes = require('./Routes/stockCritico');
const eliminarProductoRoutes = require('./Routes/eliminarProducto');
const buscarProductoRoutes = require('./Routes/buscarProducto');
//const insertCabeceraRoutes = require('./Routes/insertCabecera');
const buscarClienteRoutes = require('./Routes/buscarCliente');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usar las rutas





//Clientes
app.use('/api/clientes', clientListRoutes);
app.use('/api/buscarCliente',buscarClienteRoutes);
//Empresa
app.use('/api/datosEmpresa', datosEmpresaRoutes);

//Pendientes
app.use('/api/ventasPendientes', pendientesRoutes);

//Productos
app.use('/api/ingresar_productos', ingresarProductosRoutes);
app.use('/api/products', productListRoutes);
app.use('/api/up_producto', upProductoRoutes);
app.use('/api/stockCritico', stockCriticoRoutes);
app.use('/api/eliminarProducto',eliminarProductoRoutes);
app.use('/api/buscarProducto',buscarProductoRoutes);

//Reportes
app.use('/api/reportes', reportesRoutes);

//Ventas
app.use('/api/historialVentas', historialVentasRoutes);
//app.use('/api/insertCabecera',insertCabeceraRoutes);





const port = 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



//gtffffffffffffffffffffffffffffffffff 
//f 
 