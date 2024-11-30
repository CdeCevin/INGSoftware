import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import MostrarBoleta from './MostrarBoleta'; // Asegúrate de importar el nuevo componente
import optionSets from '../../Estilos/regiones';
Modal.setAppElement('#root');
function VentaClienteNu() {
    const [nombreC, setNombreC] = useState('');
    const [telefono, setTelefono] = useState('');
    const [region, setRegion] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [calle, setCalle] = useState('');
    const [numero, setNumero] = useState('');
    const [nombre, setNombre] = useState('');
    const [color, setColor] = useState('');
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    
    const [imageModalIsOpen, setImageModalIsOpen] = useState(false);
    const [messageModalIsOpen, setMessageModalIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);  // Aquí va la imagen seleccionada
    const [modalMessage, setModalMessage] = useState("");      

    const [cantidad, setCantidad] = useState({});
    const [paginaActual, setPaginaActual] = useState('insertCabecera');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Preparar los datos en formato JSON
        const formData = {
            INnombre: nombreC,
            INtelefono: telefono, 
            INregion: region,
            INciudad: ciudad,
            INcalle: calle, 
            INnumero: numero,
        };
        console.log('Datos del formulario:', formData);

        try {
            // Enviar los datos al backend
            const response = await fetch('http://localhost:3001/api/anCliente', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                
                resetForm();
                setPaginaActual('buscarProducto');
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message); // Mostrar mensaje de error
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            setModalMessage('Error al enviar el formulario.'); // Mensaje de error genérico
            
        } finally {
            setMessageModalIsOpen(false); // Abrir el modal después de intentar enviar el formulario
        }
    };


    const resetForm = () => {
        setNombreC('');
        setRegion('');
        setCiudad('');
        setCalle('');
        setNumero('');
    };

    useEffect(() => {
        document.title = 'Venta Cliente Nuevo';
    }, []);

    const handleRegionChange = (e) => {
        setRegion(e.target.value);
        setCiudad(''); // Reiniciar la ciudad al cambiar de región
    };


    const buscarProductos = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/api/buscarProducto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'input-nombre': nombre,
                    'input-color': color,
                }),
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }

            const data = await response.json();

            if (data.data && data.data.length > 0) {
                setProductos(data.data);
            } else {
                setModalMessage("Producto no encontrado");
                setMessageModalIsOpen(true);
            }
        } catch (error) {
            console.error('Error al buscar productos:', error);
            setModalMessage("Producto no encontrado")
            setMessageModalIsOpen(true);
        }
    };

    const añadirAlCarrito = (producto) => {
        const cantidadSeleccionada = cantidad[producto.codigo_producto] || 0;
        setCarrito((prevCarrito) => {
            const existente = prevCarrito.find(p => p.codigo_producto === producto.codigo_producto);
            if (existente) {
                return prevCarrito.map(p =>
                    p.codigo_producto === producto.codigo_producto
                        ? { ...p, cantidad: p.cantidad + cantidadSeleccionada }
                        : p
                );
            }
            else{
              console.error('Stock insuficiente');
              setModalMessage("Stock insuficiente");
              setMessageModalIsOpen(true);
              return;

            }
            return [...prevCarrito, { ...producto, cantidad: cantidadSeleccionada }];
        });
        setCantidad(prevState => ({ ...prevState, [producto.codigo_producto]: 0 }));
    };

    const finalizarVenta = async () => {
        const productosVenta = carrito.map(producto => ({
            codigo: producto.codigo_producto,
            cantidad: producto.cantidad
        }));

        try {
            const response = await fetch('http://localhost:3001/api/insertCuerpo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productos: productosVenta }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Respuesta de la API:', data);
                setModalMessage("Venta finalizada exitosamente");
                setMessageModalIsOpen(false);
                setCarrito([]);
                setPaginaActual('mostrarBoleta'); // Cambia a la página de la boleta
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message);
                setMessageModalIsOpen(true);
            }
        } catch (error) {
            console.error('Error al finalizar la venta:', error);
            setModalMessage('Error al finalizar la venta.');
            setMessageModalIsOpen(true);
        }
    };
    
    const handleCantidadChange = (codigoProducto, value) => {
        setCantidad(prevState => ({
            ...prevState,
            [codigoProducto]: value
        }));
    };

    const mostrarImagen = (codigo_producto) => {
        const imageUrl = `/images/Outlet/${codigo_producto}.jpg`; // Ruta relativa de la imagen
        setSelectedImage(imageUrl);  // Establecer la URL de la imagen seleccionada
        setImageModalIsOpen(true);   // Abrir el modal de imagen
        console.log("Imagen mostrada:", imageUrl); // Para asegurarte de que se está estableciendo la imagen
    };
    
    const closeModal = () => {
        setImageModalIsOpen(false);   // Cerrar solo el modal de la imagen
        setMessageModalIsOpen(false); // Cerrar solo el modal de mensaje
    };
    

    return (
        <div>
          {paginaActual === 'insertCabecera' && (
            <div style={{ marginLeft: '12%' }}>
              <div className="main-block">
                <form onSubmit={handleSubmit}>
                  <h1>Cabecera Venta</h1>
                  <fieldset>
                    <legend>
                      <h3>Detalles del Cliente</h3>
                    </legend>
                    <div className="account-details" style={{ display: 'flex', flexWrap: 'wrap' }}>
                      <div>
                        <label>Nombre*</label>
                        <input
                          type="text"
                          name="input-nombreC"
                          maxLength="50"
                          value={nombreC}
                          required
                          onChange={(e) => setNombreC(e.target.value)}
                        />
                      </div>
                      <div>
                        <label>Telefono*</label>
                        <input
                          type="text"
                          name="input-teléfono"
                          maxLength="9"
                          value={telefono}
                          required
                          onChange={(e) => setTelefono(e.target.value)}
                        />
                      </div>
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend>
                      <h3>Dirección de despacho</h3>
                    </legend>
                    <div className="account-details" style={{ display: 'flex', flexDirection: 'column' }}>
                      <div>
                        <label>Región</label>
                        <select value={region} required onChange={handleRegionChange}>
                          <option value="">Selecciona una región</option>
                          {Object.keys(optionSets).map((regionName) => (
                            <option key={regionName} value={regionName}>{regionName}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label>Comuna</label>
                        <select
                          value={ciudad}
                          required
                          onChange={(e) => setCiudad(e.target.value)}
                          disabled={!region}
                        >
                          <option value="">Selecciona una comuna</option>
                          {region && optionSets[region].map((city) => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label>Calle</label>
                        <input
                          type="text"
                          name="input-calle"
                          maxLength="100"
                          required
                          value={calle}
                          onChange={(e) => setCalle(e.target.value)}
                        />
                      </div>
                      <div>
                        <label>Número</label>
                        <input
                          type="text"
                          name="input-numero"
                          maxLength="100"
                          required
                          value={numero}
                          onChange={(e) => setNumero(e.target.value)}
                        />
                      </div>
                    </div>
                  </fieldset>
                  <button type="submit">Añadir cliente</button>
                </form>
              </div>
            </div>
          )}
      
          {paginaActual === 'buscarProducto' && (
            <>
              <div style={{ marginLeft: '12%' }}>
                <div className="main-block">
                  <h1 style={{ padding: 20, paddingBottom: 0 }}>Buscar Producto</h1>
                  <form onSubmit={buscarProductos} style={{ paddingTop: 0 }}>
                    <fieldset>
                      <legend>
                        <h3>Búsqueda</h3>
                      </legend>
                      <div className="account-details" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div>
                          <label>Nombre*</label>
                          <input
                            type="text"
                            name="input-nombre"
                            maxLength="50"
                            required
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Nombre del producto"
                          />
                        </div>
                        <div>
                          <label>Color</label>
                          <input
                            type="text"
                            name="input-color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            placeholder="Color del producto"
                          />
                        </div>
                      </div>
                    </fieldset>
                    <button type="submit">Buscar Producto</button>
                  </form>
      
                  {productos.length > 0 && (
                    <fieldset>
                      <legend>
                        <h3>Resultados</h3>
                      </legend>
                      <div style={{marginLeft: '12%'}}>
                      <table className="venta-table">
                        <thead>
                          <tr>
                            <th>CÓDIGO</th>
                            <th>STOCK</th>
                            <th>PRECIO</th>
                            <th>NOMBRE</th>
                            <th>COLOR</th>
                            <th>FOTO</th>
                            <th>CANTIDAD</th>
                            <th>AÑADIR</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productos.map((producto) => (
                            <tr key={producto.codigo_producto}>
                              <td>{producto.codigo_producto}</td>
                              <td>{producto.stock}</td>
                              <td>{producto.precio_unitario}</td>
                              <td>{producto.nombre_producto}</td>
                              <td>{producto.color_producto}</td>
                              <td>
                                <button type="button" onClick={() => mostrarImagen(producto.codigo_producto)}>
                                  <i className="fa fa-eye"></i>
                                </button>
                              </td>
                              <td>
                                <input
                                  type="number"
                                  min="1"
                                  style={{ width: '50px' }}
                                  value={cantidad[producto.codigo_producto] || 0}
                                  onChange={(e) => handleCantidadChange(producto.codigo_producto, parseInt(e.target.value) || 0)}
                                />
                              </td>
                              <td>
                                <button onClick={() => añadirAlCarrito(producto)}>
                                  <i className="fa fa-shopping-cart"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button style={{marginLeft: '-12%',width:'110%'}} onClick={finalizarVenta}>Finalizar Venta</button>
                      </div>
                    </fieldset>
                  )}




                  {/* Modal para mostrar la imagen seleccionada */}
                  <Modal isOpen={imageModalIsOpen} onRequestClose={closeModal} contentLabel="Imagen del Producto">
                    <h2>Imagen del Producto</h2>
                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt="Imagen del producto"
                        style={{
                          display: 'block',
                          margin: '0 auto',
                          maxWidth: '80%',
                          height: 'auto',
                          maxHeight: '400px'
                        }}
                      />
                    ) : (
                      <p>No se ha seleccionado una imagen.</p>
                    )}
                    <button onClick={closeModal}>Cerrar</button>
                  </Modal>
                </div>
              </div>
      
              {/* Modal para mostrar un mensaje */}
              <Modal isOpen={messageModalIsOpen} onRequestClose={closeModal} ariaHideApp={false} className={"custom-modal"}>
                <h2>Mensaje</h2>
                <p>{modalMessage}</p>
                <button onClick={closeModal}>Cerrar</button>
              </Modal>
            </>
          )}
            {paginaActual === 'mostrarBoleta' && (
                <div style={{marginLeft: '12%'}}>
                 <div className="main-block">
                    <MostrarBoleta />
                 </div>
                </div>
            )}
        </div>
        
      );
};
export default VentaClienteNu;