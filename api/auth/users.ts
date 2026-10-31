import { getUserByToken, getAllUsers, updateUserRole, deleteUser } from '../../src/server/authService.js';

interface SimpleReq {
  method?: string;
  headers: Record<string, any>;
  body?: any;
  query?: Record<string, any>;
}

interface SimpleRes {
  setHeader(k: string, v: string): void;
  status(code: number): SimpleRes;
  json(body: any): void;
  end(): void;
}

export default function handler(req: SimpleReq, res: SimpleRes) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized.' });
  }

  const requester = getUserByToken(token);
  if (!requester || (requester.role !== 'superadmin' && requester.role !== 'admin')) {
    return res.status(403).json({ success: false, message: 'Forbidden. Admin privileges required.' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ success: true, users: getAllUsers() });
  }

  if (req.method === 'PATCH') {
    const { userId, role } = req.body || {};
    if (!userId || (role !== 'superadmin' && role !== 'admin' && role !== 'member')) {
      return res.status(400).json({ success: false, message: 'Role must be superadmin, admin, or member.' });
    }
    if (role === 'superadmin' && requester.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Only Super Admin can promote a user to Super Admin.' });
    }
    const updated = updateUserRole(userId, role, requester.role);
    if (!updated) {
      return res.status(400).json({ success: false, message: 'Cannot modify primary Super Admin or user not found.' });
    }
    return res.status(200).json({ success: true, message: `User role updated to ${role}.`, users: getAllUsers() });
  }

  if (req.method === 'DELETE') {
    if (requester.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Only Super Admin can delete users.' });
    }
    const { userId } = req.body || req.query || {};
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required.' });
    }
    const deleted = deleteUser(userId);
    if (!deleted) {
      return res.status(400).json({ success: false, message: 'Cannot delete Super Admin account or user not found.' });
    }
    return res.status(200).json({ success: true, message: 'User successfully deleted.', users: getAllUsers() });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
