import { Router } from 'express';
import { register, login, me } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', (req, res) => {
	res.clearCookie('token');
	return res.status(200).json({ success: true, message: 'Logged out' });
});
router.get('/me', authMiddleware, me);

export default router;
