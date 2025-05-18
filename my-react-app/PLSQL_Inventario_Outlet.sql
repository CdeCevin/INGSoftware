-- Hecho por Renato Izquierdo, Kevin Olivares y Dominique Teillier.

-- Se deben ejecutar los procedimientos, funciones, triggers y cursores uno a uno.

--------------------------------------------------------------
------------------Secuencias----------------------------------
--------------------------------------------------------------


CREATE SEQUENCE sec_cod_clientes
        START WITH 1
        INCREMENT BY 1
        MAXVALUE 99999
        MINVALUE 1
        NOCACHE;


CREATE SEQUENCE sec_cod_direccion
        START WITH 1
        INCREMENT BY 1
        MAXVALUE 99999
        MINVALUE 1
        NOCACHE;

CREATE SEQUENCE sec_cod_Cabecera
        START WITH 1
        INCREMENT BY 1
        MAXVALUE 99999
        MINVALUE 1
        NOCACHE;

CREATE SEQUENCE sec_cod_Cuerpo
        START WITH 1
        INCREMENT BY 1
        MAXVALUE 99999
        MINVALUE 1
        NOCACHE;

CREATE SEQUENCE sec_cod_ventas_pendientes
        START WITH 1
        INCREMENT BY 1
        MAXVALUE 99999
        MINVALUE 1
        NOCACHE;

--------------------------------------------------------------
------------------Procedimientos------------------------------
--------------------------------------------------------------
CREATE OR REPLACE PROCEDURE OUTLET_Insert_User(
        Rut_Usuario NUMBER,
        Nombre_Usuario VARCHAR2,
        Contrasena_Usuario VARCHAR2,
        Telefono_Usuario NUMBER,
        Rol_Usuario VARCHAR2
)
IS
BEGIN 
        INSERT INTO OUTLET_USUARIO(RUT_Usuario,Nombre_Usuario, Contrasena_Usuario,Telefono_Usuario,ROL_Usuario)    
                VALUES(Rut_Usuario,Nombre_Usuario, Contrasena_Usuario,Telefono_Usuario,Rol_Usuario);
        EXCEPTION
                WHEN PROGRAM_ERROR THEN
                      RAISE_APPLICATION_ERROR(-6501,'Error de programa y/o asignación de variables');
                WHEN STORAGE_ERROR THEN
                        RAISE_APPLICATION_ERROR(-6500,'Se acabó la memoria o está corrupta');
                WHEN ROWTYPE_MISMATCH THEN
                        RAISE_APPLICATION_ERROR(-6504,'Error de asignación de variables');
                WHEN OTHERS THEN
                        RAISE_APPLICATION_ERROR(-20010,'Ocurrió un problema inesperado');
        ROLLBACK;
END;


CREATE OR REPLACE PROCEDURE OUTLET_Eliminar_User(
        Rut NUMBER
)
IS 
BEGIN 
        DELETE FROM OUTLET_USUARIO
        WHERE (Rut = Rut_Usuario);
        EXCEPTION
                WHEN PROGRAM_ERROR THEN
                      RAISE_APPLICATION_ERROR(-6501,'Error de programa y/o asignación de variables');
                WHEN STORAGE_ERROR THEN
                        RAISE_APPLICATION_ERROR(-6500,'Se acabó la memoria o está corrupta');
                WHEN ROWTYPE_MISMATCH THEN
                        RAISE_APPLICATION_ERROR(-6504,'Error de asignación de variables');
                WHEN OTHERS THEN
                        RAISE_APPLICATION_ERROR(-20010,'Ocurrió un problema inesperado');       
        ROLLBACK;
END;


CREATE OR REPLACE PROCEDURE Outlet_FiltrarUsuarios(
  c_Usuarios OUT SYS_REFCURSOR
) AS
BEGIN
  OPEN c_Usuarios FOR
    SELECT
      RUT_Usuario,
      Telefono_Usuario,
      Nombre_Usuario,
      ROL_Usuario
    FROM OUTLET_Usuario;
END;



CREATE OR REPLACE PROCEDURE OUTLET_Up_Usuario(
        Rut NUMBER,
        Telefono NUMBER,
        contrasena VARCHAR2,
        tipo VARCHAR2,
        nombre VARCHAR2
) 
IS
BEGIN   
        LOCK TABLE OUTLET_PRODUCTO IN ROW EXCLUSIVE MODE;
        UPDATE OUTLET_USUARIO
        SET Nombre_Usuario = nombre, Contrasena_Usuario = contrasena, Telefono_Usuario = Telefono, ROL_Usuario = tipo
        WHERE(RUT_Usuario = Rut);             

        COMMIT;
        EXCEPTION
                WHEN PROGRAM_ERROR THEN
                        RAISE_APPLICATION_ERROR(-6501,'Error de programa y/o asignación de variables');
                WHEN STORAGE_ERROR THEN
                        RAISE_APPLICATION_ERROR(-6500,'Se acabó la memoria o está corrupta');
                WHEN ROWTYPE_MISMATCH THEN
                        RAISE_APPLICATION_ERROR(-6504,'Error de asignación de variables');
                WHEN OTHERS THEN
                        RAISE_APPLICATION_ERROR(-20010,'Ocurrió un problema inesperado');
        ROLLBACK;
END;





CREATE OR REPLACE PROCEDURE OUTLET_Insert_Client(
        n_calle VARCHAR2,
        n_direcc VARCHAR2,
        n_ciudad VARCHAR2,
        nombre VARCHAR2,
        telefono_cliente NUMBER
)
IS
        c_direccion NUMBER:= sec_cod_direccion.NEXTVAL;
        c_cliente NUMBER:= sec_cod_clientes.NEXTVAL;
        c_ciudad NUMBER:= 0;
BEGIN 
        
        SELECT CODIGO_CIUDAD INTO c_ciudad 
        FROM OUTLET_CIUDAD
        WHERE(OUTLET_CIUDAD.NOMBRE_CIUDAD = n_ciudad);

        LOCK TABLE OUTLET_CLIENTE,OUTLET_Direccion IN ROW EXCLUSIVE MODE;

        INSERT INTO OUTLET_Direccion(CODIGO_DIRECCION,NOMBRE_CALLE,NUMERO_DIRECCION,CODIGO_CIUDAD)    
                VALUES(c_direccion,n_calle,n_direcc,c_ciudad);      
        INSERT INTO OUTLET_CLIENTE(CODIGO_CLIENTE,TELEFONO_CLIENTE,NOMBRE_CLIENTE,CODIGO_DIRECCION)
                VALUES(c_cliente,telefono_cliente,nombre,c_direccion);
        COMMIT;
        EXCEPTION
                WHEN PROGRAM_ERROR THEN
                      RAISE_APPLICATION_ERROR(-6501,'Error de programa y/o asignación de variables');
                WHEN STORAGE_ERROR THEN
                        RAISE_APPLICATION_ERROR(-6500,'Se acabó la memoria o está corrupta');
                WHEN ROWTYPE_MISMATCH THEN
                        RAISE_APPLICATION_ERROR(-6504,'Error de asignación de variables');
                WHEN OTHERS THEN
                        RAISE_APPLICATION_ERROR(-20010,'Ocurrió un problema inesperado');
        ROLLBACK;
