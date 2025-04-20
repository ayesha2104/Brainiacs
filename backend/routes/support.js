import express from 'express';
import SupportTicket from '../models/SupportTicket.js';
import { protect as auth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a support ticket
router.post('/tickets', async (req, res) => {
    const ticket = new SupportTicket({
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message
    });

    try {
        const newTicket = await ticket.save();
        res.status(201).json(newTicket);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all tickets (admin only)
router.get('/tickets', auth, async (req, res) => {
    // Add admin check here
    try {
        const tickets = await SupportTicket.find()
            .sort({ createdAt: -1 });
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific ticket
router.get('/tickets/:id', auth, async (req, res) => {
    try {
        const ticket = await SupportTicket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(ticket);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a ticket status (admin only)
router.patch('/tickets/:id', auth, async (req, res) => {
    // Add admin check here
    try {
        const ticket = await SupportTicket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        if (req.body.status) {
            ticket.status = req.body.status;
        }

        if (req.body.response) {
            ticket.responses.push({
                message: req.body.response,
                respondedBy: req.user.id
            });
        }

        const updatedTicket = await ticket.save();
        res.json(updatedTicket);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router; 