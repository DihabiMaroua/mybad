const express = require('express');
const router = express.Router();
const db = require('../db.js')
const path = require('path');
router.use(express.urlencoded({ extended: true }));
router.use(express.static(path.join(__dirname, '/../views')));
const halHelpers = require('../hal.js');
const jwt = require('jsonwebtoken');
const secretKey = 'VotreCleSecrete'; 



// Fonction pour extraire le token du header d'autorisation
const extractBearerToken = headerValue => {
    if (typeof headerValue !== 'string') {
        return false;
    }
    const matches = headerValue.match(/(bearer)\s+(\S+)/i);
    return matches && matches[2];
};

// Middleware pour vérifier le JWT
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization && extractBearerToken(req.headers.authorization);
    if (!token) {
        return res.status(403).send('Un jeton est nécessaire pour l\'authentification');
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).send('Token invalide');
        }
        req.user = decoded;
        next();
    });
};

// Route pour afficher la page de login pour les admins
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + '/../views/admin.html'));
});

// Route pour la connexion de l'admin et la génération du JWT
//tester curl.exe -X POST http://localhost:3000/admin/login -H "Content-Type: application/x-www-form-urlencoded" -d "username=admybad&password=admybad"
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Simulation d'une vérification d'authentification, remplacez ceci par une vérification réelle dans votre base de données
    if (username === 'admybad' && password === 'admybad') { // Remplacez ces valeurs par la vérification de votre base de données
        const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } else {
        return res.status(401).send('Nom d\'utilisateur ou mot de passe incorrect');
    }
});

// Route protégée pour afficher la page de désactivation d'un terrain
router.get('/court', (req, res) => {
    res.sendFile(path.join(__dirname + '/../views/court.html'));
});

// Route pour modifier le statut d'un court
//tester curle.exe curl.exe -X POST "http://localhost:3000/admin/court" -H "Content-Type: application/x-www-form-urlencoded" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbXliYWQiLCJpYXQiOjE3MDM4MDU3ODYsImV4cCI6MTcwMzgwOTM4Nn0.78v-05_-CQQkTfpOoR7_R2t8G64L3fHvJdfo49p3bRY" -d "court_id=A&current_status=unavailable"
router.post('/court', verifyToken, (req, res) => {
    const courtId = req.body.court_id; // Ensure this matches the "name" of the form input
    const newStatus = req.body.current_status; // Ensure this matches the "name" of the form input

    console.log(`Received - courtId: ${courtId}, newStatus: ${newStatus}`); // Use this for debugging

    // Ensure the received data is valid
    if (!['A', 'B', 'C', 'D'].includes(courtId) || !['available', 'unavailable'].includes(newStatus)) {
        return res.status(400).send(`Invalid request: Incorrect court ID or status. Received - courtId: ${courtId}, newStatus: ${newStatus}`);
    }

    // First, check the current status of the court
    const checkQuery = 'SELECT status FROM courts WHERE court_id = ?';
    db.query(checkQuery, [courtId], (checkError, checkResults) => {
        if (checkError) {
            console.error('Error checking the court status:', checkError);
            return res.status(500).send('Error checking the court status');
        }

        if (checkResults.length === 0) {
            return res.status(404).send(`Court with ID ${courtId} not found.`);
        }

        const currentStatus = checkResults[0].status;
        if (currentStatus === newStatus) {
            return res.status(200).send(`The status of court ${courtId} is already '${newStatus}'.`);
        }

        // If the status needs to be updated
        const updateQuery = 'UPDATE courts SET status = ? WHERE court_id = ?';
        db.query(updateQuery, [newStatus, courtId], (updateError, updateResults) => {
            if (updateError) {
                console.error('Error updating the court:', updateError);
                return res.status(500).send('Error updating the court');
            }

            if (updateResults.affectedRows > 0) {
                return res.json({ message: `The status of court ${courtId} has been updated to '${newStatus}'.` });
            } else {
                return res.status(500).send(`Unexpected error when updating court ${courtId}.`);
            }
        });
    });
});


module.exports = router;