END;


CREATE OR REPLACE PROCEDURE OUTLET_Elim_Client(
        C_cliente NUMBER
)
IS
BEGIN 
        LOCK TABLE OUTLET_Cliente IN ROW EXCLUSIVE MODE;

        UPDATE OUTLET_Cliente 
        SET Activo = 0 
        WHERE (Codigo_Cliente = c_cliente);
        COMMIT; 
        INSERT INTO OUTLET_Auditoria(Codigo_Auditoria, Fecha_Desactivacion)
        VALUES (c_cliente, SYSDATE);
EXCEPTION
        WHEN PROGRAM_ERROR THEN
                RAISE_APPLICATION_ERROR(-6501,'Error de programa y/o asignación de variables');
        WHEN STORAGE_ERROR THEN
                RAISE_APPLICATION_ERROR(-6500,'Se acabó la memoria o está corrupta');
        WHEN ROWTYPE_MISMATCH THEN
                RAISE_APPLICATION_ERROR(-6504,'Error de asignación de variables');
        WHEN NO_DATA_FOUND THEN 
                RAISE_APPLICATION_ERROR(-01403,'Cliente no encontrado');
        WHEN OTHERS THEN
                RAISE_APPLICATION_ERROR(-20010,'Ocurrió un problema inesperado');
        ROLLBACK;
END;

CREATE OR REPLACE PROCEDURE OUTLET_Elim_Pendiente(
        Id NUMBER
)
IS
        Cod NUMBER := 0;
BEGIN 
        LOCK TABLE OUTLET_Ventas_Pendientes, OUTLET_Cabecera_Comprobante_Pago IN ROW EXCLUSIVE MODE;

        SELECT CODIGO_COMPROBANTE_PAGO into Cod
        FROM OUTLET_Ventas_Pendientes
        WHERE (ID_Venta_Pendiente = Id);

        UPDATE OUTLET_Cabecera_Comprobante_Pago 
        SET Estado = 1 
        WHERE (CODIGO_COMPROBANTE_PAGO = Cod);

        DELETE FROM OUTLET_Ventas_Pendientes
        WHERE (ID_Venta_Pendiente = Id);


        
EXCEPTION
        WHEN PROGRAM_ERROR THEN
                RAISE_APPLICATION_ERROR(-6501,'Error de programa y/o asignación de variables');
        WHEN STORAGE_ERROR THEN
                RAISE_APPLICATION_ERROR(-6500,'Se acabó la memoria o está corrupta');
        WHEN ROWTYPE_MISMATCH THEN
                RAISE_APPLICATION_ERROR(-6504,'Error de asignación de variables');
        WHEN NO_DATA_FOUND THEN 
                RAISE_APPLICATION_ERROR(-01403,'Cliente no encontrado');
        WHEN OTHERS THEN
                RAISE_APPLICATION_ERROR(-20010,'Ocurrió un problema inesperado');
        ROLLBACK;
END;

CREATE OR REPLACE PROCEDURE OUTLET_Cancel_Pendiente(
        Id NUMBER
)
IS

        Cod NUMBER := 0;
        Cod_P NUMBER := 0;
        cant NUMBER := 0;
        CURSOR c_Productos IS
            SELECT Codigo_Producto, CANTIDAD
            FROM OUTLET_Cuerpo_Comprobante_Pago
            WHERE (Codigo_Comprobante_Pago = Cod);
BEGIN 
        LOCK TABLE OUTLET_Ventas_Pendientes,OUTLET_CUERPO_COMPROBANTE_PAGO IN ROW EXCLUSIVE MODE;

        SELECT CODIGO_COMPROBANTE_PAGO into Cod
        FROM OUTLET_Ventas_Pendientes
        WHERE (ID_Venta_Pendiente = Id);



        OPEN c_Productos;
        LOOP
            FETCH c_Productos INTO Cod_P,cant;
            EXIT WHEN c_Productos%NOTFOUND;

            UPDATE OUTLET_Producto
            SET STOCK = STOCK + cant 
            WHERE(Codigo_Producto = Cod_P);
        END LOOP;
        CLOSE c_Productos;

        DELETE FROM OUTLET_Ventas_Pendientes
        WHERE (ID_Venta_Pendiente = Id);

COMMIT;
EXCEPTION
        WHEN PROGRAM_ERROR THEN
                RAISE_APPLICATION_ERROR(-6501,'Error de programa y/o asignación de variables');
        WHEN STORAGE_ERROR THEN
                RAISE_APPLICATION_ERROR(-6500,'Se acabó la memoria o está corrupta');
        WHEN ROWTYPE_MISMATCH THEN
                RAISE_APPLICATION_ERROR(-6504,'Error de asignación de variables');
        WHEN NO_DATA_FOUND THEN 
                RAISE_APPLICATION_ERROR(-01403,'Cliente no encontrado');
        WHEN OTHERS THEN
                RAISE_APPLICATION_ERROR(-20010,'Ocurrió un problema inesperado');
        ROLLBACK;
END;




CREATE OR REPLACE PROCEDURE OUTLET_Insert_Cabecera(
        Codigo NUMBER
)
IS
        codigo_comprobante NUMBER:= sec_cod_Cabecera.NEXTVAL;
        fechaActual DATE:='';
        Ac NUMBER := 0;


BEGIN

        SELECT ACTIVO INTO Ac
        FROM OUTLET_CLIENTE
        WHERE (CODIGO_CLIENTE = Codigo);

        SELECT SYSDATE into fechaActual
        FROM DUAL;
        IF  Ac = 1 THEN
                INSERT INTO OUTLET_Cabecera_Comprobante_Pago(Codigo_Comprobante_Pago,Fecha,Codigo_Cliente)
                        VALUES(codigo_comprobante,fechaActual,Codigo);
        END IF;

        IF Ac = 0 THEN
                INSERT INTO OUTLET_Cabecera_Comprobante_Pago(Codigo_Comprobante_Pago,Fecha,Codigo_Cliente)
                VALUES(codigo_comprobante,fechaActual,-1);
        END IF;
        COMMIT;
        EXCEPTION
                WHEN PROGRAM_ERROR THEN
                        RAISE_APPLICATION_ERROR(-6501,'Error de programa y/o asignación de variables');
                WHEN STORAGE_ERROR THEN
                        RAISE_APPLICATION_ERROR(-6500,'Se acabó la memoria o está corrupta');
                WHEN ROWTYPE_MISMATCH THEN
                        RAISE_APPLICATION_ERROR(-6504,'Error de asignación de variables');
                WHEN OTHERS THEN
                        RAISE_APPLICATION_ERROR(-20010,'Ocurrió un problema inesperado');
        ROLLBACK;
