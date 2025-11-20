import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashed, phone, role });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Set HTTP-only cookie
    const maxAgeMs = parseInt(process.env.JWT_COOKIE_MAX_AGE || '3600000', 10); // default 1h
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAgeMs,
    });

    return res.status(201).json({ success: true, data: { user: { id: user._id, name: user.name, email: user.email, role: user.role } } });
  } catch (err: any) {
    console.error('Register Error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Missing credentials' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const maxAgeMs = parseInt(process.env.JWT_COOKIE_MAX_AGE || '3600000', 10);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAgeMs,
    });

    return res.status(200).json({ success: true, data: { user: { id: user._id, name: user.name, email: user.email, role: user.role } } });
  } catch (err: any) {
    console.error('Login Error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    // user id attached by auth middleware
    const userId = (req as any).userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    return res.status(200).json({ success: true, data: user });
  } catch (err: any) {
    console.error('Me Error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
