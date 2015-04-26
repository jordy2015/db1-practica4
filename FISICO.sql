--
-- ER/Studio 8.0 SQL Code Generation
-- Company :      restore
-- Project :      E-R.dm1
-- Author :       Jo
--
-- Date Created : Thursday, April 23, 2015 23:44:37
-- Target DBMS : PostgreSQL 8.0
--

-- 
-- TABLE: "BUS" 
--

CREATE TABLE "BUS"(
    "BUS"        SERIAL,--         NOT NULL,
    "MATRICULA"  varchar(50),
    "MARCA"      varchar(60)    NOT NULL,
    "TIPO"       int4           NOT NULL,
    CONSTRAINT "PK1" PRIMARY KEY ("BUS")
)
;



-- 
-- TABLE: "CLIENTE" 
--

CREATE TABLE "CLIENTE"(
    "DPI"        int4           NOT NULL,
    "NOMBRE"     varchar(80),
    "DIRECCION"  varchar(80),
    "TELEFONO"   varchar(10),
    CONSTRAINT "PK7" PRIMARY KEY ("DPI")
)
;



-- 
-- TABLE: "FACTURA" 
--

CREATE TABLE "FACTURA"(
    "FACTURA"  SERIAL,--              NOT NULL,
    "FECHA"    date,
    "TOTAL"    numeric(10, 0),
    "TIKET"    int4              NOT NULL,
    CONSTRAINT "PK10" PRIMARY KEY ("FACTURA")
)
;



-- 
-- TABLE: "INTINERARIO" 
--

CREATE TABLE "INTINERARIO"(
    "INTINERARIO"  SERIAL,--    NOT NULL,
    "FECHA"        date,
    "H_SALIDA"     time,
    "H_LLEGADA"    time,
    "BUS"          int4    NOT NULL,
    "RUTA"         int4    NOT NULL,
    CONSTRAINT "PK3" PRIMARY KEY ("INTINERARIO")
)
;



-- 
-- TABLE: "PUNTO" 
--

CREATE TABLE "PUNTO"(
    "PUNTO"        SERIAL,--            NOT NULL,
    "DIRECCION"    varchar(100),
    "DESCRIPCION"  varchar(100),
    CONSTRAINT "PK5" PRIMARY KEY ("PUNTO")
)
;



-- 
-- TABLE: "RECORRIDO" 
--

CREATE TABLE "RECORRIDO"(
    "TIKET"  int4    NOT NULL,
    "VIAJE"  int4    NOT NULL
)
;



-- 
-- TABLE: "RUTA" 
--

CREATE TABLE "RUTA"(
    "RUTA"     SERIAL,--            NOT NULL,
    "NOMBRE"   varchar(100),
    "ORIGEN"   varchar(80),
    "DESTINO"  varchar(80),
    CONSTRAINT "PK4" PRIMARY KEY ("RUTA")
)
;



-- 
-- TABLE: "TIKET" 
--

CREATE TABLE "TIKET"(
    "TIKET"          SERIAL,--    NOT NULL,
    "F_VENCIMIENTO"  date,
    "F_GENERADO"     date,
    "INTINERARIO"    int4    NOT NULL,
    "DPI"            int4    NOT NULL,
    CONSTRAINT "PK8" PRIMARY KEY ("TIKET")
)
;



-- 
-- TABLE: "TIPO" 
--

CREATE TABLE "TIPO"(
    "TIPO"       SERIAL,--           NOT NULL,
    "NOMBRE"     varchar(50),
    "CAPACIDAD"  int4,
    CONSTRAINT "PK2" PRIMARY KEY ("TIPO")
)
;



-- 
-- TABLE: "VIAJE" 
--

CREATE TABLE "VIAJE"(
    "VIAJE"       SERIAL,--              NOT NULL,
    "KILOMETROS"  int4,
    "PRECIO"      numeric(10, 0),
    "H_SALIDA"    time,
    "H_LLEGADA"   time,
    "RUTA"        int4              NOT NULL,
    "P_INICIO"    int4              NOT NULL,
    "P_LLEGADA"   int4              NOT NULL,
    CONSTRAINT "PK6" PRIMARY KEY ("VIAJE")
)
;



-- 
-- TABLE: "BUS" 
--

ALTER TABLE "BUS" ADD CONSTRAINT "RefTIPO2" 
    FOREIGN KEY ("TIPO")
    REFERENCES "TIPO"("TIPO") ON DELETE RESTRICT ON UPDATE RESTRICT
;


-- 
-- TABLE: "FACTURA" 
--

ALTER TABLE "FACTURA" ADD CONSTRAINT "RefTIKET13" 
    FOREIGN KEY ("TIKET")
    REFERENCES "TIKET"("TIKET") ON DELETE RESTRICT ON UPDATE RESTRICT
;


-- 
-- TABLE: "INTINERARIO" 
--

ALTER TABLE "INTINERARIO" ADD CONSTRAINT "RefBUS3" 
    FOREIGN KEY ("BUS")
    REFERENCES "BUS"("BUS") ON DELETE RESTRICT ON UPDATE RESTRICT
;

ALTER TABLE "INTINERARIO" ADD CONSTRAINT "RefRUTA4" 
    FOREIGN KEY ("RUTA")
    REFERENCES "RUTA"("RUTA") ON DELETE RESTRICT ON UPDATE RESTRICT
;


-- 
-- TABLE: "RECORRIDO" 
--

ALTER TABLE "RECORRIDO" ADD CONSTRAINT "RefTIKET11" 
    FOREIGN KEY ("TIKET")
    REFERENCES "TIKET"("TIKET") ON DELETE RESTRICT ON UPDATE RESTRICT
;

ALTER TABLE "RECORRIDO" ADD CONSTRAINT "RefVIAJE12" 
    FOREIGN KEY ("VIAJE")
    REFERENCES "VIAJE"("VIAJE") ON DELETE RESTRICT ON UPDATE RESTRICT
;


-- 
-- TABLE: "TIKET" 
--

ALTER TABLE "TIKET" ADD CONSTRAINT "RefINTINERARIO8" 
    FOREIGN KEY ("INTINERARIO")
    REFERENCES "INTINERARIO"("INTINERARIO") ON DELETE RESTRICT ON UPDATE RESTRICT
;

ALTER TABLE "TIKET" ADD CONSTRAINT "RefCLIENTE9" 
    FOREIGN KEY ("DPI")
    REFERENCES "CLIENTE"("DPI") ON DELETE RESTRICT ON UPDATE RESTRICT
;


-- 
-- TABLE: "VIAJE" 
--

ALTER TABLE "VIAJE" ADD CONSTRAINT "RefRUTA5" 
    FOREIGN KEY ("RUTA")
    REFERENCES "RUTA"("RUTA") ON DELETE RESTRICT ON UPDATE RESTRICT
;

ALTER TABLE "VIAJE" ADD CONSTRAINT "RefPUNTO6" 
    FOREIGN KEY ("P_INICIO")
    REFERENCES "PUNTO"("PUNTO") ON DELETE RESTRICT ON UPDATE RESTRICT
;

ALTER TABLE "VIAJE" ADD CONSTRAINT "RefPUNTO7" 
    FOREIGN KEY ("P_LLEGADA")
    REFERENCES "PUNTO"("PUNTO") ON DELETE RESTRICT ON UPDATE RESTRICT
;


