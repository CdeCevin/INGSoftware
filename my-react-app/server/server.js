const express = require('express');
const cors = require('cors');
const reportesRoutes = require('./Routes/reportes'); // Rutas de reportes
const historialVentasRoutes = require('./Routes/historialVentas'); // Rutas de historial de Ventas
const clientListRoutes = require('./Routes/clientList'); // Rutas de lista de clientes
const pendientesRoutes = require('./Routes/pendientes'); // Rutas de pendientes
const ingresarProductosRoutes = require('./Routes/IngresarProductos'); // Rutas de insertar productos
const datosEmpresaRoutes = require('./Routes/datosEmpresa');
const productListRoutes = require('./Routes/productList');


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para manejar datos de formularios

// Usar las rutas
app.use('/api/reportes', reportesRoutes);
app.use('/api/historialVentas', historialVentasRoutes);
app.use('/api/clientes', clientListRoutes); // Agregar la ruta para los clientes
app.use('/api/pendientes', pendientesRoutes);
app.use('/api/ingresar_productos', ingresarProductosRoutes); // Agregar la ruta para insertar productos
app.use('/api/datosEmpresa', datosEmpresaRoutes);
app.use('/api', productRoutes); // '/api/products' llamará a getProducts

const port = 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


//gtffffffffffffffffffffffffffffffffff 
//f 
 