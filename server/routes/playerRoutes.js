const express = require('express');
const router = express.Router();
const { getPlayers, getPlayerById, addPlayer, updatePlayer, deletePlayer } = require('../controllers/playerController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getPlayers)
    .post(protect, adminOnly, addPlayer);

router.route('/:id')
    .get(protect, getPlayerById)
    .put(protect, adminOnly, updatePlayer)
    .delete(protect, adminOnly, deletePlayer);

module.exports = router;
