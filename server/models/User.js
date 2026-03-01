const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'manager', 'admin'], default: 'user', index: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
