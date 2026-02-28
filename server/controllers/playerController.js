const Player = require('../models/Player');

const getPlayers = async (req, res) => {
    try {
        const players = await Player.find().populate('teamId', 'name');
        res.json(players);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPlayerById = async (req, res) => {
    try {
        const player = await Player.findById(req.params.id).populate('teamId', 'name');
        if (player) {
            res.json(player);
        } else {
            res.status(404).json({ message: 'Player not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addPlayer = async (req, res) => {
    const { name, age, position, teamId } = req.body;
    try {
        const player = new Player({ name, age, position, teamId });
        const createdPlayer = await player.save();
        res.status(201).json(createdPlayer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePlayer = async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        if (player) {
            player.name = req.body.name || player.name;
            player.age = req.body.age || player.age;
            player.position = req.body.position || player.position;
            player.teamId = req.body.teamId || player.teamId;
            player.goals = req.body.goals || player.goals;
            player.assists = req.body.assists || player.assists;
            player.matchesPlayed = req.body.matchesPlayed || player.matchesPlayed;

            const updatedPlayer = await player.save();
            res.json(updatedPlayer);
        } else {
            res.status(404).json({ message: 'Player not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePlayer = async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        if (player) {
            await player.deleteOne();
            res.json({ message: 'Player removed' });
        } else {
            res.status(404).json({ message: 'Player not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPlayers, getPlayerById, addPlayer, updatePlayer, deletePlayer };
