const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    appliedDate: { type: Date, default: Date.now }
}, { timestamps: true });

// Ensure a user can only apply once to the same tournament
registrationSchema.index({ userId: 1, tournamentId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
