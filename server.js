const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a SQLite
const dbPath = path.join(__dirname, 'sistema.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Error al conectar SQLite:', err.message);
    else console.log(`Base de datos activa en: ${dbPath}`);
});

// ==========================================
// INICIALIZACIÓN DE TABLAS
// ==========================================
db.serialize(() => {
    // 1. Usuarios (Admin)
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        rol TEXT NOT NULL
    )`, () => {
        db.get(`SELECT COUNT(*) AS count FROM usuarios`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO usuarios (usuario, password, rol) VALUES ('admin', '1234', 'admin')`);
            }
        });
    });

    // 2. Choferes
    db.run(`CREATE TABLE IF NOT EXISTS camioneros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        dni TEXT UNIQUE NOT NULL,
        telefono TEXT NOT NULL,
        camion_patente TEXT DEFAULT 'AA 100 BB',
        disponible TEXT DEFAULT 'Disponible'
    )`, () => {
        db.get(`SELECT COUNT(*) AS count FROM camioneros`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO camioneros (nombre, apellido, dni, telefono, camion_patente, disponible) VALUES 
                    ('Juan', 'Pérez', '12345678', '5493496112233', 'AA 100 BB', 'Disponible'),
                    ('Pedro', 'Gómez', '22222222', '5493496445566', 'CC 200 DD', 'Disponible'),
                    ('Carlos', 'López', '33333333', '5493496778899', 'EE 300 FF', 'Disponible')`);
            }
        });
    });

    // 3. Tipos de Carga
    db.run(`CREATE TABLE IF NOT EXISTS tipos_carga (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT UNIQUE NOT NULL
    )`, () => {
        db.get(`SELECT COUNT(*) AS count FROM tipos_carga`, (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO tipos_carga (nombre) VALUES ('Soja'), ('Maíz'), ('Trigo'), ('Girasol'), ('Flete General')`);
            }
        });
    });

    // 4. Viajes
    db.run(`CREATE TABLE IF NOT EXISTS viajes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dni_camionero TEXT,
        nombre_chofer TEXT,
        camion_patente TEXT,
        origen TEXT NOT NULL,
        destino TEXT NOT NULL,
        carga TEXT NOT NULL,
        fecha TEXT NOT NULL,
        estado TEXT DEFAULT 'Pendiente',
        motivo_cancelacion TEXT
    )`);

    // 5. Control de Turnos
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

    // 6. Auditoría
    db.run(`CREATE TABLE IF NOT EXISTS historial_cambios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT,
        accion TEXT,
        detalle TEXT,
        motivo TEXT,
        fecha TEXT
    )`);
});

function registrarHistorial(usuario, accion, detalle, motivo = '') {
    const fechaHora = new Date().toISOString().replace('T', ' ').substring(0, 19);
    db.run(`INSERT INTO historial_cambios (usuario, accion, detalle, motivo, fecha) VALUES (?, ?, ?, ?, ?)`,
        [usuario || 'Sistema', accion, detalle, motivo, fechaHora]
    );
}

// Avanzar turno en ciclo exacto (1 -> 2 -> ... -> N -> 1)
function avanzarTurnoCiclico(callback) {
    db.all(`SELECT * FROM camioneros ORDER BY id ASC`, [], (err, choferes) => {
        const list = choferes || [];
        const total = list.length > 0 ? list.length : 1;

        db.get(`SELECT turno_actual FROM control_turnos WHERE id = 1`, [], (err, row) => {
            let rawTurno = row ? row.turno_actual : 1;
            
            // Mapeo cíclico
            let turnoNormalizado = ((rawTurno - 1) % total) + 1;
            let nuevoTurno = (turnoNormalizado >= total) ? 1 : turnoNormalizado + 1;

            db.run(`UPDATE control_turnos SET turno_actual = ? WHERE id = 1`, [nuevoTurno], () => {
                if (callback) callback(nuevoTurno);
            });
        });
    });
}

// ==========================================
// ENDPOINTS DE LA API
// ==========================================

