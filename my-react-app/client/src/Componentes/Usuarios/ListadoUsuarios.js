    import React, { useEffect, useState } from 'react';
    import '../../Estilos/style_menu.css';
    import '../../Estilos/estilo.css';

    const ListadoUsuarios = () => {
        console.log("HOLAA");
        const [Usuarios, setUsuarios] = useState([]);
        const [cargando, setCargando] = useState(true);
        const [error, setError] = useState(null);

        useEffect(() => {
            document.title = 'Listado Usuarios';
        }, []);

        useEffect(() => {
        async function obtenerUsuarios() {
            setCargando(true);
            try {
            const res = await fetch('http://localhost:3001/api/userList');
            if (!res.ok) throw new Error('Error en la red');
            const data = await res.json();
            setUsuarios(data);
            } catch (e) {
            setError(e.message);
            } finally {
            setCargando(false);
            }
        }
        obtenerUsuarios();
        }, []);


        if (cargando) {
            return <div>Cargando Usuarios...</div>;
        }

        if (error) {
            return <div>Error: {error}</div>;
        }



        return (
                <div className="main-block">
                <h1>Listado de Usuarios</h1>
                <fieldset> <legend> <h3>Usuarios añadidos</h3></legend>
     
                <table className="venta-table">
                    <thead>
                        <tr>
                            <th>RUT</th>
                            <th>TÉLEFONO</th>
                            <th>NOMBRE</th>
                            <th>TIPO DE USUARIO</th>
                        </tr>
                    </thead>
                    <tbody>
                    {Usuarios.map(u => (
                        <tr key={u.RUT}>
                        <td>{u.RUT}</td>
                        <td>{u.Telefono}</td>
                        <td>{u.Nombre}</td>
                        <td>{u.Tipo}</td>
                        </tr>
                    ))}
                    </tbody>
                    </table>
                    </fieldset>

            </div>
        );
    };

    export default ListadoUsuarios;

