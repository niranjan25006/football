const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getPlayers, getPlayerById, addPlayer, updatePlayer, deletePlayer } = require('../controllers/playerController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const fs = require('fs');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/players';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) return cb(null, true);
        cb(new Error('Only images are allowed'));
    }
});

router.route('/')
    .get(protect, getPlayers)
    .post(protect, adminOnly, upload.single('image'), addPlayer);

router.route('/:id')
    .get(protect, getPlayerById)
    .put(protect, adminOnly, upload.single('image'), updatePlayer)
    .delete(protect, adminOnly, deletePlayer);

module.exports = router;
