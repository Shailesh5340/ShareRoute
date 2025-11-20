import { Router } from 'express';
import {
  createBooking,
  getBooking,
  getAllBookings,
  updateBooking,
  deleteBooking,
  acceptBooking,
} from '../controllers/bookingController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// Booking routes
router.post('/', authMiddleware, createBooking);
router.get('/', getAllBookings);
router.get('/:id', getBooking);
router.put('/:id', updateBooking);
// Driver accepts booking
router.post('/:id/accept', authMiddleware, acceptBooking);
router.delete('/:id', deleteBooking);

export default router;
