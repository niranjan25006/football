const mongoose = require('mongoose');

const groundSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    rentPerMatch: { type: Number, required: true },
    allocatedDates: [{ date: Date, fixtureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fixture' } }]
}, { timestamps: true });

module.exports = mongoose.model('Ground', groundSchema);
