import { getUserByToken } from '../../src/server/authService.js';

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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

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
}
