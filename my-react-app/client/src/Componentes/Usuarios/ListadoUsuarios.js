    import React, { useEffect, useState } from 'react';
    import '../../Estilos/style_menu.css';
    import '../../Estilos/estilo.css';
    import Modal from 'react-modal';

    const ListadoUsuarios = () => {
        console.log("HOLAA");
        const [Usuarios, setUsuarios] = useState([]);
        const [cargando, setCargando] = useState(true);
        const [error, setError] = useState(null);

        useEffect(() => {
            document.title = 'Listado Usuarios';
        }, []);

        useEffect(() => {
            const obtenerUsuarios = async () => {
                setCargando(true);
                console.log("Iniciando la obtención de Usuarios");
                try {
                    const response = await fetch('http://localhost:3001/api/products');
                    console.log("Respuesta de la API:", response);
                    if (!response.ok) {
                        throw new Error('Error en la red al obtener los Usuarios');
                    }
                    const data = await response.json();
                    console.log("Datos recibidos:", data);
                    // Convertir array de arrays a array de objetos
                    const UsuariosFormateados = data.map((Usuario) => ({
                        Codigo_Usuario: Usuario[0],
                        Stock: Usuario[1],
                        Stock_Minimo: Usuario[2],
                        Precio_Unitario: Usuario[3],
                        Nombre_Usuario: Usuario[4],
                        Categoria: Usuario[5],
                        Color_Usuario: Usuario[6],
                        Fecha: Usuario[7],
                    }));
                    setUsuarios(UsuariosFormateados);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setCargando(false);
                }
            };
            

            obtenerUsuarios();
        }, []);

        if (cargando) {
            return <div>Cargando Usuarios...</div>;
        }

        if (error) {
            return <div>Error: {error}</div>;
        }

        const closeModal = () => {
            setModalIsOpen(false);
        };
    

        return (


            <div style={{ marginLeft: '13%' }}>
                <div className="main-block">
                <h1 style={{padding:20}}>Listado de Usuarios</h1>
                <fieldset style={{paddingTop:0}}> <legend> <h3>Usuarios añadidos</h3></legend>
            {/* Modal para mostrar la imagen seleccionada */}
                <table className="venta-table" style={{ marginLeft: '8%' }}>
                    <thead>
                        <tr>
                            <th>RUT</th>
                            <th>TÉLEFONO</th>
                            <th>NOMBRE</th>
                            <th>TIPO DE USUARIO</th>
                        </tr>
                    </thead>
                    <tbody>
                    {Usuarios.map((Usuario) => (
                        
                        <tr key={Usuario.RUT}>
                            <td>{Usuario.RUT}</td>
                            <td>{Usuario.Telefono}</td>
                            <td>{Usuario.Nombre}</td>
                            <td>{Usuario.Tipo}</td>
                            <td>
                                {/* Botón para ver la imagen */}
                                <button type="button" onClick={() => mostrarImagen(Usuario.RUT)}>
                                    <i className="fa fa-eye"></i>
                                </button>
                            </td>
                         </tr>
                    ))}
                    </tbody>
                    </table>
                    </fieldset>

            </div>
            </div>
        );
    };

    export default ListadoUsuarios;