// Login
app.post('/api/login', (req, res) => {
    const { usuario, password } = req.body;
    const userLimpio = usuario ? usuario.trim().toLowerCase() : '';
    const passLimpia = password ? password.trim() : '';

    db.get(`SELECT id, usuario, rol FROM usuarios WHERE LOWER(TRIM(usuario)) = ? AND TRIM(password) = ?`,
    [userLimpio, passLimpia], (err, user) => {
        if (user) return res.json({ usuario: user.usuario, rol: user.rol });

        db.get(`SELECT id, nombre, apellido, dni FROM camioneros WHERE (LOWER(TRIM(nombre)) = ? OR LOWER(TRIM(nombre || ' ' || apellido)) = ?) AND TRIM(dni) = ?`,
        [userLimpio, userLimpio, passLimpia], (errCam, camionero) => {
            if (errCam || !camionero) {
                return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
            }

            res.json({
                usuario: `${camionero.nombre} ${camionero.apellido}`,
                rol: 'camionero',
                camionero_id: camionero.id,
                dni: camionero.dni
            });
        });
    });
});

// Obtención del Siguiente Turno Cíclico
app.get('/api/turnos/siguiente', (req, res) => {
    db.all(`SELECT * FROM camioneros ORDER BY id ASC`, [], (err, choferes) => {
        const list = choferes || [];
        const totalChoferes = list.length;

        if (totalChoferes === 0) {
            return res.json({ turnoActual: 1, totalChoferes: 0, choferSugerido: null });
        }

        db.get(`SELECT turno_actual FROM control_turnos WHERE id = 1`, [], (err, row) => {
            let rawTurno = row ? row.turno_actual : 1;

            // Módulo cíclico estricto
            let turnoActual = ((rawTurno - 1) % totalChoferes) + 1;

            // Si el valor guardado en BD estaba desfasado (ej: 10 u 11), lo corrige en la BD
            if (rawTurno !== turnoActual) {
                db.run(`UPDATE control_turnos SET turno_actual = ? WHERE id = 1`, [turnoActual]);
            }

            const choferSugerido = list[turnoActual - 1] || list[0];

            res.json({
                turnoActual: turnoActual,
                totalChoferes: totalChoferes,
                choferSugerido: choferSugerido
            });
        });
    });
});

// Saltar Turno
app.post('/api/turnos/saltar', (req, res) => {
    const { usuario, motivo } = req.body;
    avanzarTurnoCiclico((nuevoTurno) => {
        registrarHistorial(usuario || 'Admin', 'Salto de Turno', `Avanzó manualmente al turno #${nuevoTurno}`, motivo || 'Excepción');
        res.json({ mensaje: `Se avanzó al turno #${nuevoTurno}` });
    });
});

// Portal Chofer
app.get('/api/camionero/:id/disponibilidad', (req, res) => {
    db.get(`SELECT id, nombre, apellido, dni, camion_patente, COALESCE(disponible, 'Disponible') AS disponible FROM camioneros WHERE id = ?`, 
    [req.params.id], (err, camionero) => {
        if (err || !camionero) return res.status(404).json({ error: 'Chofer no encontrado.' });

        db.get(`SELECT turno_actual FROM control_turnos WHERE id = 1`, [], (err, rowTurno) => {
            db.all(`SELECT * FROM camioneros ORDER BY id ASC`, [], (err, choferes) => {
                const list = choferes || [];
                const total = list.length > 0 ? list.length : 1;
                let rawTurno = rowTurno ? rowTurno.turno_actual : 1;

                let turnoActual = ((rawTurno - 1) % total) + 1;

                const miIndiceTurno = list.findIndex(c => c.id === camionero.id);
                const miOrdenTurno = miIndiceTurno !== -1 ? miIndiceTurno + 1 : 1;

                const choferEnTurnoObj = list[turnoActual - 1] || list[0];
                const choferEnTurno = choferEnTurnoObj ? `${choferEnTurnoObj.nombre} ${choferEnTurnoObj.apellido}` : 'Sin asignación';

                res.json({
                    ...camionero,
                    orden_turno: miOrdenTurno,
                    turno_actual_sistema: turnoActual,
                    total_choferes: total,
                    chofer_en_turno: choferEnTurno
                });
            });
        });
    });
});

