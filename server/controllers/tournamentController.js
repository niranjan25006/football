const Tournament = require('../models/Tournament');
const Registration = require('../models/Registration');

const createTournament = async (req, res) => {
    const { name, startDate, endDate, entryFee, prizeMoney } = req.body;
    try {
        const tournament = new Tournament({ name, startDate, endDate, entryFee, prizeMoney });
        const createdTournament = await tournament.save();
        res.status(201).json(createdTournament);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTournaments = async (req, res) => {
    try {
        const tournaments = await Tournament.find().populate('teamsRegistered', 'name');

        // Get registration counts for each tournament
        const tournamentsWithCounts = await Promise.all(tournaments.map(async (t) => {
            const count = await Registration.countDocuments({ tournamentId: t._id, status: 'approved' });
            const userPending = req.user ? await Registration.findOne({
                tournamentId: t._id,
                userId: req.user._id
            }) : null;

            return {
                ...t.toObject(),
                registrationCount: (t.teamsRegistered ? t.teamsRegistered.length : 0) + count,
                userStatus: userPending ? userPending.status : null
            };
        }));

        res.json(tournamentsWithCounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const applyForTournament = async (req, res) => {
    try {
        const tournamentId = req.params.id;
        const userId = req.user._id;

        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }

        // Check if already applied
        const existing = await Registration.findOne({ userId, tournamentId });
        if (existing) {
            return res.status(400).json({ message: 'Already applied for this tournament' });
        }

        const registration = new Registration({
            userId,
            tournamentId,
            status: 'pending' // Default status
        });

        await registration.save();
        res.status(201).json({ message: 'Application submitted successfully', status: 'pending' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const registerTeam = async (req, res) => {
    const { teamId } = req.body;
    try {
        const tournament = await Tournament.findById(req.params.id);
        if (tournament) {
            if (!tournament.teamsRegistered.includes(teamId)) {
                tournament.teamsRegistered.push(teamId);
                await tournament.save();
                res.json({ message: 'Team registered successfully' });
            } else {
                res.status(400).json({ message: 'Team already registered' });
            }
        } else {
            res.status(404).json({ message: 'Tournament not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createTournament, getTournaments, registerTeam, applyForTournament };
