const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('./sistema.db', (err) => {
    if (err) console.error('Error al conectar con SQLite:', err.message);
    else console.log('Base de datos SQLite lista.');
});

// Creación de la estructura de tablas
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS camioneros (
        dni TEXT PRIMARY KEY,
        usuario TEXT,
        contrasena TEXT,
        direccion TEXT,
        telefono TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS viajes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        origen TEXT,
        destino TEXT,
        fecha TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS camiones (
        patente TEXT PRIMARY KEY,
        marca TEXT,
        modelo TEXT,
        capacidad REAL,
        dni_camionero TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS cargas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        descripcion TEXT
    )`);
});

// --- CAMIONEROS ---
app.post('/api/camioneros', (req, res) => {
    const { dni, usuarioCamionero, contraseñaCamionero, direccion, telefono } = req.body;
    const sql = `INSERT INTO camioneros (dni, usuario, contrasena, direccion, telefono) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [dni, usuarioCamionero, contraseñaCamionero, direccion, telefono], (err) => {
        if (err) return res.status(400).json({ error: 'El DNI ya se encuentra registrado.' });
        res.json({ mensaje: 'Camionero registrado exitosamente.' });
    });
});

app.get('/api/camioneros/:dni', (req, res) => {
    db.get(`SELECT * FROM camioneros WHERE dni = ?`, [req.params.dni], (err, row) => {
        if (err || !row) return res.status(404).json({ error: 'Camionero no encontrado.' });
        res.json(row);
    });
});

app.put('/api/camioneros/:dni', (req, res) => {
    const { usuario, contrasena, direccion, telefono } = req.body;
    const sql = `UPDATE camioneros SET usuario = ?, contrasena = ?, direccion = ?, telefono = ? WHERE dni = ?`;
    db.run(sql, [usuario, contrasena, direccion, telefono, req.params.dni], function(err) {
        if (err) return res.status(400).json({ error: 'Error al actualizar camionero.' });
        res.json({ mensaje: 'Datos del camionero actualizados correctamente.' });
    });
});

app.delete('/api/camioneros/:dni', (req, res) => {
    db.run(`DELETE FROM camioneros WHERE dni = ?`, [req.params.dni], function(err) {
        if (err) return res.status(400).json({ error: 'Error al eliminar el camionero.' });
        res.json({ mensaje: 'Camionero eliminado correctamente.' });
    });
});

// --- VIAJES ---
app.post('/api/viajes', (req, res) => {
    const { origen, destino, fecha } = req.body;
    const sql = `INSERT INTO viajes (origen, destino, fecha) VALUES (?, ?, ?)`;
    db.run(sql, [origen, destino, fecha], function(err) {
        if (err) return res.status(400).json({ error: 'Error al registrar el viaje.' });
        res.json({ mensaje: `Viaje registrado con ID #${this.lastID}.` });
    });
});

app.get('/api/viajes/:id', (req, res) => {
    db.get(`SELECT * FROM viajes WHERE id = ?`, [req.params.id], (err, row) => {
        if (err || !row) return res.status(404).json({ error: 'Viaje no encontrado.' });
        res.json(row);
    });
});

app.put('/api/viajes/:id', (req, res) => {
    const { origen, destino, fecha } = req.body;
    const sql = `UPDATE viajes SET origen = ?, destino = ?, fecha = ? WHERE id = ?`;
    db.run(sql, [origen, destino, fecha, req.params.id], function(err) {
        if (err) return res.status(400).json({ error: 'Error al actualizar el viaje.' });
        res.json({ mensaje: 'Viaje modificado correctamente.' });
    });
});

app.delete('/api/viajes/:id', (req, res) => {
    db.run(`DELETE FROM viajes WHERE id = ?`, [req.params.id], function(err) {
        if (err) return res.status(400).json({ error: 'Error al eliminar el viaje.' });
        res.json({ mensaje: 'Viaje eliminado correctamente.' });
    });
});

// --- CAMIONES ---
app.post('/api/camiones', (req, res) => {
    const { patente, marca, modelo, capacidad, dniCamionero } = req.body;
    const sql = `INSERT INTO camiones (patente, marca, modelo, capacidad, dni_camionero) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [patente, marca, modelo, capacidad, dniCamionero], (err) => {
        if (err) return res.status(400).json({ error: 'La patente ya existe.' });
        res.json({ mensaje: 'Camión registrado exitosamente.' });
    });
});

app.get('/api/camiones/:patente', (req, res) => {
    db.get(`SELECT * FROM camiones WHERE patente = ?`, [req.params.patente], (err, row) => {
        if (err || !row) return res.status(404).json({ error: 'Camión no encontrado.' });
        res.json(row);
    });
});

app.put('/api/camiones/:patente', (req, res) => {
    const { marca, modelo, capacidad, dniCamionero } = req.body;
    const sql = `UPDATE camiones SET marca = ?, modelo = ?, capacidad = ?, dni_camionero = ? WHERE patente = ?`;
    db.run(sql, [marca, modelo, capacidad, dniCamionero, req.params.patente], function(err) {
        if (err) return res.status(400).json({ error: 'Error al actualizar el camión.' });
        res.json({ mensaje: 'Datos del camión actualizados correctamente.' });
    });
});

app.delete('/api/camiones/:patente', (req, res) => {
    db.run(`DELETE FROM camiones WHERE patente = ?`, [req.params.patente], function(err) {
        if (err) return res.status(400).json({ error: 'Error al eliminar el camión.' });
        res.json({ mensaje: 'Camión eliminado correctamente.' });
    });
});

// --- CARGAS ---
app.post('/api/cargas', (req, res) => {
    const { nombreCarga, descripcionCarga } = req.body;
    const sql = `INSERT INTO cargas (nombre, descripcion) VALUES (?, ?)`;
    db.run(sql, [nombreCarga, descripcionCarga], function(err) {
        if (err) return res.status(400).json({ error: 'Error al registrar tipo de carga.' });
        res.json({ mensaje: `Tipo de carga registrado con ID #${this.lastID}.` });
    });
});

app.get('/api/cargas/:id', (req, res) => {
    db.get(`SELECT * FROM cargas WHERE id = ?`, [req.params.id], (err, row) => {
        if (err || !row) return res.status(404).json({ error: 'Tipo de carga no encontrado.' });
        res.json(row);
    });
});

app.put('/api/cargas/:id', (req, res) => {
    const { nombre, descripcion } = req.body;
    const sql = `UPDATE cargas SET nombre = ?, descripcion = ? WHERE id = ?`;
    db.run(sql, [nombre, descripcion, req.params.id], function(err) {
        if (err) return res.status(400).json({ error: 'Error al actualizar tipo de carga.' });
        res.json({ mensaje: 'Tipo de carga actualizado correctamente.' });
    });
});

app.delete('/api/cargas/:id', (req, res) => {
    db.run(`DELETE FROM cargas WHERE id = ?`, [req.params.id], function(err) {
        if (err) return res.status(400).json({ error: 'Error al eliminar el tipo de carga.' });
        res.json({ mensaje: 'Tipo de carga eliminado correctamente.' });
    });
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