END; 

CREATE OR REPLACE PROCEDURE OUTLET_Up_Client(
        n_calle VARCHAR2,
        n_direcc VARCHAR2,
        n_ciudad VARCHAR2,
        nombre VARCHAR2,
        c_cliente NUMBER,
        telefono_cliente2 NUMBER
) 
IS
        c_direccion NUMBER:=0;
        c_ciudad NUMBER:=0;
BEGIN 
        SELECT CODIGO_DIRECCION INTO c_direccion
        FROM OUTLET_CLIENTE
        WHERE(Codigo_Cliente = c_cliente);

        IF n_ciudad != 'Select' THEN
                SELECT CODIGO_CIUDAD INTO c_ciudad
                FROM OUTLET_CIUDAD
                WHERE(NOMBRE_CIUDAD = n_ciudad);
        END IF;
        IF n_ciudad = 'Select' THEN
                c_ciudad:=NULL;
        END IF;
        LOCK TABLE OUTLET_CLIENTE, OUTLET_Direccion IN ROW EXCLUSIVE MODE;

        UPDATE OUTLET_Direccion
        SET  NOMBRE_CALLE = n_calle, NUMERO_DIRECCION = n_direcc, CODIGO_CIUDAD = c_ciudad
        WHERE(CODIGO_DIRECCION = c_direccion);

        UPDATE OUTLET_CLIENTE
        SET TELEFONO_CLIENTE = telefono_cliente2, NOMBRE_CLIENTE = nombre, CODIGO_DIRECCION = c_direccion
        WHERE(Codigo_Cliente = c_cliente);                

        COMMIT;
        EXCEPTION
                WHEN PROGRAM_ERROR THEN
                        RAISE_APPLICATION_ERROR(-6501,'Error de programa y/o asignación de variables');
                WHEN STORAGE_ERROR THEN
                        RAISE_APPLICATION_ERROR(-6500,'Se acabó la memoria o está corrupta');
                WHEN ROWTYPE_MISMATCH THEN
                        RAISE_APPLICATION_ERROR(-6504,'Error de asignación de variables');
                WHEN OTHERS THEN
                        RAISE_APPLICATION_ERROR(-20010,'Ocurrió un problema inesperado');
        ROLLBACK;
END;

CREATE OR REPLACE PROCEDURE OUTLET_Insert_Producto(
        Cod NUMBER,
        Stoc NUMBER,
        Precio NUMBER,
        Nombre VARCHAR2,
        color VARCHAR2,
        tipo VARCHAR2,
        minimo NUMBER
)
IS
BEGIN 
        LOCK TABLE OUTLET_PRODUCTO IN ROW EXCLUSIVE MODE;

        INSERT INTO OUTLET_PRODUCTO(Codigo_Producto,Stock,PRECIO_UNITARIO,Nombre_Producto,Color_Producto,Tipo_Producto,Stock_Minimo,Fecha_Registro)    
                VALUES(Cod,Stoc,Precio,Nombre,color,tipo,minimo);   
        COMMIT;
        EXCEPTION
                WHEN PROGRAM_ERROR THEN
                        RAISE_APPLICATION_ERROR(-6501,'Error de programa y/o asignación de variables');
                WHEN STORAGE_ERROR THEN
                        RAISE_APPLICATION_ERROR(-6500,'Se acabó la memoria o está corrupta');
                WHEN ROWTYPE_MISMATCH THEN
                        RAISE_APPLICATION_ERROR(-6504,'Error de asignación de variables');
                WHEN OTHERS THEN
                        RAISE_APPLICATION_ERROR(-20010,'Ocurrió un problema inesperado');
        ROLLBACK;
END;

CREATE OR REPLACE PROCEDURE OUTLET_Elim_Producto(
        cod NUMBER
)
IS
BEGIN 
        LOCK TABLE OUTLET_PRODUCTO IN ROW EXCLUSIVE MODE;

        UPDATE OUTLET_PRODUCTO 
        SET Activo = 0 
        WHERE (Codigo_Producto = cod);

        COMMIT;
        EXCEPTION
                WHEN PROGRAM_ERROR THEN
                        RAISE_APPLICATION_ERROR(-6501,'Error de programa y/o asignación de variables');
                WHEN STORAGE_ERROR THEN
                        RAISE_APPLICATION_ERROR(-6500,'Se acabó la memoria o está corrupta');
                WHEN ROWTYPE_MISMATCH THEN
                        RAISE_APPLICATION_ERROR(-6504,'Error de asignación de variables');
                WHEN NO_DATA_FOUND THEN 
                        RAISE_APPLICATION_ERROR(-01403,'Cliente no encontrado');
                WHEN OTHERS THEN
                        RAISE_APPLICATION_ERROR(-20010,'Ocurrió un problema inesperado');
        ROLLBACK;
END;

CREATE OR REPLACE PROCEDURE OUTLET_Up_Producto(
        codigoP NUMBER,
        stockP NUMBER,
        precio NUMBER,
        nombre VARCHAR2
) 
IS
BEGIN   
        LOCK TABLE OUTLET_PRODUCTO IN ROW EXCLUSIVE MODE;

        UPDATE OUTLET_PRODUCTO
        SET STOCK = stockP, PRECIO_UNITARIO = precio, NOMBRE_PRODUCTO = nombre
        WHERE(Codigo_Producto = codigoP);                

        COMMIT;
        EXCEPTION
                WHEN PROGRAM_ERROR THEN
                        RAISE_APPLICATION_ERROR(-6501,'Error de programa y/o asignación de variables');
                WHEN STORAGE_ERROR THEN
                        RAISE_APPLICATION_ERROR(-6500,'Se acabó la memoria o está corrupta');
                WHEN ROWTYPE_MISMATCH THEN
                        RAISE_APPLICATION_ERROR(-6504,'Error de asignación de variables');
                WHEN OTHERS THEN
                        RAISE_APPLICATION_ERROR(-20010,'Ocurrió un problema inesperado');
        ROLLBACK;
END;

--------------------------------------------------------------------------------------------- NUEVO NUEVO
CREATE OR REPLACE PROCEDURE OUTLET_Up_Producto(
    codigoP NUMBER,
    stockP NUMBER,
    precio NUMBER,
    nombre VARCHAR2,
    minm NUMBER
) 
IS
BEGIN   
    LOCK TABLE OUTLET_PRODUCTO IN ROW EXCLUSIVE MODE;

    UPDATE OUTLET_PRODUCTO
    SET STOCK = stockP, PRECIO_UNITARIO = precio, NOMBRE_PRODUCTO = nombre, STOCK_MINIMO = minm
    WHERE(Codigo_Producto = codigoP);                

    COMMIT;
