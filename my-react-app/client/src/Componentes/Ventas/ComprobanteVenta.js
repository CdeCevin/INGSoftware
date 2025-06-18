// src/components/InvoicePage.js
import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './InvoicePage.css'; // We'll create this CSS file next

const InvoicePage = () => {
    const invoiceRef = useRef(null); // Ref to capture the invoice div
    const [invoiceData, setInvoiceData] = useState(null);

    useEffect(() => {
        // Retrieve data from sessionStorage when the component mounts
        const storedData = sessionStorage.getItem('currentInvoiceData');
        if (storedData) {
            setInvoiceData(JSON.parse(storedData));
            // Optional: Remove data after retrieving to clean up
            // sessionStorage.removeItem('currentInvoiceData');
        } else {
            // Handle case where no data is found (e.g., redirect or show error)
            console.error("No invoice data found in session storage.");
        }
    }, []);

    if (!invoiceData) {
        return (
            <div className="invoice-page-container">
                <p>Cargando factura...</p>
                {/* Or a more robust loading/error state */}
            </div>
        );
    }

    const { client, items, date, invoiceNumber } = invoiceData;

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const taxRate = 0.19; // Example 19% tax (IVA in Chile)
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    const downloadPdf = () => {
        if (!invoiceRef.current) return;

        html2canvas(invoiceRef.current, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' for portrait, 'mm' for millimeters, 'a4' size
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
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

            pdf.save(`Factura_${invoiceNumber || 'generada'}.pdf`);
        });
    };

    return (
        <div className="invoice-page-container">
            <button onClick={downloadPdf} className="download-pdf-button">
                Descargar Factura PDF
            </button>
            <div className="invoice-wrapper" ref={invoiceRef}>
                <div className="invoice-header">
                    <h2>Factura #{invoiceNumber || 'N/A'}</h2>
                    <p>Fecha: {new Date(date).toLocaleDateString('es-CL')}</p>
                </div>

                <div className="invoice-section client-details">
                    <h3>Detalles del Cliente:</h3>
                    <p><strong>Nombre:</strong> {client.name}</p>
                    <p><strong>RUT:</strong> {client.rut}</p>
                    <p><strong>Dirección:</strong> {client.address}</p>
                    <p><strong>Email:</strong> {client.email}</p>
                </div>

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
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.quantity}</td>
                                    <td>{item.description}</td>
                                    <td>${item.price.toLocaleString('es-CL')}</td>
                                    <td>${(item.quantity * item.price).toLocaleString('es-CL')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

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

export default InvoicePage;