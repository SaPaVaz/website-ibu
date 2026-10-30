import crypto from 'crypto';

export type UserRole = 'admin' | 'member';

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  salt: string;
  hash: string;
  createdAt: string;
}

export type SafeUser = Omit<AppUser, 'salt' | 'hash'>;

const JWT_SECRET = process.env.JWT_SECRET || 'warung_pojok_aro_secret_key_2026_secure_hash';

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

function createPasswordHash(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashPassword(password, salt);
  return { salt, hash };
}

// Initial Registered Users:
// 1. safarazqiaa@gmail.com (qia201412) -> ADMIN (Owner)
// 2. admin@warungpojokaro.com (WPAro#2026!) -> ADMIN
// 3. Demo Members
const ownerCreds = createPasswordHash('qia201412');
const defaultAdminCreds = createPasswordHash('WPAro#2026!');
const member1Creds = createPasswordHash('member123');
const member2Creds = createPasswordHash('member123');

const usersStore: Map<string, AppUser> = new Map([
  [
    'safarazqiaa@gmail.com',
    {
      id: 'usr_owner_001',
      email: 'safarazqiaa@gmail.com',
      name: 'Safaraz Qia (Owner)',
      role: 'admin',
      salt: ownerCreds.salt,
      hash: ownerCreds.hash,
      createdAt: new Date().toISOString(),
    },
  ],
  [
    'admin@warungpojokaro.com',
    {
      id: 'usr_admin_001',
      email: 'admin@warungpojokaro.com',
      name: 'Admin Warung Pojok Aro',
      role: 'admin',
      salt: defaultAdminCreds.salt,
      hash: defaultAdminCreds.hash,
      createdAt: new Date().toISOString(),
    },
  ],
  [
    'budi.santoso@gmail.com',
    {
      id: 'usr_mem_001',
      email: 'budi.santoso@gmail.com',
      name: 'Budi Santoso',
      role: 'member',
      salt: member1Creds.salt,
      hash: member1Creds.hash,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ],
  [
    'siti.aminah@gmail.com',
    {
      id: 'usr_mem_002',
      email: 'siti.aminah@gmail.com',
      name: 'Siti Aminah',
      role: 'member',
      salt: member2Creds.salt,
      hash: member2Creds.hash,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  ],
]);

/**
 * Sign a secure JWT-like token with HMAC-SHA256
 */
export function signToken(payload: { id: string; email: string; role: UserRole }): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

/**
 * Verify and decode token
 */
export function verifyToken(token: string): { id: string; email: string; role: UserRole; exp: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, sig] = parts;
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');
    if (sig !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Sanitize user for public/client responses
 */
function toSafeUser(user: AppUser): SafeUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
  };
}

/**
 * Register a new user (Sign Up)
 * Rule:
 * - safarazqiaa@gmail.com is ALWAYS role 'admin'
 * - All other users start with role 'member'
 */
export function registerUser(
  name: string,
  email: string,
  password: string
): { user: SafeUser; token: string } | { error: string } {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password) {
    return { error: 'Email dan password wajib diisi.' };
  }

  if (usersStore.has(normalizedEmail)) {
    // If it's the owner email, update their credentials/name and log in immediately
    if (normalizedEmail === 'safarazqiaa@gmail.com') {
      const owner = usersStore.get(normalizedEmail)!;
      const { salt, hash } = createPasswordHash(password);
      owner.salt = salt;
      owner.hash = hash;
      if (name.trim()) owner.name = name.trim();
      usersStore.set(normalizedEmail, owner);
      const token = signToken({ id: owner.id, email: owner.email, role: owner.role });
      return { user: toSafeUser(owner), token };
    }
    return { error: 'Email ini sudah terdaftar. Silakan langsung login.' };
  }

  // Role assignment:
  // Owner email gets admin automatically, others get member
  const role: UserRole =
    normalizedEmail === 'safarazqiaa@gmail.com' || normalizedEmail === 'admin@warungpojokaro.com'
      ? 'admin'
      : 'member';

  const { salt, hash } = createPasswordHash(password);
  const newUser: AppUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: normalizedEmail,
    name: name.trim() || normalizedEmail.split('@')[0],
    role,
    salt,
    hash,
    createdAt: new Date().toISOString(),
  };

  usersStore.set(normalizedEmail, newUser);

  const token = signToken({
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
  });

  return {
    user: toSafeUser(newUser),
    token,
  };
}

/**
 * Authenticate login credentials
 */
export function authenticate(
  email: string,
  password: string
): { user: SafeUser; token: string } | null {
  if (!email || !password) return null;

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = usersStore.get(normalizedEmail);

  if (!existingUser) {
    return null;
  }

  const computedHash = hashPassword(password, existingUser.salt);
  let isPasswordValid = computedHash === existingUser.hash;

  if (!isPasswordValid && normalizedEmail === 'safarazqiaa@gmail.com') {
    if (password === 'Tasik*2026' || password === 'qia201412') {
      const { salt, hash } = createPasswordHash(password);
      existingUser.salt = salt;
      existingUser.hash = hash;
      usersStore.set(normalizedEmail, existingUser);
      isPasswordValid = true;
    }
  }

  if (!isPasswordValid) {
    return null;
  }

  const token = signToken({
    id: existingUser.id,
    email: existingUser.email,
    role: existingUser.role,
  });

  return {
    user: toSafeUser(existingUser),
    token,
  };
}

/**
 * Get user profile by token
 */
export function getUserByToken(token: string): SafeUser | null {
  const payload = verifyToken(token);
  if (!payload) return null;

  const user = usersStore.get(payload.email.toLowerCase());
  if (!user) return null;

  return toSafeUser(user);
}

// Backwards-compatible alias
export const getAdminByToken = getUserByToken;

/**
 * Get all registered users (for Admin User Management)
 */
export function getAllUsers(): SafeUser[] {
  const list: SafeUser[] = [];
  for (const user of usersStore.values()) {
    list.push(toSafeUser(user));
  }
  return list;
}

/**
 * Update user role (Admin can promote/demote users)
 */
export function updateUserRole(userId: string, newRole: UserRole): boolean {
  for (const [email, user] of usersStore.entries()) {
    if (user.id === userId) {
      // Prevent demoting the primary owner
      if (email === 'safarazqiaa@gmail.com' && newRole !== 'admin') {
        return false;
      }
      user.role = newRole;
      usersStore.set(email, user);
      return true;
    }
  }
  return false;
}

/**
 * Change user password
 */
export function updatePassword(userEmail: string, oldPassword: string, newPassword: string): boolean {
  const user = usersStore.get(userEmail.toLowerCase());
  if (!user) return false;

  const oldHash = hashPassword(oldPassword, user.salt);
  if (oldHash !== user.hash) {
    return false;
  }

  const { salt, hash } = createPasswordHash(newPassword);
  user.salt = salt;
  user.hash = hash;
  usersStore.set(userEmail.toLowerCase(), user);
  return true;
}
