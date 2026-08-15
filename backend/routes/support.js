import express from 'express';
import SupportTicket from '../models/SupportTicket.js';
import auth, { requireRole } from '../middleware/auth.js';
import { paginate } from '../utils/pagination.js';

const router = express.Router();
const staffOnly = requireRole('teacher', 'admin');

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

// Get all tickets (staff only)
router.get('/tickets', auth, staffOnly, async (req, res) => {
    try {
        const { page, limit, skip } = paginate(req.query);
        const filter = {};
        if (req.query.status) filter.status = req.query.status;

        const [tickets, total] = await Promise.all([
            SupportTicket.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
            SupportTicket.countDocuments(filter),
        ]);

        res.json({ data: tickets, page, limit, total, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific ticket
router.get('/tickets/:id', auth, staffOnly, async (req, res) => {
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

// Update a ticket status (staff only)
router.patch('/tickets/:id', auth, staffOnly, async (req, res) => {
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
