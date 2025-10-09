const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Request = require('../models/Requests');

// @route   GET /api/requests
// @desc    Get all requests for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const requests = await Request.find({
            $or: [
                { senderId: req.user.id },
                { receiverId: req.user.id }
            ]
        }).populate('senderId receiverId', 'name avatar');

        res.json({
            success: true,
            requests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/requests
// @desc    Send a skill swap request
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const request = await Request.create({
            ...req.body,
            senderId: req.user.id
        });

        res.status(201).json({
            success: true,
            request
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;