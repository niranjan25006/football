const Team = require('../models/Team');

const createTeam = async (req, res) => {
    const { name, founded } = req.body;
    try {
        const teamExists = await Team.findOne({ name });
        if (teamExists) return res.status(400).json({ message: 'Team already exists' });

        const team = new Team({ name, founded, managerId: req.user._id });
        const createdTeam = await team.save();
        res.status(201).json(createdTeam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTeams = async (req, res) => {
    try {
        const teams = await Team.find().populate('managerId', 'username');
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id).populate('managerId', 'username');
        if (team) {
            res.json(team);
        } else {
            res.status(404).json({ message: 'Team not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTeam = async (req, res) => {
    const { name, founded } = req.body;
    try {
        const team = await Team.findById(req.params.id);
        if (team) {
            team.name = name || team.name;
            team.founded = founded || team.founded;
            const updatedTeam = await team.save();
            res.json(updatedTeam);
        } else {
            res.status(404).json({ message: 'Team not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (team) {
            await team.deleteOne();
            res.json({ message: 'Team removed' });
        } else {
            res.status(404).json({ message: 'Team not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createTeam, getTeams, getTeamById, updateTeam, deleteTeam };