EXCEPTION
    WHEN PROGRAM_ERROR THEN
        RAISE_APPLICATION_ERROR(-6501,'Error de programa y/o asignación de variables');
    WHEN STORAGE_ERROR THEN
        RAISE_APPLICATION_ERROR(-6500,'Se acabó la memoria o está corrupta');
    WHEN ROWTYPE_MISMATCH THEN
        RAISE_APPLICATION_ERROR(-6504,'Error de asignación de variables');
    WHEN OTHERS THEN
        RAISE_APPLICATION_ERROR(-20010,'Ocurrió un problema inesperado');
        ROLLBACK;
END;
--------------------------------------------------------------------------------------------- FIN NUEVO



CREATE OR REPLACE PROCEDURE OUTLET_Insert_Cuerpo(
        CProducto VARCHAR2,
        Cantidad2 NUMBER
)
IS
        Codigo_Cuerpo NUMBER:= sec_cod_Cuerpo.NEXTVAL;
        codigoactual NUMBER:=0;
        nombreproducto NUMBER:=0;
        total NUMBER:=0;
        v_stock NUMBER:=0;
BEGIN 
        SELECT last_number into codigoactual
        FROM user_sequences
        WHERE sequence_name = 'SEC_COD_CABECERA';


        SELECT Precio_Unitario into total
        FROM OUTLET_Producto
        WHERE(Codigo_Producto = CProducto);

        SELECT STOCK into v_stock
        FROM OUTLET_Producto
        WHERE(Codigo_Producto = CProducto);

        LOCK TABLE OUTLET_Producto, OUTLET_Cuerpo_Comprobante_Pago IN ROW EXCLUSIVE MODE;
        
        IF ((v_stock - Cantidad2 >= 0)) THEN

        INSERT INTO OUTLET_Cuerpo_Comprobante_Pago(Codigo_Cuerpo_Comprobante_Pago,Cantidad,Precio_Total,Codigo_Comprobante_Pago,Codigo_Producto)
                VALUES(Codigo_Cuerpo,Cantidad2,(total*Cantidad2),(codigoactual-1),CProducto);

        --TA MALO ESTO YO CREO        
        UPDATE OUTLET_Producto 
        SET STOCK = (STOCK - Cantidad2)
        WHERE(Codigo_Producto=CProducto);
        
        END IF;
        IF ((v_stock - Cantidad2 < 0)) THEN

        INSERT INTO OUTLET_Cuerpo_Comprobante_Pago(Codigo_Cuerpo_Comprobante_Pago,Cantidad,Precio_Total,Codigo_Comprobante_Pago,Codigo_Producto)
                VALUES(Codigo_Cuerpo,Cantidad2,(total*Cantidad2),(codigoactual-1),'a');

        END IF;

        COMMIT;
        EXCEPTION
                WHEN PROGRAM_ERROR THEN
                        RAISE_APPLICATION_ERROR(-6501,'Error de programa y/o asignación de variables');
                WHEN STORAGE_ERROR THEN
                        RAISE_APPLICATION_ERROR(-6500,'Se acabó la memoria o está corrupta');
                WHEN ROWTYPE_MISMATCH THEN
                        RAISE_APPLICATION_ERROR(-6504,'Error de asignación de variables');
                WHEN OTHERS THEN
                        RAISE_APPLICATION_ERROR(-20010,'Ocurrió un problema inesperado');
        ROLLBACK;
END;


CREATE OR REPLACE PROCEDURE OUTLET_Stock_Producto(
        codigoP NUMBER,
        stockP NUMBER,
        precio NUMBER,
        nombre VARCHAR2
) 
IS
BEGIN   
        LOCK TABLE OUTLET_PRODUCTO IN ROW EXCLUSIVE MODE;

        UPDATE OUTLET_PRODUCTO
        SET STOCK = stockP, PRECIO_UNITARIO = precio, NOMBRE_PRODUCTO = nombre
        WHERE(CODIGO_PRODUCTO = codigoP);                

        COMMIT;
        EXCEPTION
                WHEN PROGRAM_ERROR THEN
                        RAISE_APPLICATION_ERROR(-6501,'Error de programa y/o asignación de variables');
                WHEN STORAGE_ERROR THEN
                        RAISE_APPLICATION_ERROR(-6500,'Se acabó la memoria o está corrupta');
                WHEN ROWTYPE_MISMATCH THEN
                        RAISE_APPLICATION_ERROR(-6504,'Error de asignación de variables');
                WHEN OTHERS THEN
                        RAISE_APPLICATION_ERROR(-20010,'Ocurrió un problema inesperado');
        ROLLBACK;
END;

CREATE OR REPLACE PROCEDURE ObtenerDireccion(
    p_CodigoDireccion IN NUMBER,
    o_NombreCalle OUT VARCHAR2,
    o_NumeroDireccion OUT NUMBER,
    o_NombreCiudad OUT VARCHAR2,
    o_NombreRegion OUT VARCHAR2
)
IS
BEGIN
    LOCK TABLE OUTLET_Direccion IN ROW EXCLUSIVE MODE;
    SELECT D.Nombre_Calle, D.Numero_Direccion, C.Nombre_Ciudad, R.Nombre_Region
    INTO o_NombreCalle, o_NumeroDireccion, o_NombreCiudad, o_NombreRegion
    FROM OUTLET_Direccion D
    JOIN OUTLET_Ciudad C ON D.Codigo_Ciudad = C.Codigo_Ciudad
    JOIN OUTLET_Region R ON C.Codigo_Region = R.Codigo_Region
    WHERE D.Codigo_Direccion = p_CodigoDireccion;
        COMMIT;
        EXCEPTION
                WHEN PROGRAM_ERROR THEN
                        RAISE_APPLICATION_ERROR(-6501,'Error de programa y/o asignación de variables');
                WHEN STORAGE_ERROR THEN
                        RAISE_APPLICATION_ERROR(-6500,'Se acabó la memoria o está corrupta');
                WHEN ROWTYPE_MISMATCH THEN
                        RAISE_APPLICATION_ERROR(-6504,'Error de asignación de variables');
                WHEN NO_DATA_FOUND THEN 
                        RAISE_APPLICATION_ERROR(-01403,'Cliente no encontrado');
                WHEN OTHERS THEN
                        RAISE_APPLICATION_ERROR(-20010,'Ocurrió un problema inesperado');
        ROLLBACK;
END;
                
--------------------------------------------------------------
-------------------Funciones----------------------------------
--------------------------------------------------------------
CREATE OR REPLACE FUNCTION OUTLET_Fun_Nombre(
        cod NUMBER
)
RETURN VARCHAR2
IS 
        ROL VARCHAR2(130);
BEGIN
        SELECT NOMBRE_CLIENTE into ROL
        FROM OUTLET_CLIENTE
        WHERE((CODIGO_CLIENTE = cod));
        RETURN ROL;
        COMMIT;
        EXCEPTION
        WHEN NO_DATA_FOUND THEN
                RETURN NULL; 
        ROLLBACK;
