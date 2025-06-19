const express = require('express');
const cors = require('cors');


const { verifyToken, authorizeRole } = require('./middleware/authMiddleware'); 

// Clientes
const buscarClienteRoutes = require('./Routes/buscarCliente');
const eliminarClienteRoutes = require('./Routes/eliminarCliente');
const clientListRoutes = require('./Routes/clientList');
const upClientesRoutes = require('./Routes/upCliente');
const anClienteRoutes = require('./Routes/anCliente'); 

// Empresa
const datosEmpresaRoutes = require('./Routes/datosEmpresa');
const upEmpresaRoutes = require('./Routes/upEmpresa');

// Pendientes
const pendientesRoutes = require('./Routes/pendientes');

// Productos
const ingresarProductosRoutes = require('./Routes/IngresarProductos');
const productListRoutes = require('./Routes/productList');
const upProductoRoutes = require('./Routes/upProducto'); 
const stockCriticoRoutes = require('./Routes/stockCritico');
const eliminarProductoRoutes = require('./Routes/eliminarProducto');
const buscarProductoRoutes = require('./Routes/buscarProducto');

// Reportes
const reportesRoutes = require('./Routes/reportes');

// Ventas
const historialVentasRoutes = require('./Routes/historialVentas');
const insertCabeceraRoutes = require('./Routes/insertCabecera');
const insertCuerpoRoutes = require('./Routes/insertCuerpo');

// Usuarios
const ingresarUsuarioRoutes = require('./Routes/IngresarUsuario');
const eliminarUsuarioRoutes = require('./Routes/eliminarUsuario');
const userListRoutes = require('./Routes/userList');
const upUserRoutes = require('./Routes/upUser');

// Login
const loginRoutes = require('./Routes/login');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Rutas Públicas (sin protección JWT) ---
// Solo el login debe ser público para obtener el token
app.use('/api/login', loginRoutes);


app.use(verifyToken); // Todas las rutas que siguen a esta línea requerirán un token válido

// --- Mapeo de Rutas y Roles ---

app.use('/api/anCliente', authorizeRole(['Administrador', 'Vendedor']), anClienteRoutes); // Añadir Cliente es para ambos

// Clientes
// Listar y Buscar Clientes: Administrador y Vendedor
app.use('/api/clientes', authorizeRole(['Administrador', 'Vendedor']), clientListRoutes);
app.use('/api/buscarCliente', authorizeRole(['Administrador', 'Vendedor']), buscarClienteRoutes);
// Actualizar Cliente: Administrador y Vendedor (según tu menú)
app.use('/api/upCliente', authorizeRole(['Administrador', 'Vendedor']), upClientesRoutes);
// Eliminar Cliente: Solo Administrador
app.use('/api/eliminarCliente', authorizeRole(['Administrador']), eliminarClienteRoutes);

// Empresa (Solo Administrador)
app.use('/api/datosEmpresa', authorizeRole(['Administrador']), datosEmpresaRoutes);
app.use('/api/upEmpresa', authorizeRole(['Administrador']), upEmpresaRoutes);

// Pendientes (Administrador y Vendedor)
app.use('/api/ventasPendientes', authorizeRole(['Administrador', 'Vendedor']), pendientesRoutes);

// Productos
// Listar y Buscar Productos: Administrador y Vendedor
app.use('/api/products', authorizeRole(['Administrador', 'Vendedor']), productListRoutes);
app.use('/api/buscarProducto', authorizeRole(['Administrador', 'Vendedor']), buscarProductoRoutes);
// Ingresar, Actualizar, Eliminar Productos: Solo Administrador
app.use('/api/ingresar_productos', authorizeRole(['Administrador']), ingresarProductosRoutes);
app.use('/api/up_producto', authorizeRole(['Administrador']), upProductoRoutes);
app.use('/api/eliminarProducto', authorizeRole(['Administrador']), eliminarProductoRoutes);
// Stock Crítico: Administrador y Vendedor
app.use('/api/stockCritico', authorizeRole(['Administrador', 'Vendedor']), stockCriticoRoutes);

// Reportes (Solo Administrador)
app.use('/api/reportes', authorizeRole(['Administrador']), reportesRoutes);

// Ventas (Administrador y Vendedor)
app.use('/api/historialVentas', authorizeRole(['Administrador', 'Vendedor']), historialVentasRoutes);
app.use('/api/insertCabecera', authorizeRole(['Administrador', 'Vendedor']), insertCabeceraRoutes);
app.use('/api/insertCuerpo', authorizeRole(['Administrador', 'Vendedor']), insertCuerpoRoutes);

// Usuarios (Solo Administrador)
app.use('/api/ingresarUsuario', authorizeRole(['Administrador']), ingresarUsuarioRoutes);
app.use('/api/eliminarUsuario', authorizeRole(['Administrador']), eliminarUsuarioRoutes);
app.use('/api/userList', authorizeRole(['Administrador']), userListRoutes);
app.use('/api/upUser', authorizeRole(['Administrador']), upUserRoutes);


const port = 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

//gtffffffffffffffffffffffffffffffffff 
//f 
 