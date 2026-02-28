const express = require('express');
const router = express.Router();
const { addGround, getGrounds, allocateGround } = require('../controllers/groundController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getGrounds)
    .post(protect, adminOnly, addGround);

router.post('/:id/allocate', protect, adminOnly, allocateGround);

module.exports = router;
