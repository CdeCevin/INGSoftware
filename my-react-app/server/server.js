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
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usar las rutas
app.use('/api/reportes', reportesRoutes);
app.use('/api/historialVentas', historialVentasRoutes);
app.use('/api/clientes', clientListRoutes);
app.use('/api/ventasPendientes', pendientesRoutes);
app.use('/api/ingresar_productos', ingresarProductosRoutes);
app.use('/api/datosEmpresa', datosEmpresaRoutes);
app.use('/api/products', productListRoutes);
app.use('/api/up_producto', upProductoRoutes); // Agregar la ruta para actualizar productos
app.use('/api/stockCritico', stockCriticoRoutes);
app.use('/api/eliminarProducto',eliminarProductoRoutes);
app.use('/api/buscarProducto',buscarProductoRoutes)


const port = 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



//gtffffffffffffffffffffffffffffffffff 
//f 
 