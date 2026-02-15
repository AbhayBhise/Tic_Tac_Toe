// Run this script to seed themes into the database
require('dotenv').config();
const mongoose = require('mongoose');
const seedThemes = require('./utils/seedThemes');

const connectDatabase = require('./config/database');

const runSeed = async () => {
    try {
        await connectDatabase();
        await seedThemes();
        console.log('✅ Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

runSeed();
