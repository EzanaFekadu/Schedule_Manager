const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();
const db = new sqlite3.Database('./db/database.db');

// Create User
router.post('/users', (req, res) => {
    const { username, password, email } = req.body;
    db.run(`INSERT INTO users (username, password, email) VALUES (?, ?, ?)`, [username, password, email], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
});

// Read Users
router.get('/users', (req, res) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Update User
router.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { username, password, email } = req.body;
    db.run(`UPDATE users SET username = ?, password = ?, email = ? WHERE id = ?`, [username, password, email, id], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ updatedID: id });
    });
});

// Delete User
router.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM users WHERE id = ?`, id, function(err) {
        if ( err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ deletedID: id });
    });
});

// Implement other CRUD operations as needed
// Example: Create, Read, Update, Delete Posts
// ...

module.exports = router;