app.put('/api/camionero/:id/disponibilidad', (req, res) => {
    const { nuevoEstado } = req.body;
    db.run(`UPDATE camioneros SET disponible = ? WHERE id = ?`, [nuevoEstado, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: 'Error al cambiar estado.' });
        
        registrarHistorial(`Chofer ID ${req.params.id}`, 'Cambio Disponibilidad', `Estado: ${nuevoEstado}`);
        res.json({ mensaje: `Tu estado ahora es: ${nuevoEstado}` });
    });
});

// Choferes (CRUD)
app.get('/api/camioneros', (req, res) => {
    db.all(`SELECT * FROM camioneros ORDER BY id ASC`, [], (err, rows) => {
        res.json(rows || []);
    });
});

app.post('/api/camioneros', (req, res) => {
    const { nombre, apellido, dni, telefono, camion_patente } = req.body;
    if (!nombre || !apellido || !dni || !telefono) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    db.run(`INSERT INTO camioneros (dni, nombre, apellido, telefono, camion_patente, disponible) VALUES (?, ?, ?, ?, ?, 'Disponible')`,
    [dni.trim(), nombre.trim(), apellido.trim(), telefono.trim(), camion_patente || 'Sin Asignar'], function(err) {
        if (err) return res.status(400).json({ error: 'El DNI ya está registrado.' });
        
        registrarHistorial('Admin', 'Alta Chofer', `${nombre} ${apellido} (DNI: ${dni})`);
        res.json({ mensaje: 'Chofer registrado correctamente.' });
    });
});

app.put('/api/camioneros/:id', (req, res) => {
    const { nombre, apellido, dni, telefono, camion_patente, disponible } = req.body;
    db.run(`UPDATE camioneros SET nombre = ?, apellido = ?, dni = ?, telefono = ?, camion_patente = ?, disponible = ? WHERE id = ?`,
    [nombre, apellido, dni, telefono, camion_patente, disponible, req.params.id], function(err) {
        if (err) return res.status(400).json({ error: 'Error al actualizar.' });
        
        registrarHistorial('Admin', 'Modificación Chofer', `Actualizado Chofer ID ${req.params.id}`);
        res.json({ mensaje: 'Chofer actualizado.' });
    });
});

app.delete('/api/camioneros/:id', (req, res) => {
    db.run(`DELETE FROM camioneros WHERE id = ?`, [req.params.id], function(err) {
        if (err) return res.status(400).json({ error: 'Error al eliminar.' });
        
        registrarHistorial('Admin', 'Eliminación Chofer', `Eliminado Chofer ID ${req.params.id}`);
        res.json({ mensaje: 'Chofer eliminado.' });
    });
});

// Tipos de Carga
app.get('/api/cargas', (req, res) => {
    db.all(`SELECT * FROM tipos_carga ORDER BY nombre ASC`, [], (err, rows) => {
        res.json(rows || []);
    });
});

app.post('/api/cargas', (req, res) => {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: 'Nombre obligatorio.' });

    db.run(`INSERT INTO tipos_carga (nombre) VALUES (?)`, [nombre.trim()], function(err) {
        if (err) return res.status(400).json({ error: 'El tipo de carga ya existe.' });
        
        registrarHistorial('Admin', 'Alta Carga', `Nueva carga: ${nombre}`);
        res.json({ mensaje: 'Tipo de carga registrado.' });
    });
});

app.delete('/api/cargas/:id', (req, res) => {
    db.run(`DELETE FROM tipos_carga WHERE id = ?`, [req.params.id], function(err) {
        registrarHistorial('Admin', 'Baja Carga', `Eliminada Carga ID ${req.params.id}`);
        res.json({ mensaje: 'Tipo de carga eliminado.' });
    });
});

// Viajes
app.get('/api/viajes', (req, res) => {
    db.all(`SELECT * FROM viajes ORDER BY id DESC`, [], (err, rows) => {
        res.json(rows || []);
    });
});

