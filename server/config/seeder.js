const User = require('../models/User');
const Player = require('../models/Player');
const Team = require('../models/Team');
const Tournament = require('../models/Tournament');
const Ground = require('../models/Ground');
const bcrypt = require('bcrypt');

const seedIfEmpty = async () => {
    try {
        const playerCount = await Player.countDocuments();
        if (playerCount > 0) {
            console.log('📊 Database already has players, skipping auto-seed.');
            return;
        }

        console.log('🌱 Database is empty. Starting professional auto-seed...');

        // 1. Create Default Admin
        const adminEmail = 'admin@fcms.com';
        let admin = await User.findOne({ email: adminEmail });
        if (!admin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin1234', salt);
            admin = await User.create({
                username: 'SuperAdmin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });
            console.log('   ✅ Default Admin created (admin@fcms.com / admin1234)');
        }

        // 2. Create Pro Grounds
        const grounds = await Ground.create([
            { name: 'Santiago Bernabéu', location: 'Madrid, Spain', capacity: 81044, rentPerMatch: 500000 },
            { name: 'Camp Nou', location: 'Barcelona, Spain', capacity: 99354, rentPerMatch: 450000 },
            { name: 'Wembley Stadium', location: 'London, UK', capacity: 90000, rentPerMatch: 600000 },
            { name: 'Anfield', location: 'Liverpool, UK', capacity: 53394, rentPerMatch: 350000 },
            { name: 'Old Trafford', location: 'Manchester, UK', capacity: 74310, rentPerMatch: 400000 },
            { name: 'Allianz Arena', location: 'Munich, Germany', capacity: 75000, rentPerMatch: 420000 },
            { name: 'San Siro', location: 'Milan, Italy', capacity: 80018, rentPerMatch: 380000 },
            { name: 'Parc des Princes', location: 'Paris, France', capacity: 47929, rentPerMatch: 300000 },
            { name: 'Etihad Stadium', location: 'Manchester, UK', capacity: 53400, rentPerMatch: 320000 },
            { name: 'Stamford Bridge', location: 'London, UK', capacity: 40341, rentPerMatch: 280000 },
            { name: 'Signal Iduna Park', location: 'Dortmund, Germany', capacity: 81365, rentPerMatch: 360000 }
        ]);
        console.log('   ✅ Pro Grounds added (Madrid, London, Liverpool, Manchester, Munich, Milan, Paris, Dortmund)');

        // 3. Create Pro Teams
        const teams = await Team.create([
            { name: 'Real Madrid CF', founded: 1902 },
            { name: 'Manchester City', founded: 1880 },
            { name: 'Paris Saint-Germain', founded: 1970 },
            { name: 'Al-Nassr FC', founded: 1955 },
            { name: 'Al-Hilal SFC', founded: 1957 },
            { name: 'Liverpool FC', founded: 1892 },
            { name: 'FC Barcelona', founded: 1899 },
            { name: 'Arsenal FC', founded: 1886 },
            { name: 'FC Bayern Munich', founded: 1900 },
            { name: 'Tottenham Hotspur', founded: 1882 },
            { name: 'Atletico Madrid', founded: 1903 },
            { name: 'Inter Milan', founded: 1908 }
        ]);
        console.log('   ✅ Pro Teams expanded (added Spurs, Atletico, Inter)');

        // 4. Create Pro Players
        await Player.create([
            {
                name: 'Kylian Mbappé',
                age: 25,
                position: 'Forward',
                number: 7,
                nationality: 'France',
                teamId: teams[0]._id,
                image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800',
                goals: 12, assists: 4
            },
            {
                name: 'Erling Haaland',
                age: 23,
                position: 'Forward',
                number: 9,
                nationality: 'Norway',
                teamId: teams[1]._id,
                image: 'https://images.unsplash.com/photo-1628891890467-b79f2c8ba9dc?auto=format&fit=crop&q=80&w=800',
                goals: 18, assists: 2
            },
            {
                name: 'Lionel Messi',
                age: 36,
                position: 'Forward',
                number: 10,
                nationality: 'Argentina',
                teamId: teams[2]._id,
                image: 'https://images.unsplash.com/photo-1552667466-07770ae110d0?auto=format&fit=crop&q=80&w=800',
                goals: 14, assists: 10
            },
            {
                name: 'Cristiano Ronaldo',
                age: 39,
                position: 'Forward',
                number: 7,
                nationality: 'Portugal',
                teamId: teams[3]._id,
                image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800',
                goals: 22, assists: 3
            },
            {
                name: 'Harry Kane',
                age: 30,
                position: 'Forward',
                number: 9,
                nationality: 'England',
                teamId: teams[8]._id,
                image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800',
                goals: 25, assists: 5
            },
            {
                name: 'Son Heung-min',
                age: 31,
                position: 'Forward',
                number: 7,
                nationality: 'South Korea',
                teamId: teams[9]._id,
                image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800',
                goals: 12, assists: 6
            },
            {
                name: 'Antoine Griezmann',
                age: 33,
                position: 'Forward',
                number: 7,
                nationality: 'France',
                teamId: teams[10]._id,
                image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
                goals: 11, assists: 7
            },
            {
                name: 'Vinícius Júnior',
                age: 23,
                position: 'Forward',
                number: 7,
                nationality: 'Brazil',
                teamId: teams[0]._id,
                image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
                goals: 10, assists: 8
            },
            {
                name: 'Mohamed Salah',
                age: 31,
                position: 'Forward',
                number: 11,
                nationality: 'Egypt',
                teamId: teams[5]._id,
                image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
                goals: 15, assists: 8
            },
            {
                name: 'Robert Lewandowski',
                age: 35,
                position: 'Forward',
                number: 9,
                nationality: 'Poland',
                teamId: teams[6]._id,
                image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=800',
                goals: 11, assists: 5
            },
            {
                name: 'Lautaro Martínez',
                age: 26,
                position: 'Forward',
                number: 10,
                nationality: 'Argentina',
                teamId: teams[11]._id,
                image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800',
                goals: 16, assists: 4
            },
            {
                name: 'Pedri',
                age: 21,
                position: 'Midfielder',
                number: 8,
                nationality: 'Spain',
                teamId: teams[6]._id,
                image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=800',
                goals: 3, assists: 8
            },
            {
                name: 'Jude Bellingham',
                age: 20,
                position: 'Midfielder',
                number: 5,
                nationality: 'England',
                teamId: teams[0]._id,
                image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=800',
                goals: 10, assists: 6
            },
            {
                name: 'Bukayo Saka',
                age: 22,
                position: 'Forward',
                number: 7,
                nationality: 'England',
                teamId: teams[7]._id,
                image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
                goals: 13, assists: 9
            },
            {
                name: 'Virgil van Dijk',
                age: 32,
                position: 'Defender',
                number: 4,
                nationality: 'Netherlands',
                teamId: teams[5]._id,
                image: 'https://images.unsplash.com/photo-1518005020250-68a0d0d75b17?auto=format&fit=crop&q=80&w=800',
                goals: 2, assists: 1
            },
            {
                name: 'Alisson Becker',
                age: 31,
                position: 'Goalkeeper',
                number: 1,
                nationality: 'Brazil',
                teamId: teams[5]._id,
                image: 'https://images.unsplash.com/photo-1521731978332-9e9e714bdd20?auto=format&fit=crop&q=80&w=800',
                goals: 0, assists: 0
            },
            {
                name: 'Thibaut Courtois',
                age: 31,
                position: 'Goalkeeper',
                number: 1,
                nationality: 'Belgium',
                teamId: teams[0]._id,
                image: 'https://images.unsplash.com/photo-1521731978332-9e9e714bdd20?auto=format&fit=crop&q=80&w=800',
                goals: 0, assists: 0
            }
        ]);
        console.log('   ✅ Expanded Pro Players added with high-quality photos');

        // 5. Create a Sample Tournament
        await Tournament.create({
            name: 'Ultimate Champions Cup 2026',
            startDate: '2026-03-01',
            endDate: '2026-05-30',
            entryFee: 15000,
            prizeMoney: 1000000
        });
        console.log('   ✅ Sample Tournament created');

        console.log('🚀 AUTO-SEED COMPLETE! FCMS is now ready with professional data.');
    } catch (error) {
        console.error('❌ Auto-seed failed:', error.message);
    }
};

module.exports = { seedIfEmpty };
