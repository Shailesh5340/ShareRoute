import { Request, Response } from 'express';
import Booking from '../models/Booking.js';
import mongoose from 'mongoose';

export const createBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { pickupLocation, destination, passengerName, passengerEmail, passengerPhone, pickupCoords, destinationCoords } = req.body;

    // attach riderId from auth middleware if present
    const riderId = (req as any).userId ? new mongoose.Types.ObjectId((req as any).userId) : undefined;

    // Validation
    if (!pickupLocation || !destination) {
      res.status(400).json({
        success: false,
        message: 'Pickup location and destination are required',
      });
      return;
    }

    // Create booking
    const booking = await Booking.create({
      pickupLocation,
      destination,
      passengerName,
      passengerEmail,
      passengerPhone,
      pickupCoords,
      destinationCoords,
      rider: riderId,
      status: 'pending',
    });

    // Emit socket event to drivers about new ride
    try {
      const io = req.app.get('io');
      if (io) io.to('drivers').emit('new_ride_request', { booking });
    } catch (e) {
      console.warn('Socket emit failed:', e);
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    console.error('Create Booking Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const acceptBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;

    if (!userId || userRole !== 'driver') {
      res.status(403).json({ success: false, message: 'Only drivers can accept bookings' });
      return;
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    if (booking.status !== 'pending') {
      res.status(400).json({ success: false, message: 'Booking is not available for acceptance' });
      return;
    }

    booking.driver = new mongoose.Types.ObjectId(userId);
    booking.status = 'confirmed';
    await booking.save();

    // Notify rider via socket
    try {
      const io = req.app.get('io');
      if (io && booking.rider) io.to(String(booking.rider)).emit('ride_accepted', { booking });
    } catch (e) {
      console.warn('Socket notify rider failed:', e);
    }

    res.status(200).json({ success: true, message: 'Booking accepted', data: booking });
  } catch (error) {
    console.error('Accept Booking Error:', error);
    res.status(500).json({ success: false, message: 'Failed to accept booking', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const getBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Get Booking Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getAllBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status, limit = '10', page = '1' } = req.query;

    // Build filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get All Bookings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, fare, distance, estimatedDuration } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      id,
      {
        ...(status && { status }),
        ...(fare !== undefined && { fare }),
        ...(distance !== undefined && { distance }),
        ...(estimatedDuration !== undefined && { estimatedDuration }),
      },
      { new: true, runValidators: true }
    );

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: booking,
    });
  } catch (error) {
    console.error('Update Booking Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    console.error('Delete Booking Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete booking',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
