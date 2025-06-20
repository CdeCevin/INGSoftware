import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Modal from 'react-modal';
import authenticatedFetch from '../../utils/api';

Modal.setAppElement('#root'); // Prevents screen readers warning

const ComprobanteModal = ({ isOpen, onClose, codigoComprobante }) => {
    const invoiceRef = useRef(null);
    const [invoiceData, setInvoiceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen || !codigoComprobante) return;

        const fetchInvoice = async () => {
            try {
                setLoading(true);
                const response = await authenticatedFetch(`/historialVentas/boleta/${codigoComprobante}`);
                if (!response.ok) throw new Error("Error al obtener el comprobante");
                const data = await response.json();

                if (!data || !data.cabecera || !data.direccion) {
                    throw new Error("Datos incompletos del comprobante");
                }

                setInvoiceData(data);
            } catch (err) {
                console.error(err);
                setError("Error al cargar el comprobante: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [codigoComprobante, isOpen]);

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

            pdf.save(`Comprobante_${codigoComprobante}.pdf`);
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Comprobante"
            className="modal-content"
            overlayClassName="modal-overlay"
        >
            <div className="invoice-page-container">
                <button onClick={onClose} className="close-button">&times;</button>

                {loading ? (
                    <p>Cargando comprobante...</p>
                ) : error ? (
                    <>
                        <p style={{ color: 'red' }}>{error}</p>
                        <p>Intente nuevamente más tarde.</p>
                    </>
                ) : (
                    <>
                        <div className="invoice-wrapper" ref={invoiceRef}>
                            <div className="invoice-header">
                                <h2>Comprobante #{invoiceData.codigoCabecera || 'S/N'}</h2>
                                <p>Fecha: {new Date(invoiceData.cabecera.FECHA).toLocaleDateString('es-CL')}</p>
                                <p>Emitido por: {invoiceData.cabecera.NOMBRE_USUARIO}</p>
                                <p>RUT Emisor: {invoiceData.cabecera.RUT_USUARIO}</p>
                            </div>

                            <div className="invoice-section client-details">
                                <h3>Detalles del Cliente</h3>
                                <p><strong>Nombre:</strong> {invoiceData.cabecera.NOMBRE_CLIENTE}</p>
                                <p><strong>Teléfono:</strong> {invoiceData.cabecera.TELEFONO}</p>
                                <p><strong>Dirección:</strong> {`${invoiceData.direccion.nombreCalle} ${invoiceData.direccion.numeroDireccion}, ${invoiceData.direccion.nombreCiudad}, ${invoiceData.direccion.nombreRegion}`}</p>
                            </div>

                            {invoiceData.productos?.length > 0 ? (
                                <div className="invoice-section items-details">
                                    <h3>Productos</h3>
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
                                            {invoiceData.productos.map((item, i) => (
                                                <tr key={i}>
                                                    <td>{item[2]}</td>
                                                    <td>{`${item[0]} (${item[1]})`}</td>
                                                    <td>${item[3].toLocaleString('es-CL')}</td>
                                                    <td>${(item[2] * item[3]).toLocaleString('es-CL')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="invoice-section items-details">
                                    <p>No se detallaron productos.</p>
                                </div>
                            )}

                            <div className="invoice-totals">
                                <p className="total-amount">
                                    Total: <span>
                                        ${invoiceData.productos.reduce((sum, item) => sum + item[2] * item[3], 0).toLocaleString('es-CL')}
                                    </span>
                                </p>
                            </div>

                            <div className="invoice-footer">
                                <p>Outlet a Tu Hogar</p>
                            </div>
                        </div>

                        <button onClick={downloadPdf} className="download-pdf-button">
                            Descargar Comprobante PDF
                        </button>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default ComprobanteModal;
