import { getUserByToken } from '../../src/server/authService.js';
import { getStoreStatus, updateStoreStatus, StoreOverrideMode } from '../../src/server/storeStatusService.js';

interface SimpleReq {
  method?: string;
  headers: Record<string, any>;
  body?: any;
}

interface SimpleRes {
  setHeader(k: string, v: string): void;
  status(code: number): SimpleRes;
  json(body: any): void;
  end(): void;
}

export default function handler(req: SimpleReq, res: SimpleRes) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      status: getStoreStatus(),
    });
  }

  if (req.method === 'PUT' || req.method === 'POST') {
    const authHeader = req.headers.authorization;
    const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
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

    const { mode, note } = (req.body || {}) as { mode?: StoreOverrideMode; note?: string };
    if (mode !== 'auto' && mode !== 'open' && mode !== 'closed') {
      return res.status(400).json({ success: false, message: 'Invalid status mode.' });
    }

    const cleanNote = mode === 'closed' && typeof note === 'string' ? note : '';
    const updated = updateStoreStatus(
      mode,
      cleanNote,
      requester.name || requester.email
    );
    return res.status(200).json({
      success: true,
      message:
        mode === 'closed'
          ? 'Status warung diubah menjadi Tutup.'
          : 'Status warung diubah menjadi Buka.',
      status: updated,
    });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
