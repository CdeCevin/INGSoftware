--------------------------------------------------------
-- Archivo creado  - miércoles-junio-18-2025   
--------------------------------------------------------
--------------------------------------------------------
--  DDL for Sequence SEC_COD_CABECERA
--------------------------------------------------------

   CREATE SEQUENCE  "CEVIN"."SEC_COD_CABECERA"  MINVALUE 1 MAXVALUE 99999 INCREMENT BY 1 START WITH 266 NOCACHE  NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;
--------------------------------------------------------
--  DDL for Sequence SEC_COD_CLIENTES
--------------------------------------------------------

   CREATE SEQUENCE  "CEVIN"."SEC_COD_CLIENTES"  MINVALUE 1 MAXVALUE 99999 INCREMENT BY 1 START WITH 177 NOCACHE  NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;
--------------------------------------------------------
--  DDL for Sequence SEC_COD_CUERPO
--------------------------------------------------------

   CREATE SEQUENCE  "CEVIN"."SEC_COD_CUERPO"  MINVALUE 1 MAXVALUE 99999 INCREMENT BY 1 START WITH 255 NOCACHE  NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;
--------------------------------------------------------
--  DDL for Sequence SEC_COD_DIRECCION
--------------------------------------------------------

   CREATE SEQUENCE  "CEVIN"."SEC_COD_DIRECCION"  MINVALUE 1 MAXVALUE 99999 INCREMENT BY 1 START WITH 177 NOCACHE  NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;
--------------------------------------------------------
--  DDL for Sequence SEC_COD_VENTAS_PENDIENTES
--------------------------------------------------------

   CREATE SEQUENCE  "CEVIN"."SEC_COD_VENTAS_PENDIENTES"  MINVALUE 1 MAXVALUE 99999 INCREMENT BY 1 START WITH 125 NOCACHE  NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;
--------------------------------------------------------
--  DDL for Trigger TCIUD_UP
--------------------------------------------------------

  CREATE OR REPLACE NONEDITIONABLE TRIGGER "CEVIN"."TCIUD_UP" 
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
/
ALTER TRIGGER "CEVIN"."TCIUD_UP" ENABLE;
--------------------------------------------------------
--  DDL for Trigger TCLI_UP_CLIENTE
--------------------------------------------------------

  CREATE OR REPLACE NONEDITIONABLE TRIGGER "CEVIN"."TCLI_UP_CLIENTE" 
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
/
ALTER TRIGGER "CEVIN"."TCLI_UP_CLIENTE" ENABLE;
--------------------------------------------------------
--  DDL for Trigger T_DIRECCION
--------------------------------------------------------

  CREATE OR REPLACE NONEDITIONABLE TRIGGER "CEVIN"."T_DIRECCION" 
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
/
ALTER TRIGGER "CEVIN"."T_DIRECCION" ENABLE;
--------------------------------------------------------
--  DDL for Trigger TREGION_UP
--------------------------------------------------------

  CREATE OR REPLACE NONEDITIONABLE TRIGGER "CEVIN"."TREGION_UP" 
BEFORE UPDATE ON OUTLET_Region
FOR EACH ROW
BEGIN
        IF :NEW.Nombre_Region = 'Select' THEN
                :NEW.Nombre_Region := :OLD.Nombre_Region;
        END IF;

END;
/
ALTER TRIGGER "CEVIN"."TREGION_UP" ENABLE;
--------------------------------------------------------
--  DDL for Trigger TRI_UP_PRODUCTO
--------------------------------------------------------

  CREATE OR REPLACE NONEDITIONABLE TRIGGER "CEVIN"."TRI_UP_PRODUCTO" 
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
--------------------
/
ALTER TRIGGER "CEVIN"."TRI_UP_PRODUCTO" ENABLE;
--------------------------------------------------------
--  DDL for Trigger TRI_UP_USER
--------------------------------------------------------

  CREATE OR REPLACE NONEDITIONABLE TRIGGER "CEVIN"."TRI_UP_USER" 
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
                :NEW.ROL_Usuario:= :OLD.ROL_Usuario;
        END IF;

END;
/
ALTER TRIGGER "CEVIN"."TRI_UP_USER" ENABLE;
--------------------------------------------------------
--  DDL for Trigger UP_STOCK
--------------------------------------------------------

  CREATE OR REPLACE NONEDITIONABLE TRIGGER "CEVIN"."UP_STOCK" 
BEFORE INSERT OR UPDATE ON OUTLET_PRODUCTO
FOR EACH ROW
BEGIN
    IF :NEW.STOCK < 0 THEN
        :NEW.STOCK := -1 * :NEW.STOCK;
    END IF;
