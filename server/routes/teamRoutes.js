const express = require('express');
const router = express.Router();
const { createTeam, getTeams, getTeamById, updateTeam, deleteTeam } = require('../controllers/teamController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getTeams)
    .post(protect, adminOnly, createTeam);

router.route('/:id')
    .get(protect, getTeamById)
    .put(protect, adminOnly, updateTeam)
    .delete(protect, adminOnly, deleteTeam);

module.exports = router;
