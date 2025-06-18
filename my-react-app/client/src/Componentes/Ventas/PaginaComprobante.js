// src/Componentes/Ventas/PaginaComprobante.js (or wherever it's located)

import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const PaginaComprobante = () => { // <--- UPDATED COMPONENT NAME
    const invoiceRef = useRef(null);
    const [invoiceData, setInvoiceData] = useState(null);

    useEffect(() => {
        const storedData = sessionStorage.getItem('currentInvoiceData');
        if (storedData) {
            setInvoiceData(JSON.parse(storedData));
        } else {
            console.error("No invoice data found in session storage.");
            // Optionally, redirect the user or show a "No invoice data" message
        }
    }, []);

    if (!invoiceData) {
        return (
            <div className="invoice-page-container">
                <p>Cargando comprobante...</p>
            </div>
        );
    }

    const { cabecera, productos, direccion, codigoCabecera } = invoiceData;

    let subtotal = 0;
    const taxRate = 0.19; // Example 19% tax (IVA in Chile)

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

            pdf.save(`Comprobante_${codigoCabecera || 'generado'}.pdf`); // <--- UPDATED PDF FILENAME
        });
    };

    return (
        <div className="invoice-page-container">
            <button onClick={downloadPdf} className="download-pdf-button">
                Descargar Comprobante PDF
            </button>
            <div className="invoice-wrapper" ref={invoiceRef}>
                <div className="invoice-header">
                    <h2>Comprobante #{codigoCabecera || 'N/A'}</h2> {/* <--- UPDATED HEADING */}
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

export default PaginaComprobante; // <--- UPDATED EXPORT NAME