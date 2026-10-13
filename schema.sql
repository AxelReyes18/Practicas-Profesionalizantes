-- ===================================================
-- ESTRUCTURA DE LA BASE DE DATOS: SISTEMA LOGÍSTICO
-- Motor: SQLite3
-- ===================================================

-- 1. Tabla de Usuarios Administradores
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    rol TEXT NOT NULL
);

-- 2. Tabla de Camioneros / Choferes
CREATE TABLE IF NOT EXISTS camioneros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    dni TEXT UNIQUE NOT NULL,
    telefono TEXT NOT NULL,
    camion_patente TEXT DEFAULT 'AA 100 BB',
    disponible TEXT DEFAULT 'Disponible'
);

-- 3. Tabla de Tipos de Carga
CREATE TABLE IF NOT EXISTS tipos_carga (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT UNIQUE NOT NULL
);

-- 4. Tabla de Viajes y Fletes Asignados
CREATE TABLE IF NOT EXISTS viajes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dni_camionero TEXT,
    nombre_chofer TEXT,
    camion_patente TEXT,
    origen TEXT NOT NULL,
    destino TEXT NOT NULL,
    carga TEXT NOT NULL,
    fecha TEXT NOT NULL,
    estado TEXT DEFAULT 'Pendiente',
    motivo_cancelacion TEXT,
    FOREIGN KEY (dni_camionero) REFERENCES camioneros(dni)
);

-- 5. Tabla de Control Cíclico de Turnos
CREATE TABLE IF NOT EXISTS control_turnos (
    id INTEGER PRIMARY KEY,
    turno_actual INTEGER DEFAULT 1
);

-- 6. Tabla de Auditoría y Trazabilidad de Eventos
CREATE TABLE IF NOT EXISTS historial_cambios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT,
    accion TEXT,
    detalle TEXT,
    motivo TEXT,
    fecha TEXT
);

-- ===================================================
-- DATOS SEMILLA (INSERCIÓN INICIAL DE PRUEBA)
-- ===================================================

-- Usuario Administrador por Defecto
INSERT OR IGNORE INTO usuarios (usuario, password, rol) 
VALUES ('admin', '1234', 'admin');

-- Choferes Iniciales
INSERT OR IGNORE INTO camioneros (nombre, apellido, dni, telefono, camion_patente, disponible) VALUES 
    ('Juan', 'Pérez', '12345678', '5493496112233', 'AA 100 BB', 'Disponible'),
    ('Pedro', 'Gómez', '22222222', '5493496445566', 'CC 200 DD', 'Disponible'),
    ('Carlos', 'López', '33333333', '5493496778899', 'EE 300 FF', 'Disponible');

-- Tipos de Carga Estándar
INSERT OR IGNORE INTO tipos_carga (nombre) VALUES 
    ('Soja'), 
    ('Maíz'), 
    ('Trigo'), 
    ('Girasol'), 
    ('Flete General');

-- Puntero Inicial de Turnero Cíclico
INSERT OR IGNORE INTO control_turnos (id, turno_actual) 
VALUES (1, 1);