app.post('/api/viajes', (req, res) => {
    const { dni_camionero, origen, destino, carga, fecha } = req.body;
    if (!origen || !destino || !carga) {
        return res.status(400).json({ error: 'Origen, Destino y Carga son obligatorios.' });
    }

    const fechaViaje = fecha || new Date().toISOString().substring(0, 10);

    db.get(`SELECT nombre, apellido, camion_patente FROM camioneros WHERE dni = ?`, [dni_camionero], (err, chofer) => {
        const nombreCompleto = chofer ? `${chofer.nombre} ${chofer.apellido}` : 'Sin Asignar';
        const patente = chofer ? chofer.camion_patente : 'Sin Asignar';
        const estado = dni_camionero ? 'Asignado' : 'Pendiente';

        db.run(`INSERT INTO viajes (dni_camionero, nombre_chofer, camion_patente, origen, destino, carga, fecha, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [dni_camionero || null, nombreCompleto, patente, origen, destino, carga, fechaViaje, estado], function(err) {
            if (err) return res.status(500).json({ error: 'Error al registrar el viaje.' });

            if (dni_camionero) {
                avanzarTurnoCiclico();
            }

            registrarHistorial('Admin', 'Creación de Viaje', `Viaje N° ${this.lastID} (${origen} ➔ ${destino}) asignado a ${nombreCompleto}`);
            res.json({ mensaje: 'Viaje asignado con éxito.', viajeId: this.lastID });
        });
    });
});

app.put('/api/viajes/:id/estado', (req, res) => {
    const { estado, motivo, usuario } = req.body;
    const viajeId = req.params.id;

    if (!estado) {
        return res.status(400).json({ error: 'El estado es obligatorio.' });
    }

    db.run(
        `UPDATE viajes SET estado = ?, motivo_cancelacion = COALESCE(?, motivo_cancelacion) WHERE id = ?`,
        [estado, motivo || null, viajeId],
        function (err) {
            if (err) return res.status(500).json({ error: 'Error al actualizar el estado del viaje.' });

            registrarHistorial(
                usuario || 'Chofer',
                `Viaje ${estado}`,
                `Viaje N° ${viajeId} marcado como ${estado}`,
                motivo || ''
            );

            res.json({ mensaje: `Viaje N° ${viajeId} actualizado a ${estado}.` });
        }
    );
});

app.post('/api/viajes/cancelar', (req, res) => {
    const { viajeId, motivo, usuario } = req.body;
    if (!viajeId || !motivo) {
        return res.status(400).json({ error: 'El ID y el motivo son obligatorios.' });
    }

    db.run(`UPDATE viajes SET estado = 'Cancelado', motivo_cancelacion = ? WHERE id = ?`, [motivo, viajeId], function(err) {
        if (err) return res.status(500).json({ error: 'Error al cancelar.' });

        registrarHistorial(usuario || 'Admin', 'Cancelación de Viaje', `Viaje N° ${viajeId} cancelado.`, motivo);
        res.json({ mensaje: 'Viaje cancelado y registrado en auditoría.' });
    });
});

// Reportes Filtrados por Fecha, Chofer y Tipo de Carga
app.get('/api/reportes/filtrado', (req, res) => {
    const { fechaInicio, fechaFin, dni_camionero, carga } = req.query;
    let query = `SELECT * FROM viajes WHERE 1=1`;
    let params = [];

    if (fechaInicio && fechaFin) {
        query += ` AND fecha BETWEEN ? AND ?`;
        params.push(fechaInicio, fechaFin);
    }
    if (dni_camionero) {
        query += ` AND dni_camionero = ?`;
        params.push(dni_camionero);
    }
    if (carga) {
        query += ` AND carga = ?`;
        params.push(carga);
    }

    query += ` ORDER BY id DESC`;

    db.all(query, params, (err, rows) => {
        res.json(rows || []);
    });
});

app.get('/api/historial/:dni', (req, res) => {
    db.all(`SELECT * FROM viajes WHERE dni_camionero = ? ORDER BY id DESC`, [req.params.dni], (err, rows) => {
        res.json(rows || []);
    });
});

app.get('/api/trazabilidad', (req, res) => {
    db.all(`SELECT * FROM historial_cambios ORDER BY id DESC LIMIT 50`, [], (err, rows) => {
        res.json(rows || []);
    });
});

app.listen(3000, () => console.log('Servidor backend activo en http://localhost:3000'));
