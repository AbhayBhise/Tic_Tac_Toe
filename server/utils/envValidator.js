/**
 * Environment variable validation
 * Ensures all required variables are set before starting the server
 */

const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'PORT',
    'CLIENT_URL'
];

const validateEnv = () => {
    const missing = [];

    requiredEnvVars.forEach(varName => {
        if (!process.env[varName]) {
            missing.push(varName);
        }
    });

    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:');
        missing.forEach(varName => {
            console.error(`   - ${varName}`);
        });
        console.error('\nPlease create a .env file with all required variables.');
        console.error('See .env.example for reference.\n');
        process.exit(1);
    }

    // Validate JWT_SECRET strength
    if (process.env.JWT_SECRET.length < 32) {
        console.warn('⚠️  Warning: JWT_SECRET should be at least 32 characters for security');
    }

    // Validate PORT is a number
    if (isNaN(parseInt(process.env.PORT))) {
        console.error('❌ PORT must be a valid number');
        process.exit(1);
    }

    console.log('✅ Environment variables validated successfully');
};

module.exports = validateEnv;