END;


CREATE OR REPLACE FUNCTION OUTLET_Fun_Telefono(
        cod NUMBER
)
RETURN NUMBER
IS 
        telefono NUMBER;
BEGIN
        SELECT TELEFONO_CLIENTE into telefono
        FROM OUTLET_CLIENTE
        WHERE((CODIGO_CLIENTE = cod));
        RETURN telefono;
        COMMIT;
        EXCEPTION
        WHEN NO_DATA_FOUND THEN
                RETURN NULL; 
        ROLLBACK;
END;

--------------------------------------------------------------
-------------------Cursores-----------------------------------
--------------------------------------------------------------

CREATE OR REPLACE PROCEDURE ObtenerBoleta(
    CodigoCabecera IN NUMBER,
    cursor_cabecera OUT SYS_REFCURSOR,
    cursor_cuerpo OUT SYS_REFCURSOR
)
IS
BEGIN
    OPEN cursor_cabecera FOR
        SELECT R.Fecha, R.Codigo_Cliente
        FROM OUTLET_Cabecera_Comprobante_Pago R
        WHERE R.Codigo_Comprobante_Pago = CodigoCabecera;

    OPEN cursor_cuerpo FOR
        SELECT M.Nombre_Producto,M.Color_Producto, C.Cantidad, C.Precio_Total, C.Codigo_Producto
        FROM OUTLET_Cuerpo_Comprobante_Pago C
        JOIN OUTLET_Producto M ON C.Codigo_Producto = M.Codigo_Producto
        WHERE C.Codigo_Comprobante_Pago = CodigoCabecera;
END;



CREATE OR REPLACE PROCEDURE RegistrarVentaPendiente(
    CodigoCabecera IN NUMBER
)
IS
BEGIN
    INSERT INTO OUTLET_Ventas_Pendientes (ID_Venta_Pendiente, Codigo_Comprobante_Pago, Fecha_Registro)
    VALUES (sec_cod_ventas_pendientes.NEXTVAL, CodigoCabecera, SYSDATE);
END;


CREATE OR REPLACE PROCEDURE Eliminar_Clientes_Desactivados
IS
    CURSOR c_cod IS
        SELECT Codigo_Auditoria
        FROM OUTLET_Auditoria
        WHERE Fecha_Desactivacion < SYSDATE - 90;
    cod c_cod%ROWTYPE;
    CCN NUMBER;
    DIC NUMBER;
BEGIN
    OPEN c_cod;
    LOOP
        FETCH c_cod INTO cod;
        EXIT WHEN c_cod%NOTFOUND;

        LOCK TABLE OUTLET_CLIENTE,OUTLET_DIRECCION,OUTLET_Cuerpo_Comprobante_Pago,OUTLET_Cabecera_Comprobante_Pago IN ROW EXCLUSIVE MODE;


        SELECT CODIGO_DIRECCION INTO DIC
        FROM OUTLET_CLIENTE
        WHERE CODIGO_CLIENTE = cod.Codigo_Auditoria;

        DELETE FROM OUTLET_Auditoria
        WHERE(Codigo_Auditoria = cod.Codigo_Auditoria);

        DELETE FROM OUTLET_Cuerpo_Comprobante_Pago
        WHERE CODIGO_COMPROBANTE_PAGO IN (SELECT CODIGO_COMPROBANTE_PAGO 
                                          FROM OUTLET_Cabecera_Comprobante_Pago
                                          WHERE CODIGO_CLIENTE = cod.Codigo_Auditoria);

        DELETE FROM OUTLET_Cabecera_Comprobante_Pago
        WHERE CODIGO_CLIENTE = cod.Codigo_Auditoria;

        DELETE FROM OUTLET_CLIENTE
        WHERE CODIGO_CLIENTE = cod.Codigo_Auditoria;

        DELETE FROM OUTLET_DIRECCION
        WHERE CODIGO_DIRECCION = DIC;
        COMMIT;
    END LOOP;
    CLOSE c_cod;
EXCEPTION
    WHEN PROGRAM_ERROR THEN
        RAISE_APPLICATION_ERROR(-6501,'Error de programa y/o asignación de variables');
    WHEN STORAGE_ERROR THEN
        RAISE_APPLICATION_ERROR(-6500,'Se acabó la memoria o está corrupta');
    WHEN ROWTYPE_MISMATCH THEN
        RAISE_APPLICATION_ERROR(-6504,'Error de asignación de variables');
    WHEN NO_DATA_FOUND THEN 
        RAISE_APPLICATION_ERROR(-01403,'Cliente no encontrado');
    WHEN OTHERS THEN
        RAISE_APPLICATION_ERROR(-20010,'Ocurrió un problema inesperado');
    ROLLBACK;
END;


CREATE OR REPLACE PROCEDURE Eliminar_Productos_Desactivados
IS
    CURSOR c_cod IS
        SELECT Codigo_Auditoria
        FROM OUTLET_Auditoria
        WHERE Fecha_Desactivacion < SYSDATE - 90;
    cod c_cod%ROWTYPE;
    CCN NUMBER;
    DIC NUMBER;
BEGIN
    OPEN c_cod;
    LOOP
        FETCH c_cod INTO cod;
        EXIT WHEN c_cod%NOTFOUND;

        LOCK TABLE OUTLET_PRODUCTO, OUTLET_Cuerpo_Comprobante_Pago IN ROW EXCLUSIVE MODE;

        DELETE FROM OUTLET_Auditoria
        WHERE(Codigo_Auditoria = cod.Codigo_Auditoria);

        DELETE FROM OUTLET_Cuerpo_Comprobante_Pago
        WHERE(CODIGO_PRODUCTO = cod.Codigo_Auditoria);


        DELETE FROM OUTLET_PRODUCTO
        WHERE(CODIGO_PRODUCTO =  cod.Codigo_Auditoria);
        COMMIT;
    END LOOP;
    CLOSE c_cod;
EXCEPTION
    WHEN PROGRAM_ERROR THEN
        RAISE_APPLICATION_ERROR(-6501,'Error de programa y/o asignación de variables');
    WHEN STORAGE_ERROR THEN
        RAISE_APPLICATION_ERROR(-6500,'Se acabó la memoria o está corrupta');
    WHEN ROWTYPE_MISMATCH THEN
        RAISE_APPLICATION_ERROR(-6504,'Error de asignación de variables');
    WHEN NO_DATA_FOUND THEN 
        RAISE_APPLICATION_ERROR(-01403,'Cliente no encontrado');
    WHEN OTHERS THEN
        RAISE_APPLICATION_ERROR(-20010,'Ocurrió un problema inesperado');
    ROLLBACK;
END;


