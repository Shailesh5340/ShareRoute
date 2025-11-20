import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getAllUsers, updateUserRole } from '../controllers/userController.js';

const router = Router();

// admin-only routes
router.use(authMiddleware);

router.get('/users', async (req, res, next) => {
  // only admin
  if ((req as any).userRole !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });
  return getAllUsers(req, res as any);
});

router.put('/users/:id/role', async (req, res, next) => {
  if ((req as any).userRole !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });
  return updateUserRole(req, res as any);
});

export default router;
