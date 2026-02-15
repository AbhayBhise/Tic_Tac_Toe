const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: 'general'
    },
    price: {
        type: Number,
        default: 0
    },
    rarity: {
        type: String,
        enum: ['free', 'common', 'rare', 'epic'],
        default: 'free'
    },
    assets: {
        background: String,
        backgroundMobile: String,
        primaryColor: String,
        secondaryColor: String,
        accentColor: String,
        boardStyle: String,
        xSymbol: String,
        oSymbol: String,
        sounds: {
            move: String,
            win: String,
            background: String
        }
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Theme', themeSchema);