CREATE OR REPLACE PROCEDURE ObtenerInformacionCliente(
    p_cod IN NUMBER,
    o_activo OUT NUMBER,
    o_Telefono OUT VARCHAR2,
    o_Nombres OUT VARCHAR2,
    o_NombreCalle OUT VARCHAR2,
    o_NumeroDireccion OUT VARCHAR2,
    o_NombreCiudad OUT VARCHAR2,
    o_NombreRegion OUT VARCHAR2
)
IS
    CURSOR cliente_cursor IS
        SELECT Telefono_Cliente, Nombre_Cliente, Codigo_Direccion, ACTIVO
        FROM OUTLET_Cliente
        WHERE Codigo_Cliente = p_cod;
        
        
    CURSOR direccion_cursor(p_Codigo_Direccion IN NUMBER) IS
        SELECT Nombre_Calle, Numero_Direccion, Codigo_Ciudad
        FROM OUTLET_Direccion
        WHERE Codigo_Direccion = p_Codigo_Direccion;
        
    CURSOR ciudad_cursor(p_Codigo_Ciudad IN NUMBER) IS
        SELECT Nombre_Ciudad, Codigo_Region
        FROM OUTLET_Ciudad
        WHERE Codigo_Ciudad = p_Codigo_Ciudad;
        
    CURSOR region_cursor(p_Codigo_Region IN NUMBER) IS
        SELECT Nombre_Region
        FROM OUTLET_Region
        WHERE Codigo_Region = p_Codigo_Region;
BEGIN
    FOR cliente_rec IN cliente_cursor LOOP
        o_Telefono := cliente_rec.Telefono_Cliente;
        o_Nombres := cliente_rec.Nombre_Cliente;
        o_activo := cliente_rec.ACTIVO;
        
        FOR direccion_rec IN direccion_cursor(cliente_rec.Codigo_Direccion) LOOP
            o_NombreCalle := direccion_rec.Nombre_Calle;
            o_NumeroDireccion := direccion_rec.Numero_Direccion;

            FOR ciudad_rec IN ciudad_cursor(direccion_rec.Codigo_Ciudad) LOOP
                o_NombreCiudad := ciudad_rec.Nombre_Ciudad;

                FOR region_rec IN region_cursor(ciudad_rec.Codigo_Region) LOOP
                    o_NombreRegion := region_rec.Nombre_Region;
                END LOOP;
            END LOOP;
        END LOOP;
    END LOOP;
END;

CREATE OR REPLACE PROCEDURE Outlet_FiltrarCliente(c_Clientes OUT SYS_REFCURSOR)
AS
BEGIN
  OPEN c_Clientes FOR
    SELECT * FROM OUTLET_Cliente WHERE Activo = 1; -- Filtrar clientes activos, ajusta según tus necesidades.
    
END Outlet_FiltrarCliente;




CREATE OR REPLACE PROCEDURE ObtenerInfoProducto(
    p_CodigoProducto IN NUMBER,
    o_activo OUT NUMBER,
    o_Stock OUT NUMBER,
    o_PrecioUnitario OUT NUMBER,
    o_NombreProducto OUT VARCHAR2,
    o_TipoProducto OUT VARCHAR2,
    o_ColorProducto OUT VARCHAR2
)
IS
    CURSOR c1 IS
        SELECT Stock,Precio_Unitario, Nombre_Producto, Activo, Color_Producto
        FROM OUTLET_Producto 
        WHERE CODIGO_PRODUCTO = p_CodigoProducto;
BEGIN
    OPEN c1;
    FETCH c1 INTO o_Stock, o_PrecioUnitario, o_NombreProducto, o_activo, o_ColorProducto;
    CLOSE c1;
END;


CREATE OR REPLACE PROCEDURE ObtenerTopProductos(
    cursor_resultado OUT SYS_REFCURSOR
)
IS
    v_FechaInicio DATE;
BEGIN
    -- Obtener la fecha de inicio (hace 3 meses)
    v_FechaInicio := ADD_MONTHS(SYSDATE, -3);

    OPEN cursor_resultado FOR
        SELECT M.Nombre_Producto, 
               SUM(C.Cantidad) AS Total_Cantidad, 
               SUM(C.Precio_Total) AS Total_Ventas
        FROM OUTLET_Cuerpo_Comprobante_Pago C
        JOIN OUTLET_PRODUCTO M ON C.Codigo_Producto = M.Codigo_Producto
        JOIN OUTLET_Cabecera_Comprobante_Pago CP ON C.Codigo_Comprobante_Pago = CP.Codigo_Comprobante_Pago
        WHERE CP.Fecha >= v_FechaInicio AND CP.Estado = 1
        GROUP BY M.Nombre_Producto
        ORDER BY Total_Cantidad DESC, Total_Ventas DESC;
END;

------------------------------------------------------------------------------  CORRER ESTE
CREATE OR REPLACE PROCEDURE ObtenerTopProductos(
    p_FechaInicio IN DATE DEFAULT NULL,
    p_FechaFin IN DATE DEFAULT NULL,
    cursor_resultado OUT SYS_REFCURSOR
)
IS
    v_FechaInicio DATE;
    v_FechaFin DATE;
BEGIN
    -- Si no se proporciona fecha de inicio, usamos hace 1 mes por defecto
    IF p_FechaInicio IS NULL THEN
        v_FechaInicio := TO_DATE('2021-01-01', 'YYYY-MM-DD');
    ELSE
        v_FechaInicio := p_FechaInicio;
    END IF;

    -- Si no se proporciona fecha de fin, usamos SYSDATE (hoy)
    IF p_FechaFin IS NULL THEN
        v_FechaFin := SYSDATE;
    ELSE
        v_FechaFin := p_FechaFin;
    END IF;

    OPEN cursor_resultado FOR
        SELECT M.Nombre_Producto, 
               SUM(C.Cantidad) AS Total_Cantidad, 
               SUM(C.Precio_Total) AS Total_Ventas
        FROM OUTLET_Cuerpo_Comprobante_Pago C
        JOIN OUTLET_PRODUCTO M ON C.Codigo_Producto = M.Codigo_Producto
        JOIN OUTLET_Cabecera_Comprobante_Pago CP ON C.Codigo_Comprobante_Pago = CP.Codigo_Comprobante_Pago
        WHERE CP.Fecha BETWEEN v_FechaInicio AND v_FechaFin
        AND CP.Estado = 1
        GROUP BY M.Nombre_Producto
        ORDER BY Total_Cantidad DESC, Total_Ventas DESC;
END;

---------------------------------------------------------------------------- FIN NUEVO


CREATE OR REPLACE PROCEDURE ObtenerProductosMenosVendidos(
    cursor_resultado OUT SYS_REFCURSOR
)
IS
    v_FechaInicio DATE;
