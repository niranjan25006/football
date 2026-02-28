const Tournament = require('../models/Tournament');

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
        res.json(tournaments);
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

module.exports = { createTournament, getTournaments, registerTeam };
