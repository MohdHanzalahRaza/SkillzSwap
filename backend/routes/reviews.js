const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Review = require('../models/Review');

// @route   GET /api/reviews/:userId
// @desc    Get reviews for a user
// @access  Public
router.get('/:userId', async (req, res) => {
    try {
        const reviews = await Review.find({ 
            reviewedUserId: req.params.userId 
        }).populate('reviewerId', 'name avatar');

        res.json({
            success: true,
            reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/reviews
// @desc    Create a review
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const review = await Review.create({
            ...req.body,
            reviewerId: req.user.id
        });

        res.status(201).json({
            success: true,
            review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;