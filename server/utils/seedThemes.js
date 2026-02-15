const Theme = require('../models/Theme');

const themes = [
    {
        id: 'default',
        name: 'Default',
        description: 'Classic purple gradient theme',
        price: 0,
        rarity: 'free',
        isDefault: true,
        assets: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            primaryColor: '#667eea',
            secondaryColor: '#764ba2',
            accentColor: '#ffffff'
        }
    },
    {
        id: 'ocean_breeze',
        name: 'Ocean Breeze',
        description: 'Cool blue waves crashing on shore',
        price: 100,
        rarity: 'common',
        assets: {
            background: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
            primaryColor: '#2193b0',
            secondaryColor: '#6dd5ed',
            accentColor: '#ffffff'
        }
    },
    {
        id: 'sunset_vibes',
        name: 'Sunset Vibes',
        description: 'Warm orange and yellow sunset',
        price: 100,
        rarity: 'common',
        assets: {
            background: 'linear-gradient(135deg, #f46b45 0%, #eea849 100%)',
            primaryColor: '#f46b45',
            secondaryColor: '#eea849',
            accentColor: '#ffffff'
        }
    },
    {
        id: 'forest_green',
        name: 'Forest Green',
        description: 'Fresh and natural green tones',
        price: 250,
        rarity: 'rare',
        assets: {
            background: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
            primaryColor: '#56ab2f',
            secondaryColor: '#a8e063',
            accentColor: '#ffffff'
        }
    },
    {
        id: 'royal_purple',
        name: 'Royal Purple',
        description: 'Deep and luxurious purple',
        price: 250,
        rarity: 'rare',
        assets: {
            background: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)',
            primaryColor: '#8e2de2',
            secondaryColor: '#4a00e0',
            accentColor: '#ffffff'
        }
    },
    {
        id: 'neon_cyberpunk',
        name: 'Neon Cyberpunk',
        description: 'Futuristic neon pink and dark vibes',
        price: 500,
        rarity: 'epic',
        assets: {
            background: 'linear-gradient(135deg, #ff0099 0%, #493240 100%)',
            primaryColor: '#ff0099',
            secondaryColor: '#493240',
            accentColor: '#ffffff'
        }
    },
    {
        id: 'golden_luxury',
        name: 'Golden Luxury',
        description: 'Shiny gold and premium feel',
        price: 500,
        rarity: 'epic',
        assets: {
            background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
            primaryColor: '#f7971e',
            secondaryColor: '#ffd200',
            accentColor: '#333333'
        }
    },
    {
        id: 'dark_knight',
        name: 'Dark Knight',
        description: 'Sleek dark mode with subtle gradients',
        price: 500,
        rarity: 'epic',
        assets: {
            background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
            primaryColor: '#232526',
            secondaryColor: '#414345',
            accentColor: '#ffffff'
        }
    }
];

const seedThemes = async () => {
    try {
        // Clear existing themes
        await Theme.deleteMany({});

        // Insert new themes
        await Theme.insertMany(themes);

        console.log('✅ Themes seeded successfully!');
        console.log(`📦 ${themes.length} themes added to database`);
    } catch (error) {
        console.error('❌ Error seeding themes:', error);
    }
};

module.exports = seedThemes;
