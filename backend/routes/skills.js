const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Skill = require('../models/Skills');

// @route   GET /api/skills
// @desc    Get all skills
// @access  Public
router.get('/', async (req, res) => {
    try {
        const skills = await Skill.find().populate('userId', 'name avatar');
        
        res.json({
            success: true,
            count: skills.length,
            skills
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/skills
// @desc    Create a skill
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const skill = await Skill.create({
            ...req.body,
            userId: req.user.id
        });

        res.status(201).json({
            success: true,
            skill
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;