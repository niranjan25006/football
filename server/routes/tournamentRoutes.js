const express = require('express');
const router = express.Router();
const { createTournament, getTournaments, registerTeam } = require('../controllers/tournamentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getTournaments)
    .post(protect, adminOnly, createTournament);

router.post('/:id/register', protect, registerTeam);

module.exports = router;
