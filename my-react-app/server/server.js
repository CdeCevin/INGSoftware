// CdeCevin/INGSoftware/my-react-app/server/server.js

const express = require('express');
const cors = require('cors');
const path = require('path');


const projectRootPath = path.resolve(__dirname, '..');

require('dotenv').config({ path: path.join(projectRootPath, '.env') });

const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

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

// Configurar Express para servir archivos estáticos
app.use('/images/Outlet', express.static(path.join(__dirname, 'public', 'images', 'outlet')));

// Rutas Públicas (sin protección JWT)
app.use('/api/login', loginRoutes);

// --- Rutas que requieren Multer (deben ir ANTES de express.json/urlencoded) ---
// La ruta de ingresar productos maneja 'multipart/form-data'

app.use(verifyToken); // Todas las rutas que siguen a esta línea requerirán un token válido
app.use('/api/ingresar_productos', authorizeRole(['Administrador']), ingresarProductosRoutes);


// --- Middlewares de Body Parser Globales (Para JSON y URL-encoded) ---
// Estos se aplicarán a todas las rutas que NO sean 'ingresar_productos' y que vienen DESPUÉS de esta línea.
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// --- Mapeo de Rutas y Roles (para las rutas protegidas) ---

// Clientes
app.use('/api/anCliente', authorizeRole(['Administrador', 'Vendedor']), anClienteRoutes);
app.use('/api/clientes', authorizeRole(['Administrador', 'Vendedor']), clientListRoutes);
app.use('/api/buscarCliente', authorizeRole(['Administrador', 'Vendedor']), buscarClienteRoutes);
app.use('/api/upCliente', authorizeRole(['Administrador', 'Vendedor']), upClientesRoutes);
app.use('/api/eliminarCliente', authorizeRole(['Administrador']), eliminarClienteRoutes);

// Empresa (Solo Administrador)
app.use('/api/datosEmpresa', authorizeRole(['Administrador']), datosEmpresaRoutes);
app.use('/api/upEmpresa', authorizeRole(['Administrador']), upEmpresaRoutes);

// Pendientes (Administrador y Vendedor)
app.use('/api/ventasPendientes', authorizeRole(['Administrador', 'Vendedor']), pendientesRoutes);

// Productos (otras rutas de productos que NO suben archivos)
app.use('/api/products', authorizeRole(['Administrador', 'Vendedor']), productListRoutes);
app.use('/api/buscarProducto', authorizeRole(['Administrador', 'Vendedor']), buscarProductoRoutes);
app.use('/api/up_producto', authorizeRole(['Administrador']), upProductoRoutes);
app.use('/api/eliminarProducto', authorizeRole(['Administrador']), eliminarProductoRoutes);
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
 