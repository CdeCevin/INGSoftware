-- Archivo creado  - miércoles-junio-25-2025   
--------------------------------------------------------
--------------------------------------------------------
--  DDL for Table OUTLET_AUDITORIA
--------------------------------------------------------

  CREATE TABLE "CEVIN"."OUTLET_AUDITORIA" 
   (	"CODIGO_AUDITORIA" NUMBER, 
	"FECHA_DESACTIVACION" DATE
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "USERS" ;
--------------------------------------------------------
--  DDL for Table OUTLET_CABECERA_COMPROBANTE_PAGO
--------------------------------------------------------

  CREATE TABLE "CEVIN"."OUTLET_CABECERA_COMPROBANTE_PAGO" 
   (	"CODIGO_COMPROBANTE_PAGO" NUMBER, 
	"FECHA" DATE, 
	"ESTADO" NUMBER DEFAULT 0, 
	"CODIGO_CLIENTE" NUMBER, 
	"RUT_USUARIO" NUMBER
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "USERS" ;
--------------------------------------------------------
--  DDL for Table OUTLET_CIUDAD
--------------------------------------------------------

  CREATE TABLE "CEVIN"."OUTLET_CIUDAD" 
   (	"CODIGO_CIUDAD" NUMBER, 
	"NOMBRE_CIUDAD" VARCHAR2(30 BYTE), 
	"CODIGO_REGION" NUMBER
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "USERS" ;
--------------------------------------------------------
--  DDL for Table OUTLET_CLIENTE
--------------------------------------------------------

  CREATE TABLE "CEVIN"."OUTLET_CLIENTE" 
   (	"CODIGO_CLIENTE" NUMBER, 
	"TELEFONO_CLIENTE" NUMBER, 
	"NOMBRE_CLIENTE" VARCHAR2(130 BYTE), 
	"CODIGO_DIRECCION" NUMBER, 
	"ACTIVO" NUMBER DEFAULT 1
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "USERS" ;
--------------------------------------------------------
--  DDL for Table OUTLET_CUERPO_COMPROBANTE_PAGO
--------------------------------------------------------

  CREATE TABLE "CEVIN"."OUTLET_CUERPO_COMPROBANTE_PAGO" 
   (	"CODIGO_CUERPO_COMPROBANTE_PAGO" NUMBER, 
	"CANTIDAD" NUMBER, 
	"PRECIO_TOTAL" NUMBER, 
	"CODIGO_COMPROBANTE_PAGO" NUMBER, 
	"CODIGO_PRODUCTO" NUMBER
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "USERS" ;
--------------------------------------------------------
--  DDL for Table OUTLET_DIRECCION
--------------------------------------------------------

  CREATE TABLE "CEVIN"."OUTLET_DIRECCION" 
   (	"CODIGO_DIRECCION" NUMBER, 
	"NOMBRE_CALLE" VARCHAR2(70 BYTE), 
	"NUMERO_DIRECCION" NUMBER, 
	"CODIGO_CIUDAD" NUMBER
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "USERS" ;
--------------------------------------------------------
--  DDL for Table OUTLET_PRODUCTO
--------------------------------------------------------

  CREATE TABLE "CEVIN"."OUTLET_PRODUCTO" 
   (	"CODIGO_PRODUCTO" NUMBER, 
	"TIPO_PRODUCTO" VARCHAR2(20 BYTE), 
	"NOMBRE_PRODUCTO" VARCHAR2(60 BYTE), 
	"STOCK" NUMBER, 
	"PRECIO_UNITARIO" NUMBER, 
	"COLOR_PRODUCTO" VARCHAR2(20 BYTE), 
	"ACTIVO" NUMBER DEFAULT 1, 
	"STOCK_MINIMO" NUMBER, 
	"FECHA_REGISTRO" DATE
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "USERS" ;
--------------------------------------------------------
--  DDL for Table OUTLET_REGION
--------------------------------------------------------

  CREATE TABLE "CEVIN"."OUTLET_REGION" 
   (	"CODIGO_REGION" NUMBER, 
	"NOMBRE_REGION" VARCHAR2(50 BYTE)
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "USERS" ;
--------------------------------------------------------
--  DDL for Table OUTLET_USUARIO
--------------------------------------------------------

  CREATE TABLE "CEVIN"."OUTLET_USUARIO" 
   (	"RUT_USUARIO" NUMBER, 
	"CONTRASENA_USUARIO" VARCHAR2(60 BYTE), 
	"TELEFONO_USUARIO" NUMBER, 
	"NOMBRE_USUARIO" VARCHAR2(50 BYTE), 
	"ROL_USUARIO" VARCHAR2(15 BYTE), 
	"ACTIVO" NUMBER DEFAULT 1
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "USERS" ;
--------------------------------------------------------
--  DDL for Table OUTLET_VENTAS_PENDIENTES
--------------------------------------------------------

  CREATE TABLE "CEVIN"."OUTLET_VENTAS_PENDIENTES" 
   (	"ID_VENTA_PENDIENTE" NUMBER, 
	"CODIGO_COMPROBANTE_PAGO" NUMBER, 
	"FECHA_REGISTRO" DATE
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "USERS" ;
REM INSERTING into CEVIN.OUTLET_AUDITORIA