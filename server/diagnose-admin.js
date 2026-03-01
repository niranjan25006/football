const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const { seedIfEmpty } = require('./config/seeder');

dotenv.config();

const diagnoseAdmin = async () => {
    try {
        console.log('🔍 Starting Admin Diagnosis...');

        // Connect to DB (Try local first, then memory server logic if needed)
        // Using the same logic as db.js via indirect call or just ensuring connection
        const connectDB = require('./config/db');
        await connectDB();
        console.log('✅ Connected to Database');

        // Seed if empty (simulating server startup)
        await seedIfEmpty();

        const adminEmail = 'admin@fcms.com';
        const user = await User.findOne({ email: adminEmail });

        if (!user) {
            console.log('❌ ERROR: No user found with email: ' + adminEmail);
            console.log('🌱 Creating admin...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin1234', salt);
            await User.create({
                username: 'SuperAdmin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });
            console.log('✅ Admin created.');
        } else {
            console.log('ℹ️ User Found. Resetting password to "admin1234" to be sure...');
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash('admin1234', salt);
            user.role = 'admin'; // Ensure role is correct too
            await user.save();
            console.log('✅ Admin password and role reset.');
        }

        const isMatch = await bcrypt.compare('admin1234', user.password);
        if (isMatch) {
            console.log('✅ Password "admin1234" MATCHES successfully.');
        } else {
            console.log('❌ ERROR: Password "admin1234" DOES NOT MATCH.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Diagnosis Failed:', error.message);
        process.exit(1);
    }
};

diagnoseAdmin();
