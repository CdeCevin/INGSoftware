import React, { useEffect, useState, useRef } from 'react';
import Modal from 'react-modal';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import authenticatedFetch from '../../utils/api';

Modal.setAppElement('#root'); // Only needs to be set once

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
                setInvoiceData(data);
            } catch (err) {
                console.error(err);
                setError("Error al cargar el comprobante");
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
        <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Comprobante" className="custom-modal" overlayClassName="modal-overlay">
            <div>
                <button onClick={onClose} className="close-button">Cerrar</button>

                {loading ? (
                    <p>Cargando comprobante...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : (
                    <div ref={invoiceRef}>
                        <h2>Comprobante #{invoiceData.codigoCabecera}</h2>
                        <p>Fecha: {new Date(invoiceData.cabecera.FECHA).toLocaleDateString()}</p>
                        <p>Cliente: {invoiceData.cabecera.NOMBRE_CLIENTE}</p>
                        <p>Dirección: {`${invoiceData.direccion.nombreCalle} ${invoiceData.direccion.numeroDireccion}, ${invoiceData.direccion.nombreCiudad}, ${invoiceData.direccion.nombreRegion}`}</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Cant</th><th>Producto</th><th>Precio</th><th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoiceData.productos.map((p, i) => (
                                    <tr key={i}>
                                        <td>{p[2]}</td>
                                        <td>{p[0]} ({p[1]})</td>
                                        <td>${p[3]}</td>
                                        <td>${p[2] * p[3]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p><strong>Total:</strong> ${invoiceData.productos.reduce((acc, p) => acc + p[2] * p[3], 0)}</p>
                        <button onClick={downloadPdf} className="download-pdf-button">Descargar PDF</button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ComprobanteModal;
