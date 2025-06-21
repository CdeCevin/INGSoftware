-- Hecho por Renato Izquierdo, Kevin Olivares y Dominique Teillier.

--------------------------------------------------------------
-------------------DROP TABLES--------------------------------
--------------------------------------------------------------

DROP TABLE OUTLET_Ventas_Pendientes;
DROP TABLE OUTLET_Cuerpo_Comprobante_Pago;
DROP TABLE OUTLET_Cabecera_Comprobante_Pago;
DROP TABLE OUTLET_Producto;
DROP TABLE OUTLET_Cliente;
DROP TABLE OUTLET_Direccion;
DROP TABLE OUTLET_Ciudad;
DROP TABLE OUTLET_Region;
DROP TABLE OUTLET_Auditoria;
DROP TABLE OUTLET_Usuario;
--------------------------------------------------------------
------------------ CREATE TABLES------------------------------
--------------------------------------------------------------

CREATE TABLE OUTLET_Usuario(
        RUT_Usuario NUMBER,
        Nombre_Usuario VARCHAR2(50),
        Contrasena_Usuario VARCHAR2(60),
        Telefono_Usuario NUMBER,
        ROL_Usuario VARCHAR2(15),
        Activo NUMBER DEFAULT 1,
        CONSTRAINT OUTLET_Usuario PRIMARY KEY (RUT_Usuario)
);


CREATE TABLE OUTLET_Auditoria(
        Codigo_Auditoria NUMBER,
        Fecha_Desactivacion DATE,
        CONSTRAINT OUTLET_Auditoria PRIMARY KEY(Codigo_Auditoria)
);

CREATE TABLE OUTLET_Region(
        Codigo_Region NUMBER,
        Nombre_Region VARCHAR2(50),
        CONSTRAINT PK_OUTLET_Region PRIMARY KEY(Codigo_Region)
);

CREATE TABLE OUTLET_Ciudad(
        Codigo_Ciudad NUMBER,
        Nombre_Ciudad VARCHAR2(30),
        Codigo_Region NUMBER,
        CONSTRAINT PK_OUTLET_Ciudad PRIMARY KEY(Codigo_Ciudad)
);
ALTER TABLE OUTLET_Ciudad ADD CONSTRAINT FK_OUTLET_Ciudad_OUTLET_Region FOREIGN KEY(Codigo_Region) REFERENCES OUTLET_Region(Codigo_Region); 

CREATE TABLE OUTLET_Direccion(
        Codigo_Direccion NUMBER,
        Nombre_Calle VARCHAR2(70),
        Numero_Direccion NUMBER,
        Codigo_Ciudad NUMBER,
        CONSTRAINT PK_OUTLET_Direccion PRIMARY KEY(Codigo_Direccion)
);
ALTER TABLE OUTLET_Direccion ADD CONSTRAINT FK_OUTLET_Negocio_OUTLET_Ciudad FOREIGN KEY(Codigo_Ciudad) REFERENCES OUTLET_Ciudad(Codigo_Ciudad); 

CREATE TABLE OUTLET_Producto(
        Codigo_Producto NUMBER,
        Tipo_Producto VARCHAR(20),
        Nombre_Producto VARCHAR(60),
        Stock NUMBER,
        Precio_Unitario NUMBER,
        Color_Producto VARCHAR2(20),
        Activo NUMBER DEFAULT 1,
        Stock_Minimo NUMBER,
        Fecha_Registro DATE,
        CONSTRAINT OUTLET_Producto PRIMARY KEY(Codigo_Producto)
);

CREATE TABLE OUTLET_Cliente(
        Codigo_Cliente NUMBER,
        Telefono_Cliente NUMBER,
        Nombre_Cliente VARCHAR2(130),
        Codigo_Direccion NUMBER,
        Activo NUMBER DEFAULT 1,
        CONSTRAINT OUTLET_Cliente PRIMARY KEY(Codigo_Cliente)
);
ALTER TABLE OUTLET_Cliente ADD CONSTRAINT FK_OUTLET_Cliente_OUTLET_Direccion FOREIGN KEY(Codigo_Direccion) REFERENCES OUTLET_Direccion(Codigo_Direccion);

CREATE TABLE OUTLET_Cabecera_Comprobante_Pago(
        Codigo_Comprobante_Pago NUMBER,
        Fecha DATE,
        Estado NUMBER DEFAULT 0,
        Codigo_Cliente NUMBER,
        RUT_USUARIO NUMBER,
        CONSTRAINT OUTLET_Cabecera_Comprobante_Pago PRIMARY KEY(Codigo_Comprobante_Pago)
);
ALTER TABLE OUTLET_Cabecera_Comprobante_Pago ADD CONSTRAINT FK_OUTLET_Cabecera_Comprobante_Pago_OUTLET_Cliente FOREIGN KEY(Codigo_Cliente) REFERENCES OUTLET_Cliente(Codigo_Cliente);
ALTER TABLE OUTLET_Cabecera_Comprobante_Pago ADD CONSTRAINT FK_OUTLET_Cabecera_Comprobante_Pago_OUTLET_Usuario FOREIGN KEY(RUT_Usuario) REFERENCES OUTLET_Usuario(RUT_Usuario);

CREATE TABLE OUTLET_Cuerpo_Comprobante_Pago(
        Codigo_Cuerpo_Comprobante_Pago NUMBER,
        Cantidad NUMBER,
        Precio_Total NUMBER,
        Codigo_Comprobante_Pago NUMBER,
        Codigo_Producto NUMBER,
        CONSTRAINT PK_OUTLET_Cuerpo_Comprobante_Pago PRIMARY KEY(Codigo_Cuerpo_Comprobante_Pago)
);
ALTER TABLE OUTLET_Cuerpo_Comprobante_Pago ADD CONSTRAINT FK_OUTLET_Cuerpo_Comprobante_Pago_OUTLET_Cabecera_Comprobante_Pago FOREIGN KEY(Codigo_Comprobante_Pago) REFERENCES OUTLET_Cabecera_Comprobante_Pago(Codigo_Comprobante_Pago);
ALTER TABLE OUTLET_Cuerpo_Comprobante_Pago ADD CONSTRAINT FK_OUTLET_Cuerpo_Comprobante_Pago_OUTLET_Producto FOREIGN KEY(Codigo_Producto) REFERENCES OUTLET_Producto(Codigo_Producto);

CREATE TABLE OUTLET_Ventas_Pendientes (
    ID_Venta_Pendiente NUMBER,
    Codigo_Comprobante_Pago NUMBER,
    Fecha_Registro DATE,
    CONSTRAINT PK_Ventas_Pendientes PRIMARY KEY(ID_Venta_Pendiente)
);
ALTER TABLE OUTLET_Ventas_Pendientes ADD CONSTRAINT FK_Ventas_Pendientes_Cabecera_Comprobante_Pago FOREIGN KEY (Codigo_Comprobante_Pago) REFERENCES OUTLET_Cabecera_Comprobante_Pago (Codigo_Comprobante_Pago);

---------------------------------------------------------------------
--------------------UPDATE DE VALORES--------------------------------
---------------------------------------------------------------------
UPDATE OUTLET_Producto
SET Stock_Minimo = 1
WHERE Stock_Minimo IS NULL;

UPDATE OUTLET_Cliente
SET Telefono_Cliente = 974330900
WHERE Codigo_Cliente = 0;

UPDATE OUTLET_Usuario
SET Activo = 1
WHERE Activo IS NULL;