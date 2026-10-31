import { Router, Request, Response } from 'express';
import {
  authenticate,
  registerUser,
  getUserByToken,
  getAllUsers,
  updateUserRole,
  deleteUser,
  updatePassword,
} from './authService.js';

const router = Router();

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

// POST /api/auth/signup
router.post('/signup', (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters.',
    });
  }

  const result = registerUser(name || '', email, password);

  if ('error' in result) {
    return res.status(400).json({
      success: false,
      message: result.error,
    });
  }

  return res.status(201).json({
    success: true,
    message: `Sign up successful as ${result.user.role === 'superadmin' ? 'Super Admin' : result.user.role === 'admin' ? 'Admin' : 'Member'}!`,
    user: result.user,
    token: result.token,
  });
});

// POST /api/auth/login
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.',
    });
  }

  const authResult = authenticate(email, password);

  if (!authResult) {
    return res.status(401).json({
      success: false,
      message: 'Incorrect email or password. Please try again.',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Login successful.',
    user: authResult.user,
    token: authResult.token,
  });
});

// GET /api/auth/me
router.get('/me', (req: Request, res: Response) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication token not found.',
    });
  }

  const user = getUserByToken(token);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Session expired or invalid.',
    });
  }

  return res.status(200).json({
    success: true,
    user,
  });
});

// POST /api/auth/logout
router.post('/logout', (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: 'Successfully logged out.',
  });
});

// GET /api/auth/users (Super Admin & Admin: list all users)
router.get('/users', (req: Request, res: Response) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized.' });
  }

  const requester = getUserByToken(token);
  if (!requester || (requester.role !== 'superadmin' && requester.role !== 'admin')) {
    return res.status(403).json({ success: false, message: 'Forbidden. Admin privileges required.' });
  }

  const users = getAllUsers();
  return res.status(200).json({
    success: true,
    users,
  });
});

// PATCH /api/auth/users/:id/role (Super Admin & Admin: change member <-> admin)
router.patch('/users/:id/role', (req: Request, res: Response) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized.' });
  }

  const requester = getUserByToken(token);
  if (!requester || (requester.role !== 'superadmin' && requester.role !== 'admin')) {
    return res.status(403).json({ success: false, message: 'Forbidden. Admin privileges required.' });
  }

  const userId = req.params.id;
  const { role } = req.body as { role: 'admin' | 'member' };

  if (role !== 'admin' && role !== 'member') {
    return res.status(400).json({ success: false, message: 'Role must be admin or member.' });
  }

  const updated = updateUserRole(userId, role);
  if (!updated) {
    return res.status(400).json({
      success: false,
      message: 'Cannot modify Super Admin or user not found.',
    });
  }

  return res.status(200).json({
    success: true,
    message: `User role successfully updated to ${role}.`,
    users: getAllUsers(),
  });
});

// DELETE /api/auth/users/:id (Super Admin ONLY: delete member or admin)
router.delete('/users/:id', (req: Request, res: Response) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized.' });
  }

  const requester = getUserByToken(token);
  if (!requester || requester.role !== 'superadmin') {
    return res.status(403).json({ success: false, message: 'Only Super Admin can delete users.' });
  }

  const userId = req.params.id;
  const deleted = deleteUser(userId);

  if (!deleted) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete Super Admin account or user not found.',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'User successfully removed.',
    users: getAllUsers(),
  });
});

// POST /api/auth/change-password
router.post('/change-password', (req: Request, res: Response) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized.',
    });
  }

  const user = getUserByToken(token);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid session.',
    });
  }

  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters.',
    });
  }

  const success = updatePassword(user.email, oldPassword, newPassword);
  if (!success) {
    return res.status(400).json({
      success: false,
      message: 'Incorrect current password.',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Password successfully updated.',
  });
});

export default router;
