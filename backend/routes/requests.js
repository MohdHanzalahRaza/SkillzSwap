const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Request = require('../models/Request');

// @route   GET /api/requests
// @desc    Get all requests for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { type } = req.query; // 'sent' or 'received'
        
        let query = {};
        
        if (type === 'sent') {
            query.senderId = req.user.id;
        } else if (type === 'received') {
            query.receiverId = req.user.id;
        } else {
            // Get all requests (sent and received)
            query.$or = [
                { senderId: req.user.id },
                { receiverId: req.user.id }
            ];
        }
        
        const requests = await Request.find(query)
            .populate('senderId', 'name avatar verified')
            .populate('receiverId', 'name avatar verified')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: requests.length,
            requests
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/requests/:id
// @desc    Get single request
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id)
            .populate('senderId', 'name avatar verified email')
            .populate('receiverId', 'name avatar verified email');
        
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }
        
        // Check if user is part of request
        if (request.senderId._id.toString() !== req.user.id && 
            request.receiverId._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this request'
            });
        }
        
        res.json({
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

// @route   POST /api/requests
// @desc    Send a skill swap request
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { receiverId, skillOffered, skillWanted, message, scheduledDate } = req.body;
        
        // Can't send request to yourself
        if (receiverId === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot send request to yourself'
            });
        }
        
        // Check if request already exists
        const existingRequest = await Request.findOne({
            senderId: req.user.id,
            receiverId,
            status: 'pending'
        });
        
        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: 'You already have a pending request with this user'
            });
        }
        
        const request = await Request.create({
            senderId: req.user.id,
            receiverId,
            skillOffered,
            skillWanted,
            message,
            scheduledDate
        });
        
        const populatedRequest = await Request.findById(request._id)
            .populate('senderId', 'name avatar')
            .populate('receiverId', 'name avatar');

        res.status(201).json({
            success: true,
            request: populatedRequest
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/requests/:id/accept
// @desc    Accept a request
// @access  Private
router.put('/:id/accept', protect, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }
        
        // Only receiver can accept
        if (request.receiverId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to accept this request'
            });
        }
        
        request.status = 'accepted';
        request.respondedAt = Date.now();
        await request.save();
        
        const populatedRequest = await Request.findById(request._id)
            .populate('senderId', 'name avatar')
            .populate('receiverId', 'name avatar');
        
        res.json({
            success: true,
            request: populatedRequest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/requests/:id/decline
// @desc    Decline a request
// @access  Private
router.put('/:id/decline', protect, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }
        
        // Only receiver can decline
        if (request.receiverId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to decline this request'
            });
        }
        
        request.status = 'declined';
        request.respondedAt = Date.now();
        await request.save();
        
        const populatedRequest = await Request.findById(request._id)
            .populate('senderId', 'name avatar')
            .populate('receiverId', 'name avatar');
        
        res.json({
            success: true,
            request: populatedRequest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/requests/:id/complete
// @desc    Mark request as completed
// @access  Private
router.put('/:id/complete', protect, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }
        
        // Either party can mark as complete
        if (request.senderId.toString() !== req.user.id && 
            request.receiverId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }
        
        request.status = 'completed';
        await request.save();
        
        const populatedRequest = await Request.findById(request._id)
            .populate('senderId', 'name avatar')
            .populate('receiverId', 'name avatar');
        
        res.json({
            success: true,
            request: populatedRequest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   DELETE /api/requests/:id
// @desc    Delete/cancel request
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }
        
        // Only sender can delete
        if (request.senderId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this request'
            });
        }
        
        await request.deleteOne();
        
        res.json({
            success: true,
            message: 'Request cancelled successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;