import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import authenticatedFetch from '../../utils/api'; // Assuming you have this utility

function ReporteGral() {
    const [ventasMensuales, setVentasMensuales] = useState(null);
    const [topProductos, setTopProductos] = useState([]);
    const [menosVendidos, setMenosVendidos] = useState([]);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const navigate = useNavigate(); 
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        document.title = 'Reporte General';
        const allowedRoles = ['Administrador'];

        if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
            navigate('/login');
        }
    }, [userRole, navigate]);
    const obtenerReportes = async () => {
        try {
            const params = new URLSearchParams();
            if (fechaInicio) params.append('fechaInicio', fechaInicio);
            if (fechaFin) params.append('fechaFin', fechaFin);

            const queryString = params.toString();

            // Fetch ventas mensuales
            const responseVentas = await authenticatedFetch(`/reportes/ventas-mensuales${queryString ? `?${queryString}` : ''}`);
            if (responseVentas.status === 401 || responseVentas.status === 403) {
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userRut');
                navigate('/login');
                return; 
            }
            const dataVentas = await responseVentas.json();
            setVentasMensuales(dataVentas.totalVentas);

            const responseTop = await authenticatedFetch(`/reportes/top-productos${queryString ? `?${queryString}` : ''}`);
            if (responseTop.status === 401 || responseTop.status === 403) {
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userRut');
                navigate('/login');
                return;
            }
            const dataTop = await responseTop.json();
            setTopProductos(dataTop);

            const responseMenos = await authenticatedFetch(`/reportes/menos-vendidos${queryString ? `?${queryString}` : ''}`);
            if (responseMenos.status === 401 || responseMenos.status === 403) {
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userRut');
                navigate('/login');
                return;
            }
            const dataMenos = await responseMenos.json();
            setMenosVendidos(dataMenos);

        } catch (error) {
            console.error('Error al obtener los reportes:', error);

        }
    };

    const handleBuscar = (event) => {
        event.preventDefault();
        obtenerReportes();
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            obtenerReportes();
        }
    }, []); 


    const allowedRoles = ['Administrador'];
    if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
        return (
            <div className="main-block">
                <h1>Redirigiendo...</h1>
            </div>
        );
    }

    return (
        <div className="main-block">
            <form onSubmit={handleBuscar}>
                <h1>Reporte de Ventas</h1>
                <fieldset>
                    <h3>Ventas Totales</h3>
                    <div className="account-details" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: '1', display: 'flex', alignItems: 'center', marginLeft: '50px' }}>
                            <h2>${ventasMensuales !== null ? ventasMensuales : 'Cargando...'}</h2>
                        </div>
                        <div style={{ flex: '1', display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                            <label>Desde</label>
                            <input
                                type="date"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                            />
                        </div>
                        <div style={{ flex: '1', display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                            <label>Hasta</label>
                            <input
                                type="date"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                            />
                        </div>

                        <div style={{ flex: '1', display: 'flex', alignItems: 'center', marginTop: '13px', marginLeft: '10px' }}>
                            <button type="submit" style={{ width: '50px', padding: '5px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', margin: '0px' }} className={"btn mini-boton"}>
                                <i className="fa fa-search"></i>
                            </button>
                        </div>
                    </div>
                </fieldset>
            </form>
            <fieldset>
                <h3>Top Productos</h3>
                <div>
                    <table className="tabla-productos">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Total Ventas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topProductos.length > 0 ? (
                                topProductos.map((producto, index) => (
                                    <tr key={index}>
                                        <td>{producto[0]}</td>
                                        <td>{producto[1]}</td>
                                        <td>${producto[2]}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">No hay datos para mostrar.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </fieldset>
            <fieldset>
                <h3>Productos Menos Vendidos</h3>
                <div>
                    <table className="tabla-productos">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Total Ventas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menosVendidos.length > 0 ? (
                                menosVendidos.map((producto, index) => (
                                    <tr key={index}>
                                        <td>{producto[0]}</td>
                                        <td>{producto[1]}</td>
                                        <td>${producto[2]}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">No hay datos para mostrar.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </fieldset>
        </div>
    );
}

export default ReporteGral;