import { registerUser } from '../../src/server/authService.js';

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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { name, email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
  }

  const result = registerUser(name || '', email, password);

  if ('error' in result) {
    return res.status(400).json({ success: false, message: result.error });
  }

  return res.status(201).json({
    success: true,
    message: `Sign up successful as ${result.user.role === 'superadmin' ? 'Super Admin' : result.user.role === 'admin' ? 'Admin' : 'Member'}!`,
    user: result.user,
    token: result.token,
  });
}
