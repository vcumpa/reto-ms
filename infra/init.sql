-- Script DDL de Inicialización para PostgreSQL (retoms)

-- 1. Tabla de Usuario para AuthService
CREATE TABLE IF NOT EXISTS "Usuarios" (
    "Id" SERIAL PRIMARY KEY,
    "Email" VARCHAR(150) NOT NULL UNIQUE,
    "PasswordHash" VARCHAR(250) NOT NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "Rol" VARCHAR(50) NOT NULL,
    "FechaRegistro" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed de usuario inicial (admin - vcumpa / Admin123! / Reader123!)
-- Hash BCrypt para 'Admin123!'
INSERT INTO "Usuarios" ("Email", "PasswordHash", "IsActive", "Rol") VALUES ('admin@retoms.com', '$2b$10$yRSN0BqbNBl3v1Cj8M0TD.wx4iq874lS.7MQkS2DoVn3dzRwY/n6O', TRUE, 'Admin');
INSERT INTO "Usuarios" ("Email", "PasswordHash", "IsActive", "Rol") VALUES ('vcumpa@retoms.com', '$2b$10$n/t0JRXbJth1r9I.BXMRZuyrEmU/fZP9sm/DnZBegRvtfNaA32WXy', TRUE, 'Reader');
    

-- 2. Tabla Principal de Trazabilidad de Cargas
CREATE TABLE IF NOT EXISTS "CargaArchivo" (
    "Id" SERIAL PRIMARY KEY,
    "NombreArchivo" VARCHAR(200) NOT NULL,
    "RutaStorage" VARCHAR(500) NOT NULL,
    "Usuario" VARCHAR(150) NOT NULL,
    "Periodo" INT NOT NULL,
    "Estado" INT NOT NULL,
    "Observacion" VARCHAR(1000) NULL,
    "FechaRegistro" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaFin" TIMESTAMPTZ NULL
);

-- 4. Tabla de Detalle de Filas del Excel
CREATE TABLE IF NOT EXISTS "CargaDetalle" (
    "Id" SERIAL PRIMARY KEY,
    "IdCargaArchivo" INT NOT NULL REFERENCES "CargaArchivo"("Id") ON DELETE CASCADE,
    "NumeroFila" INT NOT NULL,
    "Periodo" VARCHAR(50) NULL,
    "CodigoProducto" VARCHAR(100) NULL,
    "Descripcion" VARCHAR(250) NULL,
    "Estado" INT NOT NULL,
    "Observacion" VARCHAR(500) NULL,
    "FechaRegistro" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla de Datos Procesados (Registros Válidos del Excel)
CREATE TABLE IF NOT EXISTS "DataProcesada" (
    "Id" SERIAL PRIMARY KEY,
    "IdCargaArchivo" INT NOT NULL REFERENCES "CargaArchivo"("Id") ON DELETE CASCADE,
    "CodigoProducto" VARCHAR(100) NOT NULL,
    "Periodo" INT NOT NULL,
    "Descripcion" VARCHAR(250) NULL,
    "FechaProceso" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices recomendados
CREATE INDEX IF NOT EXISTS idx_carga_periodo_estado ON "CargaArchivo"("Periodo", "Estado");
CREATE INDEX IF NOT EXISTS idx_carga_detalle_id ON "CargaDetalle"("IdCargaArchivo");
CREATE INDEX IF NOT EXISTS idx_data_codigo_producto ON "DataProcesada"("CodigoProducto");