const mongoose = require('mongoose');

const fixtureSchema = new mongoose.Schema({
    tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true, index: true },
    homeTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    awayTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    matchDate: { type: Date, required: true, index: true },
    groundId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ground' },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
    homeScore: { type: Number, default: null },
    awayScore: { type: Number, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Fixture', fixtureSchema);
