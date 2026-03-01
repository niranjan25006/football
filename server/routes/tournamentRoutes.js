const express = require('express');
const router = express.Router();
const { createTournament, getTournaments, registerTeam, applyForTournament } = require('../controllers/tournamentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getTournaments)
    .post(protect, adminOnly, createTournament);

router.post('/:id/register', protect, registerTeam);
router.post('/:id/apply', protect, applyForTournament);

module.exports = router;
