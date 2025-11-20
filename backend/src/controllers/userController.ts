import { Request, Response } from 'express';
import User from '../models/User.js';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, data: users });
  } catch (err: any) {
    console.error('Get All Users Error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['rider', 'driver', 'admin'].includes(role)) return res.status(400).json({ success: false, message: 'Invalid role' });

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, data: user });
  } catch (err: any) {
    console.error('Update User Role Error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
