const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    players: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String,
        symbol: {
            type: String,
            enum: ['X', 'O'],
            required: true
        },
        isAI: {
            type: Boolean,
            default: false
        },
        aiDifficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: null
        }
    }],
    mode: {
        type: String,
        enum: ['single', 'local', 'online'],
        required: true
    },
    moves: [{
        position: {
            type: Number,
            min: 0,
            max: 8,
            required: true
        },
        symbol: {
            type: String,
            enum: ['X', 'O'],
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    result: {
        winner: {
            type: String,
            enum: ['X', 'O', 'tie', null],
            default: null
        },
        winningLine: {
            type: [Number],
            default: null
        }
    },
    roomCode: {
        type: String,
        default: null,
        sparse: true // Allows multiple null values
    },
    spectators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['waiting', 'active', 'completed', 'abandoned'],
        default: 'waiting'
    },
    startedAt: {
        type: Date,
        default: null
    },
    completedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Index for faster queries
matchSchema.index({ roomCode: 1 });
matchSchema.index({ 'players.userId': 1 });
matchSchema.index({ status: 1 });
matchSchema.index({ completedAt: -1 });

module.exports = mongoose.model('Match', matchSchema);