BEGIN
    -- Obtener la fecha de inicio (hace 3 meses)
    v_FechaInicio := ADD_MONTHS(SYSDATE, -3);

    OPEN cursor_resultado FOR
        SELECT M.Nombre_Producto, 
               SUM(C.Cantidad) AS Total_Cantidad, 
               SUM(C.Precio_Total) AS Total_Ventas
        FROM OUTLET_Cuerpo_Comprobante_Pago C
        JOIN OUTLET_PRODUCTO M ON C.Codigo_Producto = M.Codigo_Producto
        JOIN OUTLET_Cabecera_Comprobante_Pago CP ON C.Codigo_Comprobante_Pago = CP.Codigo_Comprobante_Pago
        WHERE CP.Fecha >= v_FechaInicio AND CP.Estado = 1
        GROUP BY M.Nombre_Producto
        ORDER BY Total_Cantidad ASC, Total_Ventas ASC;
END;
---------------------------------------------------------------------------- CORRER ESTE
CREATE OR REPLACE PROCEDURE ObtenerProductosMenosVendidos(
    
    p_FechaInicio IN DATE DEFAULT NULL,
    p_FechaFin IN DATE DEFAULT NULL,
    cursor_resultado OUT SYS_REFCURSOR
)
IS
    v_FechaInicio DATE;
    v_FechaFin DATE;
BEGIN
    -- Mismo proceso que en ObtenerTopProductos
    IF p_FechaInicio IS NULL THEN
        v_FechaInicio := TO_DATE('2021-01-01', 'YYYY-MM-DD');
    ELSE
        v_FechaInicio := p_FechaInicio;
    END IF;

    IF p_FechaFin IS NULL THEN
        v_FechaFin := SYSDATE;
    ELSE
        v_FechaFin := p_FechaFin;
    END IF;

    OPEN cursor_resultado FOR
        SELECT M.Nombre_Producto, 
               SUM(C.Cantidad) AS Total_Cantidad, 
               SUM(C.Precio_Total) AS Total_Ventas
        FROM OUTLET_Cuerpo_Comprobante_Pago C
        JOIN OUTLET_PRODUCTO M ON C.Codigo_Producto = M.Codigo_Producto
        JOIN OUTLET_Cabecera_Comprobante_Pago CP ON C.Codigo_Comprobante_Pago = CP.Codigo_Comprobante_Pago
        WHERE CP.Fecha BETWEEN v_FechaInicio AND v_FechaFin
        AND CP.Estado = 1
        GROUP BY M.Nombre_Producto
        ORDER BY Total_Cantidad ASC, Total_Ventas ASC;
END;

---------------------------------------------------------------------------- FIN NUEVO
CREATE OR REPLACE PROCEDURE ObtenerVentasMensuales(
    p_Anio IN NUMBER,
    p_Mes IN NUMBER,
    total_ventas OUT NUMBER
)
IS
    v_FechaInicio DATE;
BEGIN
    -- Obtener la fecha de inicio (hace 3 meses)
    v_FechaInicio := ADD_MONTHS(TO_DATE(p_Anio || '-' || p_Mes || '-01', 'YYYY-MM-DD'), -3);

    SELECT NVL(SUM(C.Precio_Total), 0)
    INTO total_ventas
    FROM OUTLET_Cabecera_Comprobante_Pago R
    JOIN OUTLET_Cuerpo_Comprobante_Pago C ON R.Codigo_Comprobante_Pago = C.Codigo_Comprobante_Pago
    WHERE R.Fecha >= v_FechaInicio AND EXTRACT(YEAR FROM R.Fecha) = p_Anio AND EXTRACT(MONTH FROM R.Fecha) = p_Mes AND R.Estado = 1;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        total_ventas := 0;
END;
-------------------------------------------------------------------------- CORRER ESTE
CREATE OR REPLACE PROCEDURE ObtenerVentasMensuales(
    p_FechaInicio IN DATE DEFAULT NULL,
    p_FechaFin IN DATE DEFAULT NULL,
    total_ventas OUT NUMBER
)
IS
    v_FechaInicio DATE;
    v_FechaFin DATE;
BEGIN
    -- Si no se proporciona un rango de fechas, calcular para el mes anterior
|    -- Si no se proporciona fecha de inicio, usamos hace 1 mes por defecto
    IF p_FechaInicio IS NULL THEN
        v_FechaInicio := TO_DATE('2021-01-01', 'YYYY-MM-DD');
    ELSE
        v_FechaInicio := p_FechaInicio;
    END IF;

    -- Si no se proporciona fecha de fin, usamos SYSDATE (hoy)
    IF p_FechaFin IS NULL THEN
        v_FechaFin := SYSDATE;
    ELSE
        v_FechaFin := p_FechaFin;
    END IF;
    -- Consulta para sumar las ventas en el rango de fechas
    SELECT NVL(SUM(C.Precio_Total), 0)
    INTO total_ventas
    FROM OUTLET_Cabecera_Comprobante_Pago R
    JOIN OUTLET_Cuerpo_Comprobante_Pago C ON R.Codigo_Comprobante_Pago = C.Codigo_Comprobante_Pago
    WHERE R.Fecha BETWEEN v_FechaInicio AND v_FechaFin
    AND R.Estado = 1;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        total_ventas := 0;
END;




-------------------------------------------------------------------------- FIN NUEVO

CREATE OR REPLACE PROCEDURE ObtenerPeorMueble(
    cursor_resultado OUT SYS_REFCURSOR
)
IS
BEGIN
    OPEN cursor_resultado FOR
        SELECT M.NOMBRE_PRODUCTO, SUM(C.Cantidad) AS Total_Cantidad, SUM(C.Precio_Total) AS Total_Ventas
        FROM OUTLET_Cuerpo_Comprobante_Pago C
        JOIN OUTLET_PRODUCTO M ON C.CODIGO_PRODUCTO = M.CODIGO_PRODUCTO
        GROUP BY M.NOMBRE_PRODUCTO
        ORDER BY Total_Cantidad DESC, Total_Ventas ASC;
END;


CREATE OR REPLACE PROCEDURE BuscarProductoPorNombre(
    p_PalabraClave VARCHAR2,
    p_Resultados OUT SYS_REFCURSOR
)
AS
BEGIN
    OPEN p_Resultados FOR
        SELECT *
        FROM OUTLET_Producto
        WHERE UPPER(Nombre_Producto) LIKE '%' || UPPER(p_PalabraClave) || '%'
            AND Activo = 1;
END BuscarProductoPorNombre;


