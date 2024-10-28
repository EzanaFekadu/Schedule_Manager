const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./mydb.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1); // Exit if database connection fails
    } else {
        console.log('Connected to SQLite database');
        createTables(); // Create tables if they don't exist
    }
});

// Create tables if they don't exist
function createTables() {
    db.run(`CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        project_id INTEGER,
        amount REAL,
        status TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id),
        FOREIGN KEY (project_id) REFERENCES Projects(id)
    )`);
}

// CRUD operations for Users
app.post('/api/users', (req, res) => {
    const { username, password, email } = req.body;
    db.run('INSERT INTO Users (username, password, email) VALUES (?, ?, ?)', [username, password, email], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

app.get('/api/users', (req, res) => {
    db.all('SELECT * FROM Users', [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ data: rows });
    });
});

app.put('/api/users/:id', (req, res) => {
    const { username, password, email } = req.body;
    const { id } = req.params;
    db.run('UPDATE Users SET username = ?, password = ?, email = ? WHERE id = ?', [username, password, email, id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ changes: this.changes });
    });
});

app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM Users WHERE id = ?', id, function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

// CRUD operations for Projects
app.post('/api/projects', (req, res) => {
    const { user_id, title, description, status } = req.body;
    db.run('INSERT INTO Projects (user_id, title, description, status) VALUES (?, ?, ?, ?)', 
        [user_id, title, description, status], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

app.get('/api/projects', (req, res) => {
    db.all('SELECT * FROM Projects', [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ data: rows });
    });
});

app.put('/api/projects/:id', (req, res) => {
    const { user_id, title, description, status } = req.body;
    const { id } = req.params;
    db.run('UPDATE Projects SET user_id = ?, title = ?, description = ?, status = ? WHERE id = ?', 
        [user_id, title, description, status, id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ changes: this.changes });
    });
});

app.delete('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM Projects WHERE id = ?', id, function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

// CRUD operations for Invoices
app.post('/api/invoices', (req, res) => {
    const { user_id, project_id, amount, status } = req.body;
    db.run('INSERT INTO Invoices (user_id, project_id, amount, status) VALUES (?, ?, ?, ?)', 
        [user_id, project_id, amount, status], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

app.get('/api/invoices', (req, res) => {
    db.all('SELECT * FROM Invoices', [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ data: rows });
    });
});

app.put('/api/invoices/:id', (req, res) => {
    const { user_id, project_id, amount, status } = req.body;
    const { id } = req.params;
    db.run('UPDATE Invoices SET user_id = ?, project_id = ?, amount = ?, status = ? WHERE id = ?', 
        [user_id, project_id, amount, status, id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ changes: this.changes });
    });
});

app.delete('/api/invoices/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM Invoices WHERE id = ?', id, function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});