END;
/
ALTER TRIGGER "CEVIN"."UP_STOCK" ENABLE;
--------------------------------------------------------
--  DDL for Procedure BUSCARPRODUCTOPORNOMBRE
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."BUSCARPRODUCTOPORNOMBRE" (
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

/
--------------------------------------------------------
--  DDL for Procedure ELIMINAR_CLIENTES_DESACTIVADOS
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."ELIMINAR_CLIENTES_DESACTIVADOS" 
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

/
--------------------------------------------------------
--  DDL for Procedure ELIMINAR_PRODUCTOS_DESACTIVADOS
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."ELIMINAR_PRODUCTOS_DESACTIVADOS" 
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

/
--------------------------------------------------------
--  DDL for Procedure OBTENERBOLETA
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."OBTENERBOLETA" (
    CodigoCabecera IN NUMBER,
    cursor_cabecera OUT SYS_REFCURSOR,
    cursor_cuerpo OUT SYS_REFCURSOR
)
IS
BEGIN
    OPEN cursor_cabecera FOR
        SELECT R.Fecha, R.Codigo_Cliente, U.RUT_Usuario, U.Nombre_Usuario
        FROM OUTLET_Cabecera_Comprobante_Pago R
        JOIN OUTLET_Usuario U ON R.RUT_Usuario = U.RUT_Usuario
        WHERE R.Codigo_Comprobante_Pago = CodigoCabecera;

    OPEN cursor_cuerpo FOR
        SELECT M.Nombre_Producto, M.Color_Producto, C.Cantidad, C.Precio_Total, C.Codigo_Producto
        FROM OUTLET_Cuerpo_Comprobante_Pago C
        JOIN OUTLET_Producto M ON C.Codigo_Producto = M.Codigo_Producto
        WHERE C.Codigo_Comprobante_Pago = CodigoCabecera;
END;

/
--------------------------------------------------------
--  DDL for Procedure OBTENERDIRECCION
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."OBTENERDIRECCION" (
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
                

/
--------------------------------------------------------
--  DDL for Procedure OBTENERINFOPRODUCTO
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."OBTENERINFOPRODUCTO" (
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

/
--------------------------------------------------------
--  DDL for Procedure OBTENERINFORMACIONCLIENTE
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."OBTENERINFORMACIONCLIENTE" (
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

/
--------------------------------------------------------
--  DDL for Procedure OBTENERPEORMUEBLE
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."OBTENERPEORMUEBLE" (
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

/
--------------------------------------------------------
--  DDL for Procedure OBTENERPRODUCTOSBAJOSTOCK
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."OBTENERPRODUCTOSBAJOSTOCK" (
    cursor_resultado OUT SYS_REFCURSOR -- Cursor de salida para devolver los resultados
) AS
BEGIN
    OPEN cursor_resultado FOR
    SELECT
        Codigo_Producto,
        Tipo_Producto,
        Nombre_Producto,
        Stock,
        Precio_Unitario,
        Color_Producto,
        Stock_Minimo
    FROM
        OUTLET_Producto
    WHERE
        Stock <= Stock_Minimo AND
        Activo = 1; -- Filtra solo productos activos
END ObtenerProductosBajoStock;

/
--------------------------------------------------------
--  DDL for Procedure OBTENERPRODUCTOSMENOSVENDIDOS
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."OBTENERPRODUCTOSMENOSVENDIDOS" (
    
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
        FETCH FIRST 10 ROWS ONLY;
END;

/
--------------------------------------------------------
--  DDL for Procedure OBTENERTOPPRODUCTOS
--------------------------------------------------------
        set define off;

        CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."OBTENERTOPPRODUCTOS" (
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
                FETCH FIRST 10 ROWS ONLY;
        END;

        /
--------------------------------------------------------
--  DDL for Procedure OBTENERVENTASMENSUALES
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."OBTENERVENTASMENSUALES" (
    p_FechaInicio IN DATE DEFAULT NULL,
    p_FechaFin IN DATE DEFAULT NULL,
    total_ventas OUT NUMBER
)
IS
    v_FechaInicio DATE;
    v_FechaFin DATE;
BEGIN
    -- Si no se proporciona un rango de fechas, calcular para el mes anterior
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

/
--------------------------------------------------------
--  DDL for Procedure OUTLET_AUTH_USER
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."OUTLET_AUTH_USER" (
    p_rut        IN  OUTLET_Usuario.RUT_Usuario%TYPE,
    p_password   IN  OUTLET_Usuario.Contrasena_Usuario%TYPE,
    p_role       OUT OUTLET_Usuario.ROL_Usuario%TYPE
) IS
    v_count NUMBER;
BEGIN
    -- Verificamos existencia y contraseña
    SELECT COUNT(*)
      INTO v_count
      FROM OUTLET_Usuario
     WHERE RUT_Usuario = p_rut
       AND Contrasena_Usuario = p_password;

    IF v_count = 1 THEN
        -- Si coincide, devolvemos el rol
        SELECT ROL_Usuario
          INTO p_role
          FROM OUTLET_Usuario
         WHERE RUT_Usuario = p_rut;
    ELSE
        -- Rol vacío indica fallo de autenticación
        p_role := NULL;
    END IF;
END;

/
--------------------------------------------------------
--  DDL for Procedure OUTLET_CANCEL_PENDIENTE
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."OUTLET_CANCEL_PENDIENTE" (
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

/
--------------------------------------------------------
--  DDL for Procedure OUTLET_ELIM_CLIENT
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."OUTLET_ELIM_CLIENT" (
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

/
--------------------------------------------------------
--  DDL for Procedure OUTLET_ELIMINAR_USER
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."OUTLET_ELIMINAR_USER" (
        Rut NUMBER
)
IS
BEGIN

        UPDATE OUTLET_USUARIO
        SET Activo = 0
        WHERE (Rut = Rut_Usuario AND Activo = 1);
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

/
--------------------------------------------------------
--  DDL for Procedure OUTLET_ELIM_PENDIENTE
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."OUTLET_ELIM_PENDIENTE" (
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

/
--------------------------------------------------------
--  DDL for Procedure OUTLET_ELIM_PRODUCTO
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."OUTLET_ELIM_PRODUCTO" (
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

/
--------------------------------------------------------
--  DDL for Procedure OUTLET_FILTRARCLIENTE
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."OUTLET_FILTRARCLIENTE" (c_Clientes OUT SYS_REFCURSOR)
AS
BEGIN
  OPEN c_Clientes FOR
    SELECT * FROM OUTLET_Cliente WHERE Activo = 1; -- Filtrar clientes activos, ajusta según tus necesidades.
    
END Outlet_FiltrarCliente;

/
--------------------------------------------------------
--  DDL for Procedure OUTLET_FILTRARPRODUCTO
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."OUTLET_FILTRARPRODUCTO" (
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

/
--------------------------------------------------------
--  DDL for Procedure OUTLET_FILTRARUSUARIOS
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."OUTLET_FILTRARUSUARIOS" (
  c_Usuarios OUT SYS_REFCURSOR
) AS
BEGIN
  OPEN c_Usuarios FOR
    SELECT
      RUT_Usuario,
      Telefono_Usuario,
      Nombre_Usuario,
      ROL_Usuario
    FROM OUTLET_Usuario
    WHERE Activo = 1; 
END;

/
--------------------------------------------------------
--  DDL for Procedure OUTLET_INSERT_CABECERA
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."OUTLET_INSERT_CABECERA" (
    Codigo NUMBER,
    rutUsuario NUMBER -- Asegúrate de que el tipo de RUT_Usuario en la tabla sea NUMBER
)
IS
    codigo_comprobante NUMBER := sec_cod_Cabecera.NEXTVAL;
    fechaActual DATE; -- Corrección: Solo declara la variable, no la inicialices con string vacía
    Ac NUMBER := 0;

BEGIN

    SELECT ACTIVO INTO Ac
    FROM OUTLET_CLIENTE
    WHERE (CODIGO_CLIENTE = Codigo);

    SELECT SYSDATE INTO fechaActual
    FROM DUAL;

    -- Usamos ELSIF para condiciones mutuamente excluyentes
    IF Ac = 1 THEN
        INSERT INTO OUTLET_Cabecera_Comprobante_Pago(Codigo_Comprobante_Pago, Fecha, Codigo_Cliente, RUT_Usuario)
        VALUES(codigo_comprobante, fechaActual, Codigo, rutUsuario);
    ELSIF Ac = 0 THEN
        -- Corrección: Asegúrate de que el número de columnas y valores coincida.
        -- Si Codigo_Cliente debe ser -1, y RUT_Usuario también debe insertarse.
        INSERT INTO OUTLET_Cabecera_Comprobante_Pago(Codigo_Comprobante_Pago, Fecha, Codigo_Cliente)
        VALUES(codigo_comprobante, fechaActual, -1);
    END IF;

    COMMIT;

EXCEPTION
    WHEN PROGRAM_ERROR THEN
        ROLLBACK; -- Rollback antes de levantar el error
        RAISE_APPLICATION_ERROR(-6501,'Error de programa y/o asignación de variables');
    WHEN STORAGE_ERROR THEN
        ROLLBACK; -- Rollback antes de levantar el error
        RAISE_APPLICATION_ERROR(-6500,'Se acabó la memoria o está corrupta');
    WHEN ROWTYPE_MISMATCH THEN
        ROLLBACK; -- Rollback antes de levantar el error
        RAISE_APPLICATION_ERROR(-6504,'Error de asignación de variables');
    WHEN OTHERS THEN
        ROLLBACK; -- Rollback antes de levantar el error
        RAISE_APPLICATION_ERROR(-20010,'Ocurrió un problema inesperado');
END;

/
--------------------------------------------------------
--  DDL for Procedure OUTLET_INSERT_CLIENT
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."OUTLET_INSERT_CLIENT" (
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

/
--------------------------------------------------------
--  DDL for Procedure OUTLET_INSERT_CUERPO
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."OUTLET_INSERT_CUERPO" (
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

/
--------------------------------------------------------
--  DDL for Procedure OUTLET_INSERT_PRODUCTO
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."OUTLET_INSERT_PRODUCTO" (
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
                VALUES(Cod,Stoc,Precio,Nombre,color,tipo,minimo, SYSDATE);
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

/
--------------------------------------------------------
--  DDL for Procedure OUTLET_INSERT_USER
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."OUTLET_INSERT_USER" (
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

/
--------------------------------------------------------
--  DDL for Procedure OUTLET_OBTENERPRODUCTOSACTIVOS
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."OUTLET_OBTENERPRODUCTOSACTIVOS" (
    c_Productos OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN c_Productos FOR
    SELECT Codigo_Producto, Stock, Stock_Minimo, Precio_Unitario, Nombre_Producto, Tipo_Producto, Color_Producto, Fecha_Registro
    FROM OUTLET_Producto
    WHERE Activo = 1;
END;

/
--------------------------------------------------------
--  DDL for Procedure OUTLET_STOCK_PRODUCTO
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."OUTLET_STOCK_PRODUCTO" (
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

/
--------------------------------------------------------
--  DDL for Procedure OUTLET_UP_CLIENT
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."OUTLET_UP_CLIENT" (
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

/
--------------------------------------------------------
--  DDL for Procedure OUTLET_UP_PRODUCTO
--------------------------------------------------------
set define off;

create or replace NONEDITIONABLE PROCEDURE OUTLET_Up_Producto(
    codigoP NUMBER,
    stockP NUMBER,
    precio NUMBER,
    nombre VARCHAR2,
    minm NUMBER
)
IS
    rows_update NUMBER;
BEGIN
    LOCK TABLE OUTLET_PRODUCTO IN ROW EXCLUSIVE MODE;

    UPDATE OUTLET_PRODUCTO
    SET STOCK = stockP, PRECIO_UNITARIO = precio, NOMBRE_PRODUCTO = nombre, STOCK_MINIMO = minm
    WHERE(Codigo_Producto = codigoP);
    
    rows_update := SQL%ROWCOUNT;
    
    IF rows_update = 0 THEN
        RAISE_APPLICATION_ERROR(-2001, 'El producto con el código '||codigoP||' no existe.');
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

/
--------------------------------------------------------
--  DDL for Procedure OUTLET_UP_USUARIO
--------------------------------------------------------
set define off;

create or replace NONEDITIONABLE PROCEDURE OUTLET_Up_Usuario(
        Rut NUMBER,
        Telefono NUMBER,
        contrasena VARCHAR2,
        tipo VARCHAR2,
        nombre VARCHAR2
)
IS
        rows_update NUMBER;
BEGIN
        LOCK TABLE OUTLET_PRODUCTO IN ROW EXCLUSIVE MODE;
        UPDATE OUTLET_USUARIO
        SET Nombre_Usuario = nombre, Contrasena_Usuario = contrasena, Telefono_Usuario = Telefono, ROL_Usuario = tipo
        WHERE(RUT_Usuario = Rut and Activo = 1);

        rows_update := SQL%ROWCOUNT;
        IF rows_update = 0 THEN
            RAISE_APPLICATION_ERROR(-2001, 'El producto con el código '||Rut||' no existe.');
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

/
--------------------------------------------------------
--  DDL for Procedure REGISTRARVENTAPENDIENTE
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "CEVIN"."REGISTRARVENTAPENDIENTE" (
    CodigoCabecera IN NUMBER
)
IS
BEGIN
    INSERT INTO OUTLET_Ventas_Pendientes (ID_Venta_Pendiente, Codigo_Comprobante_Pago, Fecha_Registro)
    VALUES (sec_cod_ventas_pendientes.NEXTVAL, CodigoCabecera, SYSDATE);
END;

/
--------------------------------------------------------
--  DDL for Function OUTLET_FUN_NOMBRE
--------------------------------------------------------

  CREATE OR REPLACE NONEDITIONABLE FUNCTION "CEVIN"."OUTLET_FUN_NOMBRE" (
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

/
--------------------------------------------------------
--  DDL for Function OUTLET_FUN_TELEFONO
--------------------------------------------------------

  CREATE OR REPLACE NONEDITIONABLE FUNCTION "CEVIN"."OUTLET_FUN_TELEFONO" (
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

/
