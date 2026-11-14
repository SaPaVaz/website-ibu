import { Router, Request, Response } from 'express';
import { getUserByToken } from './authService.js';
import { getStoreStatus, updateStoreStatus, StoreOverrideMode } from './storeStatusService.js';

const router = Router();

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

// GET /api/store/status (Public: visitors & members can view live open/closed status)
router.get('/status', (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    status: getStoreStatus(),
  });
});

// PUT /api/store/status (Super Admin only: change open/closed status)
router.put('/status', (req: Request, res: Response) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
  }

  const requester = getUserByToken(token);
  const isSuperAdmin =
    requester &&
    (requester.role === 'superadmin' || requester.email.toLowerCase() === 'safarazqiaa@gmail.com');

  if (!isSuperAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Hanya Super Admin yang dapat mengubah status buka/tutup warung.',
    });
  }

  const { mode, note } = req.body as { mode?: StoreOverrideMode; note?: string };
  if (mode !== 'auto' && mode !== 'open' && mode !== 'closed') {
    return res.status(400).json({
      success: false,
      message: 'Mode status harus auto, open, atau closed.',
    });
  }

  const cleanNote = mode === 'closed' && typeof note === 'string' ? note : '';
  const updated = updateStoreStatus(mode, cleanNote, requester.name || requester.email);
  return res.status(200).json({
    success: true,
    message:
      mode === 'closed'
        ? 'Status warung diubah menjadi Tutup.'
        : 'Status warung diubah menjadi Buka.',
    status: updated,
  });
});

export default router;
