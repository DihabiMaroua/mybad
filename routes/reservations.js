const express = require('express');
const router = express.Router();
const db = require('../db.js')
const path = require('path');
router.use(express.urlencoded({ extended: true }));
router.use(express.static(path.join(__dirname, '/../views')));
const halHelpers = require('../hal.js');
const moment = require('moment');



// Route pour afficher la page d'accueil avec le formulaire
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../views/index.html')); 
});

// Route pour gérer la soumission du formulaire (POST) vers /users
router.post('/users', (req, res) => {
    const { username } = req.body; // Retrieve the username from the form

    // SQL query to check if the username already exists
    const checkUsernameSql = 'SELECT * FROM users WHERE username = ?';

    // Execute the SQL check query
    db.query(checkUsernameSql, [username], (err, results) => {
        if (err) {
            console.error('Error checking the username:', err);
            return res.status(500).json({ message: 'Server error', error: err });
        }

        // Check if any results were returned, which means the username already exists
        if (results.length > 0) {
            console.log('The username already exists');
            return res.status(409).json({ message: 'The username already exists' });
        }
        
        // If the username does not exist yet, you can create it
        const insertUsernameSql = 'INSERT INTO users (username) VALUES (?)';

        // Execute the SQL query to create the new user
        db.query(insertUsernameSql, [username], (err, results) => {
            if (err) {
                console.error('Error creating the user:', err);
                return res.status(500).json({ message: 'Server error', error: err });
            }

            console.log('New user added successfully');

            // Redirect the user to the new user's details page
            res.redirect(`/users/${username}`);
        });
    });
});

// Route pour afficher la page de reservation (GET)
router.get('/reserve', (req, res) => {
    res.sendFile(path.join(__dirname + '/../views/reserve.html'));
});

// Route pour créer une réservation (POST)
router.post('/reserve', (req, res) => {
    const { username, courtId, reservationDate, startTime } = req.body;

    // Convert reservation dates and times into moment objects for validation
    const reservationStart = moment(`${reservationDate}T${startTime}`);
    const reservationEnd = moment(reservationStart).add(45, 'minutes');

    // Validate that the reservation day is between Monday and Saturday
    if (reservationStart.day() === 0) { // 0 corresponds to Sunday in moment.js
        return res.status(400).send('The hall is closed on Sundays and cannot accommodate reservations.');
    }

    // Validate that the reservation is for the current week
    if (!reservationStart.isSame(moment(), 'week')) {
        return res.status(400).send('Reservations can only be made for the current week.');
    }

  // Validate that the reservation time is between 10 AM and 9:15 PM
    const latestPossibleStart = moment(`${reservationDate}T21:15`);
    if (reservationStart.hour() < 10 || reservationStart.isAfter(latestPossibleStart)) {
    return res.status(400).send('Reservations are only possible between 10 AM and 9:15 PM.');
    }

    // Check if the court is already reserved
    const checkReservationOverlap = `
        SELECT * FROM reservations
        WHERE court_id = ?
        AND reservation_date = ?
        AND NOT (TIME(end_time) <= ? OR TIME(start_time) >= ?)
    `;
    db.query(checkReservationOverlap, [courtId, reservationDate, startTime, reservationEnd.format('HH:mm:ss')], (err, overlappingReservations) => {
        if (err) {
            console.error('Error checking reservation overlaps:', err);
            return res.status(500).send('Server error while checking reservation overlaps.');
        }

        if (overlappingReservations.length > 0) {
            return res.status(400).send("The court is not available during the selected times.");
        }

        // Get the user ID from the username
        const getUserId = 'SELECT user_id FROM users WHERE username = ?';
        db.query(getUserId, [username], (err, userResults) => {
            if (err) {
                console.error("Error retrieving the user:", err);
                return res.status(500).send('Server error while retrieving the user.');
            }

            if (userResults.length === 0) {
                return res.status(404).send('User not found.');
            }

            const userId = userResults[0].user_id;

            // Check if the court is available
            const checkAvailability = 'SELECT * FROM courts WHERE court_id = ? AND status = "available"';
            db.query(checkAvailability, [courtId], (err, results) => {
                if (err) {
                    console.error('Error checking availability:', err);
                    return res.status(500).send('Server error while checking availability.');
                }

                if (results.length === 0) {
                    return res.status(400).send('Court not available');
                } else {
                    const sqlInsert = `
                        INSERT INTO reservations (user_id, court_id, reservation_date, start_time, end_time) 
                        VALUES (?, ?, ?, ?, ?)
                    `;
                    db.query(sqlInsert, [userId, courtId, reservationDate, startTime, reservationEnd.format('HH:mm:ss')], (err, insertResults) => {
                        if (err) {
                            console.error('Error creating the reservation:', err);
                            return res.status(500).send('Server error while creating the reservation.');
                        }
                        res.send('Reservation created successfully');
                    });
                }
            });
        });
    });
});




