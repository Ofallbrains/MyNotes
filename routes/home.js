const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Home route (GET request to display all notes)
router.get('/Home', ddashboardController.dashboardHome);

// Route to handle adding a new note (POST request)
router.post('/Home/add', dashboardController.dashboardAddNoteSubmit);

module.exports = router;
