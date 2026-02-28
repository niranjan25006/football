const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    founded: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
