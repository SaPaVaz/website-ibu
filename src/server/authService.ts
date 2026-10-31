import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export type UserRole = 'superadmin' | 'admin' | 'member';

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
const DATA_DIR = path.resolve(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

function createPasswordHash(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashPassword(password, salt);
  return { salt, hash };
}

// In-memory store
const usersStore: Map<string, AppUser> = new Map();

function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error('Failed to create data directory:', err);
  }
}

function saveUsersToDisk(): void {
  try {
    ensureDataDir();
    const array = Array.from(usersStore.values());
    fs.writeFileSync(USERS_FILE, JSON.stringify(array, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist users to disk:', err);
  }
}

function loadUsersFromDisk(): void {
  try {
    ensureDataDir();
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      const parsed: AppUser[] = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        usersStore.clear();
        for (const user of parsed) {
          const emailLower = user.email.toLowerCase();
          // Remove any unrequested test/mock accounts
          if (
            emailLower !== 'admin@warungpojokaro.com' &&
            emailLower !== 'budi.santoso@gmail.com' &&
            emailLower !== 'siti.aminah@gmail.com' &&
            emailLower !== 'rahmat.hidayat@gmail.com'
          ) {
            // Guarantee safarazqiaa@gmail.com is always superadmin
            if (emailLower === 'safarazqiaa@gmail.com') {
              user.role = 'superadmin';
            }
            usersStore.set(emailLower, user);
          }
        }
      }
    }
  } catch (err) {
    console.error('Failed to load users from disk:', err);
  }

  // Ensure safarazqiaa@gmail.com is registered as the SOLE Super Admin
  if (!usersStore.has('safarazqiaa@gmail.com')) {
    const ownerCreds = createPasswordHash('Tasik*2026');
    usersStore.set('safarazqiaa@gmail.com', {
      id: 'usr_superadmin_001',
      email: 'safarazqiaa@gmail.com',
      name: 'Safaraz Qia (Super Admin)',
      role: 'superadmin',
      salt: ownerCreds.salt,
      hash: ownerCreds.hash,
      createdAt: new Date().toISOString(),
    });
  } else {
    const owner = usersStore.get('safarazqiaa@gmail.com')!;
    owner.role = 'superadmin';
    usersStore.set('safarazqiaa@gmail.com', owner);
  }

  saveUsersToDisk();
}

// Initial load
loadUsersFromDisk();

/**
 * Sign a secure JWT-like token with HMAC-SHA256
 */
export function signToken(payload: { id: string; email: string; role: UserRole }): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days session
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
 * - safarazqiaa@gmail.com is ALWAYS the exclusive 'superadmin'
 * - Every other person who signs up is ALWAYS 'member'
 */
export function registerUser(
  name: string,
  email: string,
  password: string
): { user: SafeUser; token: string } | { error: string } {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password) {
    return { error: 'Email and password are required.' };
  }

  if (usersStore.has(normalizedEmail)) {
    // If it's the super admin, update credentials/name and log in immediately
    if (normalizedEmail === 'safarazqiaa@gmail.com') {
      const owner = usersStore.get(normalizedEmail)!;
      const { salt, hash } = createPasswordHash(password);
      owner.salt = salt;
      owner.hash = hash;
      owner.role = 'superadmin';
      if (name.trim()) owner.name = name.trim();
      usersStore.set(normalizedEmail, owner);
      saveUsersToDisk();
      const token = signToken({ id: owner.id, email: owner.email, role: owner.role });
      return { user: toSafeUser(owner), token };
    }
    return { error: 'This email is already registered. Please login.' };
  }

  // Only safarazqiaa@gmail.com is superadmin, everyone else is member
  const role: UserRole = normalizedEmail === 'safarazqiaa@gmail.com' ? 'superadmin' : 'member';

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
  saveUsersToDisk();

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

  // Seamless password match for super admin
  if (!isPasswordValid && normalizedEmail === 'safarazqiaa@gmail.com') {
    if (password === 'Tasik*2026' || password === 'qia201412') {
      const { salt, hash } = createPasswordHash(password);
      existingUser.salt = salt;
      existingUser.hash = hash;
      existingUser.role = 'superadmin';
      usersStore.set(normalizedEmail, existingUser);
      saveUsersToDisk();
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

export const getAdminByToken = getUserByToken;

/**
 * Get all registered users (for Super Admin & Admin)
 */
export function getAllUsers(): SafeUser[] {
  const list: SafeUser[] = [];
  for (const user of usersStore.values()) {
    list.push(toSafeUser(user));
  }
  return list;
}

/**
 * Update user role: only between 'admin' and 'member'
 * Super Admin cannot be downgraded, and other users cannot become super admin!
 */
export function updateUserRole(userId: string, newRole: 'admin' | 'member'): boolean {
  for (const [email, user] of usersStore.entries()) {
    if (user.id === userId) {
      if (email === 'safarazqiaa@gmail.com') {
        return false; // Cannot change Super Admin role
      }
      user.role = newRole;
      usersStore.set(email, user);
      saveUsersToDisk();
      return true;
    }
  }
  return false;
}

/**
 * Delete a user (Super Admin only capability)
 */
export function deleteUser(userId: string): boolean {
  for (const [email, user] of usersStore.entries()) {
    if (user.id === userId) {
      if (email === 'safarazqiaa@gmail.com') {
        return false; // Cannot delete Super Admin
      }
      usersStore.delete(email);
      saveUsersToDisk();
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
  saveUsersToDisk();
  return true;
}
