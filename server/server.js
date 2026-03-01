const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { seedIfEmpty } = require('./config/seeder');

// Load env vars
dotenv.config();

// Connect to database and seed
connectDB().then(() => {
    seedIfEmpty();
});

const app = express();

// Middleware
app.use(compression());
app.use(morgan('dev'));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400 // Cache preflight requests for 24 hours
}));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads', { maxAge: '1d' })); // Cache static images

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/players', require('./routes/playerRoutes'));
app.use('/api/tournaments', require('./routes/tournamentRoutes'));
app.use('/api/fixtures', require('./routes/fixtureRoutes'));
app.use('/api/grounds', require('./routes/groundRoutes'));
app.use('/api/teams', require('./routes/teamRoutes'));


app.get('/', (req, res) => res.send('Football Club Management API Running'));

// Global Error Handler for faster failure and better UX
app.use((err, req, res, next) => {
    console.error('🔥 Server Error:', err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'production' ? {} : err
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
