const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a la base de datos SQLite
const dbPath = path.join(__dirname, 'sistema.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Error al conectar con SQLite:', err.message);
    else console.log(`Base de datos activa en: ${dbPath}`);
});

// ==========================================
// INICIALIZACIÓN DE LA BASE DE DATOS
// ==========================================
db.serialize(() => {
    // 1. Tabla Usuarios
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        rol TEXT NOT NULL,
        camionero_id INTEGER
    )`, () => {
        db.get(`SELECT COUNT(*) AS count FROM usuarios`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO usuarios (usuario, password, rol) VALUES ('admin', '1234', 'admin')`);
            }
        });
    });

    // 2. Tabla Camioneros
    db.run(`CREATE TABLE IF NOT EXISTS camioneros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        dni TEXT UNIQUE NOT NULL,
        telefono TEXT,
        disponible TEXT DEFAULT 'Disponible'
    )`, () => {
        db.get(`SELECT COUNT(*) AS count FROM camioneros`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO camioneros (nombre, apellido, dni, telefono, disponible) VALUES 
                    ('Juan', 'Pérez', '11111111', '11223344', 'Disponible'),
                    ('Pedro', 'Gómez', '22222222', '55667788', 'No disponible')`);
            }
        });
    });

    // 3. Tabla Viajes
    db.run(`CREATE TABLE IF NOT EXISTS viajes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dni_camionero TEXT,
        origen TEXT NOT NULL,
        destino TEXT NOT NULL,
        carga TEXT NOT NULL DEFAULT 'Carga General',
        fecha TEXT NOT NULL DEFAULT (date('now')),
        estado TEXT DEFAULT 'Pendiente'
    )`, () => {
        db.get(`SELECT COUNT(*) AS count FROM viajes`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO viajes (dni_camionero, origen, destino, carga, fecha, estado) VALUES 
                    ('11111111', 'Rosario', 'Córdoba', 'Granos de Soja (28Tn)', '2026-03-10', 'Completado'),
                    ('11111111', 'Santa Fe', 'Buenos Aires', 'Electrodomésticos', '2026-03-14', 'En Proceso'),
                    (NULL, 'Mendoza', 'Tucumán', 'Mercadería General', '2026-03-18', 'Pendiente')`);
            }
        });
    });

    // 4. Tabla Control de Turnos
    db.run(`CREATE TABLE IF NOT EXISTS control_turnos (
        id INTEGER PRIMARY KEY,
        turno_actual INTEGER DEFAULT 1
    )`, () => {
        db.get(`SELECT COUNT(*) AS count FROM control_turnos`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO control_turnos (id, turno_actual) VALUES (1, 1)`);
            }
        });
    });

    // 5. Tabla Historial de Cambios / Auditoría
    db.run(`CREATE TABLE IF NOT EXISTS historial_cambios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT,
        accion TEXT,
        detalle TEXT,
        fecha TEXT
    )`);
});

// ==========================================
// ENDPOINTS DE AUTENTICACIÓN
// ==========================================
app.post('/api/login', (req, res) => {
    const { usuario, password } = req.body;
    const userLimpio = usuario ? usuario.trim() : '';
    const passLimpia = password ? password.trim() : '';

    if (!userLimpio || !passLimpia) {
        return res.status(400).json({ error: 'Ingresa usuario y contraseña.' });
    }

    // 1. Verificar si es usuario administrador o registrado en tabla 'usuarios'
    db.get(`SELECT rowid AS id, usuario, rol, camionero_id FROM usuarios WHERE LOWER(usuario) = LOWER(?) AND password = ?`,
    [userLimpio, passLimpia], (err, user) => {
        if (user) {
            return res.json({ usuario: user.usuario, rol: user.rol, camionero_id: user.camionero_id });
        }

        // 2. Si no existe en usuarios, verificar en camioneros (Nombre + DNI)
        db.get(`SELECT rowid AS id, nombre, apellido, dni FROM camioneros WHERE LOWER(nombre) = LOWER(?) AND dni = ?`,
        [userLimpio, passLimpia], (errCam, camionero) => {
            if (errCam || !camionero) {
                return res.status(401).json({ error: 'Nombre o DNI incorrectos.' });
            }

            res.json({
                usuario: `${camionero.nombre} ${camionero.apellido}`,
                rol: 'camionero',
                camionero_id: camionero.id
            });
        });
    });
});

// ==========================================
// ENDPOINTS DE CAMIONEROS
// ==========================================

// Registrar camionero (CP-01)
app.post('/api/camioneros', (req, res) => {
    const { nombre, apellido, dni, telefono } = req.body;
    if (!nombre || !apellido || !dni || !telefono) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const sql = `INSERT INTO camioneros (dni, nombre, apellido, telefono, disponible) VALUES (?, ?, ?, ?, 'Disponible')`;
    db.run(sql, [dni, nombre, apellido, telefono], function(err) {
        if (err) return res.status(400).json({ error: 'El DNI ya se encuentra registrado.' });
        res.json({ mensaje: `Camionero ${nombre} ${apellido} registrado correctamente.` });
    });
});

// Buscar camionero por DNI (CP-02 / CP-03 / CP-04)
app.get('/api/camioneros/:dni', (req, res) => {
    db.get(`SELECT * FROM camioneros WHERE dni = ?`, [req.params.dni], (err, row) => {
        if (err || !row) return res.status(404).json({ error: 'Camionero no encontrado.' });
        res.json(row);
    });
});

// Modificar camionero (CP-03)
app.put('/api/camioneros/:dni', (req, res) => {
    const { dni } = req.params;
    const { nombre, apellido, telefono } = req.body;

    const sql = `UPDATE camioneros SET nombre = ?, apellido = ?, telefono = ? WHERE dni = ?`;
    db.run(sql, [nombre, apellido, telefono, dni], function(err) {
        if (err || this.changes === 0) return res.status(400).json({ error: 'No se pudo actualizar el camionero.' });

        const fecha = new Date().toISOString().replace('T', ' ').substring(0, 19);
        db.run(`INSERT INTO historial_cambios (usuario, accion, detalle, fecha) VALUES (?, ?, ?, ?)`,
            ['Admin', 'Modificar Camionero', `DNI ${dni}: Tel. nuevo ${telefono}`, fecha]
        );

        res.json({ mensaje: 'Datos del camionero actualizados correctamente.' });
    });
});

// Eliminar camionero (CP-04)
app.post('/api/camioneros/eliminar', (req, res) => {
    const { dni } = req.body;

    if (!dni) {
        return res.status(400).json({ error: 'DNI no proporcionado.' });
    }

    db.get(`SELECT * FROM camioneros WHERE dni = ?`, [dni], (err, row) => {
        if (err || !row) {
            return res.status(404).json({ error: 'Camionero no encontrado.' });
        }

        db.run(`DELETE FROM camioneros WHERE dni = ?`, [dni], function(err) {
            if (err) {
                return res.status(400).json({ error: 'No se pudo eliminar el camionero.' });
            }

            const fecha = new Date().toISOString().replace('T', ' ').substring(0, 19);
            db.run(`INSERT INTO historial_cambios (usuario, accion, detalle, fecha) VALUES (?, ?, ?, ?)`,
                ['Admin', 'Eliminar Camionero', `Eliminado DNI ${dni}: ${row.nombre} ${row.apellido}`, fecha]
            );

            return res.json({ mensaje: 'Camionero eliminado correctamente.' });
        });
    });
});

// Consultar disponibilidad propia (Panel Camionero - CU-21)
app.get('/api/camionero/:id/disponibilidad', (req, res) => {
    db.get(`SELECT rowid AS id, nombre, apellido, COALESCE(disponible, 'No disponible') AS disponible FROM camioneros WHERE rowid = ?`, [req.params.id], (err, camionero) => {
        if (err || !camionero) {
            return res.status(404).json({ error: 'Perfil de camionero no encontrado.' });
        }
        res.json(camionero);
    });
});

// Cambiar disponibilidad propia (Panel Camionero - CU-21 / CP-08)
app.put('/api/camionero/:id/disponibilidad', (req, res) => {
    const { nuevoEstado } = req.body;

    if (!['Disponible', 'No disponible'].includes(nuevoEstado)) {
        return res.status(400).json({ error: 'Estado inválido.' });
    }

    db.run(`UPDATE camioneros SET disponible = ? WHERE rowid = ?`, [nuevoEstado, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: 'Error al actualizar disponibilidad.' });
        res.json({ mensaje: `Tu estado se ha actualizado a: ${nuevoEstado}`, nuevoEstado });
    });
});

// ==========================================
// ENDPOINTS DE ASIGNACIÓN Y DISPONIBILIDAD
// ==========================================

// Obtener listas de opciones para asignación (CP-07)
app.get('/api/disponibilidad/opciones', (req, res) => {
    const qCamioneros = `SELECT rowid AS id, dni, nombre, apellido, COALESCE(disponible, 'Disponible') AS disponible FROM camioneros`;
    const qViajes = `SELECT rowid AS id, origen, destino FROM viajes WHERE estado = 'Pendiente' OR dni_camionero IS NULL`;

    db.all(qCamioneros, [], (errCam, camioneros = []) => {
        if (errCam) return res.status(500).json({ error: 'Error al consultar camioneros: ' + errCam.message });

        db.all(qViajes, [], (errVia, viajes = []) => {
            if (errVia) return res.status(500).json({ error: 'Error al consultar viajes: ' + errVia.message });

            res.json({ camioneros, viajes });
        });
    });
});

// Asignar viaje con validación estricta de disponibilidad (CU-23 / CP-07)
app.post('/api/viajes/asignar', (req, res) => {
    const { viajeId, camioneroId } = req.body;

    if (!viajeId || !camioneroId) {
        return res.status(400).json({ error: 'Debes seleccionar un viaje y un camionero.' });
    }

    db.get(`SELECT rowid AS id, dni, nombre, apellido, COALESCE(disponible, 'Disponible') AS disponible FROM camioneros WHERE rowid = ?`, [camioneroId], (err, camionero) => {
        if (err || !camionero) {
            return res.status(404).json({ error: 'Camionero no encontrado en la base de datos.' });
        }

        if (camionero.disponible !== 'Disponible' && camionero.disponible !== '1') {
            return res.status(400).json({ 
                error: `Asignación RECHAZADA: El camionero ${camionero.nombre} ${camionero.apellido} se encuentra NO DISPONIBLE.` 
            });
        }

        db.run(`UPDATE viajes SET dni_camionero = ?, estado = 'Asignado' WHERE rowid = ?`, 
        [camionero.dni, viajeId], function(err) {
            if (err) return res.status(500).json({ error: 'Error al asignar el viaje.' });

            res.json({ mensaje: `Viaje asignado con ÉXITO a ${camionero.nombre} ${camionero.apellido}.` });
        });
    });
});

// ==========================================
// ENDPOINTS DE HISTORIAL E INFORMES
// ==========================================

// Consultar Historial de Viajes por DNI (CP-02)
app.get('/api/historial/:dni', (req, res) => {
    const { dni } = req.params;

    db.all(`SELECT * FROM viajes WHERE dni_camionero = ? ORDER BY id DESC`, [dni], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Error al consultar la base de datos.' });
        }
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: 'No se encontraron viajes para el DNI ingresado.' });
        }
        res.json(rows);
    });
});

// Generar Informe Completo por Conductor (CP-05)
app.get('/api/informes/conductor/:dni', (req, res) => {
    const { dni } = req.params;

    db.get(`SELECT * FROM camioneros WHERE dni = ?`, [dni], (err, camionero) => {
        if (err) return res.status(500).json({ error: 'Error al consultar el conductor.' });
        if (!camionero) return res.status(404).json({ error: 'No se encontró ningún conductor registrado con ese DNI.' });

        db.all(`SELECT * FROM viajes WHERE dni_camionero = ? ORDER BY id DESC`, [dni], (err, viajes) => {
            if (err) return res.status(500).json({ error: 'Error al obtener viajes del conductor.' });

            res.json({
                conductor: `${camionero.nombre} ${camionero.apellido}`,
                dni: camionero.dni,
                viajes: viajes || []
            });
        });
    });
});

// Generar Informe Resumen General (CP-05)
app.get('/api/informes/resumen', (req, res) => {
    const qTotalCamioneros = `SELECT COUNT(*) AS total FROM camioneros`;
    const qActivos = `SELECT COUNT(*) AS total FROM camioneros WHERE disponible = 'Disponible' OR disponible = '1'`;
    const qTotalViajes = `SELECT COUNT(*) AS total FROM viajes`;

    db.get(qTotalCamioneros, [], (err, rowTotalCam) => {
        if (err) return res.status(500).json({ error: 'Error al consultar total de camioneros.' });

        db.get(qActivos, [], (err, rowActivos) => {
            if (err) return res.status(500).json({ error: 'Error al consultar disponibilidad.' });

            db.get(qTotalViajes, [], (err, rowViajes) => {
                if (err) return res.status(500).json({ error: 'Error al consultar total de viajes.' });

                res.json({
                    totalCamioneros: rowTotalCam ? rowTotalCam.total : 0,
                    camionerosActivos: rowActivos ? rowActivos.total : 0,
                    totalViajes: rowViajes ? rowViajes.total : 0
                });
            });
        });
    });
});

// ==========================================
// ENDPOINTS DE CONTROL DE TURNOS
// ==========================================

// Consultar el turno actual (CU-18)
app.get('/api/turnos/actual', (req, res) => {
    db.get(`SELECT turno_actual FROM control_turnos WHERE id = 1`, [], (err, row) => {
        if (err) return res.status(500).json({ error: 'Error al consultar el turno actual.' });
        res.json({ turnoActual: row ? row.turno_actual : 1 });
    });
});

// Saltar turno con límite estricto en 49 (CP-06 / CU-18)
app.post('/api/turnos/saltar', (req, res) => {
    const LIMITE_MAXIMO = 49;

    db.get(`SELECT turno_actual FROM control_turnos WHERE id = 1`, [], (err, rowTurno) => {
        if (err) return res.status(500).json({ error: 'Error al consultar turno.' });

        const turnoActual = rowTurno ? rowTurno.turno_actual : 1;
        const nuevoTurno = (turnoActual >= LIMITE_MAXIMO) ? 1 : turnoActual + 1;

        db.run(`UPDATE control_turnos SET turno_actual = ? WHERE id = 1`, [nuevoTurno], function(err) {
            if (err) return res.status(500).json({ error: 'No se pudo actualizar el turno.' });

            const fecha = new Date().toISOString().replace('T', ' ').substring(0, 19);
            db.run(`INSERT INTO historial_cambios (usuario, accion, detalle, fecha) VALUES (?, ?, ?, ?)`,
                ['Admin', 'Saltar Turno', `Turno avanzado a N° ${nuevoTurno} de 49`, fecha]
            );

            res.json({
                mensaje: `Turno actualizado correctamente.`,
                nuevoTurno: nuevoTurno
            });
        });
    });
});

// Arranque del servidor
app.listen(3000, () => console.log('Servidor backend corriendo en http://localhost:3000'));
