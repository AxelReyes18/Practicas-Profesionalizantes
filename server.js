const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Conexión/creación automática del archivo de base de datos
const db = new sqlite3.Database('./sistema.db', (err) => {
    if (err) console.error('Error al conectar SQLite:', err.message);
    else console.log('Base de datos SQLite lista.');
});

// Creación de tablas
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS camioneros (
        dni TEXT PRIMARY KEY,
        usuario TEXT,
        contrasena TEXT,
        direccion TEXT,
        telefono TEXT
    )`);
});

// Guardar camionero
app.post('/api/camioneros', (req, res) => {
    const { dni, usuarioCamionero, contraseñaCamionero, direccion, telefono } = req.body;
    const sql = `INSERT INTO camioneros (dni, usuario, contrasena, direccion, telefono) VALUES (?, ?, ?, ?, ?)`;
    
    db.run(sql, [dni, usuarioCamionero, contraseñaCamionero, direccion, telefono], function(err) {
        if (err) return res.status(400).json({ error: 'El DNI ya se encuentra registrado o faltan datos.' });
        res.json({ mensaje: 'Camionero guardado en SQLite con éxito.' });
    });
});

// Buscar camionero por DNI
app.get('/api/camioneros/:dni', (req, res) => {
    const sql = `SELECT * FROM camioneros WHERE dni = ?`;
    db.get(sql, [req.params.dni], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Camionero no encontrado.' });
        res.json(row);
    });
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
