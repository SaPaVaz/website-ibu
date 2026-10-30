import { Router, Request, Response } from 'express';
import {
  authenticate,
  registerUser,
  getUserByToken,
  getAllUsers,
  updateUserRole,
  updatePassword,
  UserRole,
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
      message: 'Email dan password wajib diisi.',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password minimal 6 karakter.',
    });
  }

  setTimeout(() => {
    const result = registerUser(name || '', email, password);

    if ('error' in result) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    return res.status(201).json({
      success: true,
      message: `Pendaftaran berhasil. Selamat datang sebagai ${
        result.user.role === 'admin' ? 'Admin' : 'Member'
      }!`,
      user: result.user,
      token: result.token,
    });
  }, 200);
});

// POST /api/auth/login
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email dan password wajib diisi.',
    });
  }

  setTimeout(() => {
    const authResult = authenticate(email, password);

    if (!authResult) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah. Silakan periksa kembali.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login berhasil.',
      user: authResult.user,
      token: authResult.token,
    });
  }, 200);
});

// GET /api/auth/me
router.get('/me', (req: Request, res: Response) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token otentikasi tidak ditemukan.',
    });
  }

  const user = getUserByToken(token);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Sesi telah berakhir atau tidak valid.',
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
    message: 'Berhasil keluar dari sesi.',
  });
});

// GET /api/auth/users (Admin Only: list all users)
router.get('/users', (req: Request, res: Response) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ success: false, message: 'Tidak terotentikasi.' });
  }

  const requester = getUserByToken(token);
  if (!requester || requester.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Hanya admin yang dapat mengelola pengguna.' });
  }

  const users = getAllUsers();
  return res.status(200).json({
    success: true,
    users,
  });
});

// PATCH /api/auth/users/:id/role (Admin Only: change member <-> admin)
router.patch('/users/:id/role', (req: Request, res: Response) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ success: false, message: 'Tidak terotentikasi.' });
  }

  const requester = getUserByToken(token);
  if (!requester || requester.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Hanya admin yang dapat mengubah role pengguna.' });
  }

  const userId = req.params.id;
  const { role } = req.body as { role: UserRole };

  if (role !== 'admin' && role !== 'member') {
    return res.status(400).json({ success: false, message: 'Role harus admin atau member.' });
  }

  const updated = updateUserRole(userId, role);
  if (!updated) {
    return res.status(400).json({
      success: false,
      message: 'Gagal mengubah role atau akun pemilik tidak dapat diturunkan.',
    });
  }

  return res.status(200).json({
    success: true,
    message: `Role pengguna berhasil diubah menjadi ${role}.`,
    users: getAllUsers(),
  });
});

// POST /api/auth/change-password
router.post('/change-password', (req: Request, res: Response) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Tidak memiliki otorisasi.',
    });
  }

  const user = getUserByToken(token);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Sesi tidak valid.',
    });
  }

  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password baru minimal harus 6 karakter.',
    });
  }

  const success = updatePassword(user.email, oldPassword, newPassword);
  if (!success) {
    return res.status(400).json({
      success: false,
      message: 'Password lama tidak sesuai.',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Password berhasil diperbarui.',
  });
});

export default router;
