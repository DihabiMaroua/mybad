const express = require('express');
const app = express();
const port = 3000;
const db = require('./db.js')

// Importer et utiliser les routeurs
var reservations = require('./routes/reservations');
var login = require('./routes/login');
app.use('/', reservations);
app.use('/admin',login);

app.listen(port, () => {
  console.log(`Le serveur est démarré sur http://localhost:${port}`);
});