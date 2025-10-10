const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a skill title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    category: {
        type: String,
        required: true,
        enum: ['tech', 'creative', 'language', 'business', 'other'],
        default: 'other'
    },
    proficiencyLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Expert'],
        default: 'Intermediate'
    },
    skillsWanted: {
        type: [String],
        default: []
    },
    availability: {
        type: String,
        default: 'Flexible'
    },
    images: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'inactive'],
        default: 'active'
    },
    views: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    verified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for searching
SkillSchema.index({ title: 'text', description: 'text' });
SkillSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('Skill', SkillSchema);

// SAVE THIS FILE AS: backend/models/Skill.js