import express from "express";
import Flight from "../models/Flight.js";
import {auth, permit} from "../middleWare/auth.js";

const router = express.Router();

// Admin: create flight
router.post('/flights', auth, permit('admin'), async (req, res) => {
    try {
        const flight = await Flight.create(req.body);
        res.status(201).json(flight);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

// Admin: update flight
router.put('/:id', auth, permit('admin'), async (req, res) => {
    try {
        const updated = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

// Admin: delete flight
router.delete('/:id', auth, permit('admin'), async (req, res) => {
    try {
        await Flight.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

// Public/Passenger: list/filter flights
router.get('/flights', async (req, res) => {
    try {
        const { from, to, date } = req.query;
        const q = {};
        if (from) q.from = new RegExp(`^${from}$`, 'i');
        if (to) q.to = new RegExp(`^${to}$`, 'i');
        if (date) {
            const start = new Date(date);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            q.journeyDateTime = { $gte: start, $lte: end };
        }
        const flights = await Flight.find(q).sort({ journeyDateTime: 1 });
        res.json(flights);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});
export default router;




