// src/Componentes/Ventas/PaginaComprobante.js

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom'; // <--- IMPORT useParams
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const PaginaComprobante = () => {
    const invoiceRef = useRef(null);
    const [invoiceData, setInvoiceData] = useState(null);
    const [loading, setLoading] = useState(true); // <--- Add loading state
    const [error, setError] = useState(null);     // <--- Add error state

    const { codigoComprobante } = useParams(); // <--- GET ID FROM URL

    useEffect(() => {
        const fetchInvoice = async () => {
            if (!codigoComprobante) {
                setError("No se encontró el código de comprobante en la URL.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null); // Clear previous errors

                const response = await fetch(`http://localhost:3001/api/historialVentas/boleta/${codigoComprobante}`);

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Error HTTP ${response.status}: ${errorText || response.statusText}`);
                }

                const data = await response.json();

                if (!data || !data.cabecera || !data.direccion) {
                    throw new Error("Datos de comprobante incompletos recibidos del servidor.");
                }

                setInvoiceData(data);
            } catch (err) {
                console.error("Error al obtener datos del comprobante:", err);
                setError(`Error al cargar el comprobante: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [codigoComprobante]); // <--- Re-run effect if codigoComprobante changes (though it shouldn't for this use case)

    if (loading) {
        return (
            <div className="invoice-page-container">
                <p>Cargando comprobante...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="invoice-page-container">
                <p style={{ color: 'red' }}>{error}</p>
                <p>Por favor, intente de nuevo más tarde o verifique el código del comprobante.</p>
            </div>
        );
    }

    if (!invoiceData) {
        return (
            <div className="invoice-page-container">
                <p>No se encontraron datos para este comprobante.</p>
            </div>
        );
    }

    const { cabecera, productos, direccion, codigoCabecera } = invoiceData;

    let subtotal = 0;
    const taxRate = 0.19;

    if (productos && productos.length > 0) {
        subtotal = productos.reduce((sum, item) => sum + (item[2] || 0) * (item[3] || 0), 0);
    }

    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    const downloadPdf = () => {
        if (!invoiceRef.current) return;

        html2canvas(invoiceRef.current, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`Comprobante_${codigoCabecera || 'generado'}.pdf`);
        });
    };

    return (
        <div className="invoice-page-container">
            <button onClick={downloadPdf} className="download-pdf-button">
                Descargar Comprobante PDF
            </button>
            <div className="invoice-wrapper" ref={invoiceRef}>
                <div className="invoice-header">
                    <h2>Comprobante #{codigoCabecera || 'N/A'}</h2>
                    <p>Fecha: {new Date(cabecera.FECHA).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p>Emitido por: {cabecera.NOMBRE_USUARIO || 'N/A'}</p>
                    <p>RUT Emisor: {cabecera.RUT_USUARIO || 'N/A'}</p>
                </div>

                <div className="invoice-section client-details">
                    <h3>Detalles del Cliente:</h3>
                    <p><strong>Nombre:</strong> {cabecera.NOMBRE_CLIENTE || 'N/A'}</p>
                    <p><strong>Teléfono:</strong> {cabecera.TELEFONO || 'N/A'}</p>
                    <p><strong>Dirección:</strong> {`${direccion.nombreCalle || ''} ${direccion.numeroDireccion || ''}, ${direccion.nombreCiudad || ''}, ${direccion.nombreRegion || ''}`.trim()}</p>
                </div>

                {productos && productos.length > 0 ? (
                    <div className="invoice-section items-details">
                        <h3>Productos/Servicios:</h3>
                        <table className="invoice-items-table">
                            <thead>
                                <tr>
                                    <th>Cantidad</th>
                                    <th>Descripción</th>
                                    <th>Precio Unitario</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item[2] || '1'}</td>
                                        <td>{`${item[0] || 'Producto sin descripción'} (${item[1] || 'Sin color'})`}</td>
                                        <td>${(item[3] || 0).toLocaleString('es-CL')}</td>
                                        <td>${((item[2] || 0) * (item[3] || 0)).toLocaleString('es-CL')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="invoice-section items-details">
                        <p>No se detallaron productos o servicios para este comprobante.</p>
                    </div>
                )}

                <div className="invoice-totals">
                    <p>Subtotal: <span>${subtotal.toLocaleString('es-CL')}</span></p>
                    <p>IVA ({taxRate * 100}%): <span>${taxAmount.toLocaleString('es-CL')}</span></p>
                    <p className="total-amount">Total: <span>${total.toLocaleString('es-CL')}</span></p>
                </div>

                <div className="invoice-footer">
                    <p>¡Gracias por su compra!</p>
                </div>
            </div>
        </div>
    );
};

export default PaginaComprobante;