CREATE OR REPLACE PROCEDURE Outlet_FiltrarProducto( --ACTUALZIAR (CORRER DE NUEVO)
    p_PalabraClave IN VARCHAR2,
    color IN VARCHAR2,
    c_Productos OUT SYS_REFCURSOR
) AS
BEGIN
    -- Dividir la cadena de palabras clave en palabras individuales
    FOR r IN (SELECT REGEXP_SUBSTR(UPPER(p_PalabraClave), '[^ ]+', 1, LEVEL) palabra
              FROM dual
              CONNECT BY REGEXP_SUBSTR(UPPER(p_PalabraClave), '[^ ]+', 1, LEVEL) IS NOT NULL)
    LOOP
        OPEN c_Productos FOR
        SELECT Codigo_Producto, Activo, Stock, Precio_Unitario, Nombre_Producto, Tipo_Producto, Color_Producto, STOCK_MINIMO
        FROM OUTLET_Producto
        WHERE (UPPER(COLOR_PRODUCTO) LIKE '%' || UPPER(color) || '%'
          AND (UPPER(Nombre_Producto) LIKE '%' || r.palabra || '%'
          OR UPPER(CODIGO_PRODUCTO) LIKE '%' || r.palabra || '%'))
          AND Activo = 1;
    END LOOP;
END;


CREATE OR REPLACE PROCEDURE Outlet_FiltrarProducto(
    p_PalabraClave IN VARCHAR2,
    color IN VARCHAR2,
    c_Productos OUT SYS_REFCURSOR
) AS
    v_sql VARCHAR2(1000);
BEGIN
    v_sql := 'SELECT Codigo_Producto, Activo, Stock, Precio_Unitario, Nombre_Producto, Tipo_Producto, Color_Producto
              FROM OUTLET_Producto
              WHERE Activo = 1';

    FOR i IN (SELECT regexp_substr(p_PalabraClave, '[^ ]+', 1, level) single_word
              FROM dual
              CONNECT BY regexp_substr(p_PalabraClave, '[^ ]+', 1, level) IS NOT NULL)
    LOOP
        v_sql := v_sql || ' AND UPPER(Nombre_Producto) LIKE ''%' || UPPER(i.single_word) || '%''';
    END LOOP;

    IF color IS NOT NULL THEN
        v_sql := v_sql || ' AND UPPER(COLOR_PRODUCTO) LIKE ''%' || UPPER(color) || '%''';
    END IF;

    OPEN c_Productos FOR v_sql;
END;

CREATE OR REPLACE PROCEDURE Outlet_ObtenerProductosActivos(
    c_Productos OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN c_Productos FOR
    SELECT Codigo_Producto, Stock, Stock_Minimo, Precio_Unitario, Nombre_Producto, Tipo_Producto, Color_Producto, Fecha_Registro
    FROM OUTLET_Producto
    WHERE Activo = 1;
END;


--------------------------------------------------------------
-------------------Triggers-----------------------------------
--------------------------------------------------------------

CREATE OR REPLACE TRIGGER T_Direccion
BEFORE UPDATE ON OUTLET_Direccion
FOR EACH ROW
BEGIN
        IF :NEW.Nombre_Calle is NULL THEN
                :NEW.Nombre_Calle := :OLD.Nombre_Calle;
        END IF;
        IF :NEW.Numero_Direccion is NULL THEN
                :NEW.Numero_Direccion := :OLD.Numero_Direccion;
        END IF;

        IF :NEW.CODIGO_CIUDAD is NULL THEN
                :NEW.CODIGO_CIUDAD := :OLD.CODIGO_CIUDAD;
        END IF;
END;    



CREATE OR REPLACE TRIGGER TCli_Up_Cliente
BEFORE UPDATE ON OUTLET_CLIENTE
FOR EACH ROW
BEGIN
        IF :NEW.TELEFONO_CLIENTE is NULL THEN
                :NEW.TELEFONO_CLIENTE := :OLD.TELEFONO_CLIENTE;
        END IF;
        IF :NEW.NOMBRE_CLIENTE is NULL THEN
                :NEW.NOMBRE_CLIENTE := :OLD.NOMBRE_CLIENTE;
        END IF;
        IF :NEW.CODIGO_DIRECCION is NULL THEN
                :NEW.CODIGO_DIRECCION := :OLD.CODIGO_DIRECCION;
        END IF;
END;   




CREATE OR REPLACE TRIGGER TCiud_up
BEFORE UPDATE ON OUTLET_Ciudad
FOR EACH ROW
BEGIN
        IF :NEW.Nombre_Ciudad = 'Select' THEN
                :NEW.Nombre_Ciudad := :OLD.Nombre_Ciudad;
        END IF;
        IF :NEW.Nombre_Ciudad is NULL THEN
                :NEW.Nombre_Ciudad := :OLD.Nombre_Ciudad;
        END IF;
        IF :NEW.Codigo_Region = 'Select' THEN
                :NEW.Codigo_Region := :OLD.Codigo_Region;
        END IF;
        IF :NEW.Codigo_Region is NULL THEN
                :NEW.Codigo_Region := :OLD.Codigo_Region;
        END IF;
END;    

CREATE OR REPLACE TRIGGER TRegion_up
BEFORE UPDATE ON OUTLET_Region
FOR EACH ROW
BEGIN
        IF :NEW.Nombre_Region = 'Select' THEN
                :NEW.Nombre_Region := :OLD.Nombre_Region;
        END IF;

END;    


------------------------------------------------------- CORRER ESTE
CREATE OR REPLACE TRIGGER Tri_Up_Producto 
BEFORE UPDATE ON OUTLET_PRODUCTO
FOR EACH ROW
BEGIN
        IF :NEW.STOCK is NULL THEN
                :NEW.STOCK := :OLD.STOCK;
        END IF;
        IF :NEW.PRECIO_UNITARIO is NULL THEN
                :NEW.PRECIO_UNITARIO := :OLD.PRECIO_UNITARIO;
        END IF;
        IF :NEW.NOMBRE_PRODUCTO is NULL THEN
                :NEW.NOMBRE_PRODUCTO:= :OLD.NOMBRE_PRODUCTO;
        END IF;
        IF :NEW.STOCK_MINIMO is NULL THEN
                :NEW.STOCK_MINIMO:= :OLD.STOCK_MINIMO;
        END IF;       

END;   
-------------------------------------------------------

CREATE OR REPLACE TRIGGER Up_Stock
BEFORE INSERT OR UPDATE ON OUTLET_PRODUCTO
FOR EACH ROW
BEGIN
    IF :NEW.STOCK < 0 THEN
        :NEW.STOCK := -1 * :NEW.STOCK; 
    END IF;
END;

CREATE OR REPLACE TRIGGER Tri_Up_User
BEFORE UPDATE ON OUTLET_Usuario
FOR EACH ROW
BEGIN
        IF :NEW.Nombre_Usuario is NULL THEN
                :NEW.Nombre_Usuario := :OLD.Nombre_Usuario;
        END IF;
        IF :NEW.Contrasena_Usuario is NULL THEN
                :NEW.Contrasena_Usuario := :OLD.Contrasena_Usuario;
        END IF;
        IF :NEW.Telefono_Usuario is NULL THEN
                :NEW.Telefono_Usuario:= :OLD.Telefono_Usuario;
        END IF;
        IF :NEW.ROL_Usuario is NULL THEN
                :NEW.SROL_Usuario:= :OLD.ROL_Usuario;
        END IF;       

END;   