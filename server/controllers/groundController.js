const Ground = require('../models/Ground');
const Fixture = require('../models/Fixture');

const addGround = async (req, res) => {
    const { name, location, capacity, rentPerMatch } = req.body;
    try {
        const ground = new Ground({ name, location, capacity, rentPerMatch });
        const createdGround = await ground.save();
        res.status(201).json(createdGround);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getGrounds = async (req, res) => {
    try {
        const grounds = await Ground.find();
        res.json(grounds);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const allocateGround = async (req, res) => {
    const { fixtureId, date } = req.body;
    try {
        const ground = await Ground.findById(req.params.id);
        const fixture = await Fixture.findById(fixtureId);

        if (ground && fixture) {
            ground.allocatedDates.push({ date, fixtureId });
            await ground.save();

            fixture.groundId = ground._id;
            await fixture.save();

            res.json({ message: 'Ground allocated successfully' });
        } else {
            res.status(404).json({ message: 'Ground or Fixture not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addGround, getGrounds, allocateGround };