// Route pour afficher les réservations de l'utilisateur
router.get('/users/:username/reservations', (req, res) => {
    const { username } = req.params; // Retrieve the username from the URL parameters

    // SQL query to get the ID, start time, and end time of the user's reservations based on their username
    const sql = `
        SELECT r.reservation_id, r.start_time, r.end_time
        FROM reservations r
        JOIN users u ON r.user_id = u.user_id
        WHERE u.username = ?
        ORDER BY r.reservation_date ASC, r.start_time ASC
    `;

    // Execute the SQL query
    db.query(sql, [username], (err, reservations) => {
        if (err) {
            console.error('Error retrieving reservations:', err);
            return res.status(500).send('Server error while retrieving reservations.');
        }

        // Check if any reservations were found
        if (reservations.length === 0) {
            return res.status(404).send('No reservations found for this user.');
        }

        // Display the user's reservations
        res.json(reservations);
    });
});

// Route pour annuler une réservation (DELETE)
router.delete('/users/:username/reservations/:reservationId', (req, res) => {
    const { username, reservationId } = req.params;

    // SQL query to delete a reservation
    const sqlDelete = `
        DELETE FROM reservations 
        WHERE reservation_id = ? 
        AND user_id = (SELECT user_id FROM users WHERE username = ?)
    `;

    // Execute the SQL query to cancel the reservation
    db.query(sqlDelete, [reservationId, username], (err, results) => {
        if (err) {
            console.error("Error canceling the reservation:", err);
            return res.status(500).json({ message: 'Server error', error: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Reservation not found or user not authorized' });
        }
        console.log('Reservation successfully canceled');
        res.json({ message: 'Reservation canceled' });
    });
});

// Route pour afficher la page avec le formulaire de saisie de nom d'utilisateur
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + '/../views/login.html')); // Assurez-vous que le chemin correspond à l'emplacement de votre fichier HTML
});

// Route pour gérer la soumission du formulaire et afficher les réservations de l'utilisateur
router.post('/login', (req, res) => {
    const { username } = req.body; // Retrieve the username from the form

    // First, check if the user exists
    const checkUserSql = 'SELECT * FROM users WHERE username = ?';

    db.query(checkUserSql, [username], (err, userResults) => {
        if (err) {
            console.error("Error checking the user:", err);
            return res.status(500).send('Server error while checking the user.');
        }

        if (userResults.length === 0) {
            // The user does not exist, you can choose to create them or send an error message
            return res.status(404).send("User not found. Please check your username or register.");
        }

        // If the user exists, redirect them to their reservations
        res.redirect(`/users/${username}/reservations`);
    });
});

// Route pour afficher les détails de l'utilisateur
router.get('/users/:username', (req, res) => {
    const { username } = req.params; // Retrieve the username from the URL parameters

    // SQL query to get the user's details based on their username
    const sql = 'SELECT * FROM users WHERE username = ?';

    // Execute the SQL query
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Error retrieving user details:', err);
            return res.status(500).json({ message: 'Server error', error: err });
        }

        // Check if the user exists
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Display the user's details
        const userDetails = results[0]; // Take the first result (there should only be one)
        res.json(userDetails);
    });
});
module.exports = router;

