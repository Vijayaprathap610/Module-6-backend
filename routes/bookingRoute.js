import express from "express";
import Booking from "../models/Booking.js";
import {auth, permit} from "../middleWare/auth.js";

const router = express.Router();
// Passenger: create booking
router.post('/bookings', auth, permit('passenger'), async (req, res) => {
  try {
    const booking = await Booking.create({ ...req.body, user: req.user.id, status: 'Pending' });
    res.status(201).json(booking);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Passenger: my bookings
router.get('/me', auth, permit('passenger'), async (req, res) => {
  try {
    const list = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Admin: all bookings
router.get('/bookings', auth, permit('admin'), async (req, res) => {
  try {
    const list = await Booking.find({}).sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Admin: update status
router.patch('/:id/status', auth, permit('admin'), async (req, res) => {
  try {
    const { status } = req.body; // 'Approved' | 'Rejected'
    if (!['Approved', 'Rejected', 'Pending'].includes(status))
      return res.status(400).json({ message: 'Invalid status' });
    const updated = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

export default router;

