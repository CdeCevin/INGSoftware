const express = require('express');
const cors = require('cors');

    //Clientes
const buscarClienteRoutes = require('./Routes/buscarCliente');
const eliminarClienteRoutes = require('./Routes/eliminarCliente');
const clientListRoutes = require('./Routes/clientList');
const upClientesRoutes = require('./Routes/upCliente');

    //Empresa
const datosEmpresaRoutes = require('./Routes/datosEmpresa');
const upEmpresaRoutes = require('./Routes/upEmpresa');

    //Pendientes
const pendientesRoutes = require('./Routes/pendientes');

    //Productos
const ingresarProductosRoutes = require('./Routes/IngresarProductos');
const productListRoutes = require('./Routes/productList');
const upProductoRoutes = require('./Routes/upProducto'); 
const stockCriticoRoutes = require('./Routes/stockCritico');
const eliminarProductoRoutes = require('./Routes/eliminarProducto');
const buscarProductoRoutes = require('./Routes/buscarProducto');

    //Reportes
const reportesRoutes = require('./Routes/reportes');

    //Ventas
const historialVentasRoutes = require('./Routes/historialVentas');
const insertCabeceraRoutes = require('./Routes/insertCabecera');
const insertCuerpoRoutes = require('./Routes/insertCuerpo');
const boletaRoutes = require('./Routes/boleta');
const anClienteRoutes = require('./Routes/anCliente');

    //Usuarios
const ingresarUsuarioRoutes = require('./Routes/IngresarUsuario');
const eliminarUsuarioRoutes = require('./Routes/eliminarUsuario');
const userListRoutes = require('./Routes/userList');
const upUserRoutes = require('./Routes/upUser');

    //Login
const loginRoutes = require('./Routes/login');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usar las rutas


//Clientes
app.use('/api/clientes', clientListRoutes);
app.use('/api/buscarCliente',buscarClienteRoutes);
app.use('/api/eliminarCliente',eliminarClienteRoutes);
app.use('/api/upCliente',upClientesRoutes);

//Empresa
app.use('/api/datosEmpresa', datosEmpresaRoutes);
app.use('/api/upEmpresa', upEmpresaRoutes);

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
app.use('/api/insertCabecera',insertCabeceraRoutes);
app.use('/api/insertCuerpo',insertCuerpoRoutes);
app.use('/api/boleta',boletaRoutes);
app.use('/api/anCliente',anClienteRoutes);

//Usuarios
app.use('/api/ingresarUsuario', ingresarUsuarioRoutes);
app.use('/api/eliminarUsuario', eliminarUsuarioRoutes);
app.use('/api/userList', userListRoutes);
app.use('/api/upUser', upUserRoutes);
app.use('/api/login', loginRoutes);
const port = 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



//gtffffffffffffffffffffffffffffffffff 
//f 
 