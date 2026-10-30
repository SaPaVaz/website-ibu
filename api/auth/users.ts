import { getUserByToken, getAllUsers, updateUserRole, UserRole } from '../../src/server/authService.js';

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
  res.setHeader('Access-Control-Allow-Methods', 'GET,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Tidak terotentikasi.' });
  }

  const requester = getUserByToken(token);
  if (!requester || requester.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Hanya admin yang memiliki izin.' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ success: true, users: getAllUsers() });
  }

  if (req.method === 'PATCH') {
    const { userId, role } = req.body || {};
    if (!userId || (role !== 'admin' && role !== 'member')) {
      return res.status(400).json({ success: false, message: 'Parameter tidak valid.' });
    }
    const updated = updateUserRole(userId, role as UserRole);
    if (!updated) {
      return res.status(400).json({ success: false, message: 'Gagal memperbarui role pengguna.' });
    }
    return res.status(200).json({ success: true, users: getAllUsers() });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
