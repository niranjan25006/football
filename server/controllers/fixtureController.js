const Fixture = require('../models/Fixture');
const Tournament = require('../models/Tournament');

const generateFixtures = async (req, res) => {
    const { tournamentId } = req.body;
    try {
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) return res.status(404).json({ message: 'Tournament not found' });

        const teams = tournament.teamsRegistered;
        if (teams.length < 2) return res.status(400).json({ message: 'Not enough teams to generate fixtures' });

        // Simple round-robin generation logic (every team plays each other once)
        const fixtures = [];
        let matchDate = new Date(tournament.startDate);

        for (let i = 0; i < teams.length; i++) {
            for (let j = i + 1; j < teams.length; j++) {
                fixtures.push({
                    tournamentId,
                    homeTeam: teams[i],
                    awayTeam: teams[j],
                    matchDate: new Date(matchDate.setDate(matchDate.getDate() + 1)) // schedule next match next day
                });
            }
        }

        const createdFixtures = await Fixture.insertMany(fixtures);
        res.status(201).json(createdFixtures);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFixtures = async (req, res) => {
    try {
        const fixtures = await Fixture.find()
            .populate('tournamentId', 'name')
            .populate('homeTeam', 'name')
            .populate('awayTeam', 'name')
            .populate('groundId', 'name');
        res.json(fixtures);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { generateFixtures, getFixtures };
