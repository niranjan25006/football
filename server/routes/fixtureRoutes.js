const express = require('express');
const router = express.Router();
const { generateFixtures, getFixtures } = require('../controllers/fixtureController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getFixtures)
    .post(protect, adminOnly, generateFixtures);

module.exports = router;
