const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Skill = require('../models/skills');

// @route   GET /api/skills
// @desc    Get all skills with filters
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, search, sort } = req.query;
        
        let query = { status: 'active' };
        
        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
        }
        
        // Search in title and description
        if (search) {
            query.$text = { $search: search };
        }
        
        let skillsQuery = Skill.find(query).populate('userId', 'name avatar verified');
        
        // Sort
        if (sort === 'newest') {
            skillsQuery = skillsQuery.sort({ createdAt: -1 });
        } else if (sort === 'rating') {
            skillsQuery = skillsQuery.sort({ rating: -1 });
        } else if (sort === 'popular') {
            skillsQuery = skillsQuery.sort({ views: -1 });
        }
        
        const skills = await skillsQuery;
        
        res.json({
            success: true,
            count: skills.length,
            skills
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/skills/:id
// @desc    Get single skill
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id).populate('userId', 'name avatar verified bio rating');
        
        if (!skill) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }
        
        // Increment views
        skill.views += 1;
        await skill.save();
        
        res.json({
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

// @route   POST /api/skills
// @desc    Create a skill
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const skill = await Skill.create({
            ...req.body,
            userId: req.user.id
        });

        const populatedSkill = await Skill.findById(skill._id).populate('userId', 'name avatar');

        res.status(201).json({
            success: true,
            skill: populatedSkill
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/skills/:id
// @desc    Update skill
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        let skill = await Skill.findById(req.params.id);
        
        if (!skill) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }
        
        // Check ownership
        if (skill.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this skill'
            });
        }
        
        skill = await Skill.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('userId', 'name avatar');
        
        res.json({
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

// @route   DELETE /api/skills/:id
// @desc    Delete skill
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);
        
        if (!skill) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }
        
        // Check ownership
        if (skill.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this skill'
            });
        }
        
        await skill.deleteOne();
        
        res.json({
            success: true,
            message: 'Skill deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/skills/user/:userId
// @desc    Get user's skills
// @access  Public
router.get('/user/:userId', async (req, res) => {
    try {
        const skills = await Skill.find({ 
            userId: req.params.userId,
            status: 'active'
        }).populate('userId', 'name avatar');
        
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

module.exports = router;