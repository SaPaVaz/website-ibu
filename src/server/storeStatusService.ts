import fs from 'fs';
import path from 'path';

export type StoreOverrideMode = 'auto' | 'open' | 'closed';

export interface StoreStatusData {
  mode: StoreOverrideMode;
  note: string;
  updatedAt: string;
  updatedBy: string;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const STATUS_FILE = path.join(DATA_DIR, 'store-status.json');
const STATUS_BACKUP_FILE = path.join(DATA_DIR, 'store-status.backup.json');

const DEFAULT_STATUS: StoreStatusData = {
  mode: 'auto',
  note: '',
  updatedAt: new Date().toISOString(),
  updatedBy: 'system',
};

let currentStatus: StoreStatusData = { ...DEFAULT_STATUS };

function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error('Failed to create data directory for store status:', err);
  }
}

function saveStatusToDisk(): void {
  try {
    ensureDataDir();
    const jsonStr = JSON.stringify(currentStatus, null, 2);
    fs.writeFileSync(STATUS_FILE, jsonStr, 'utf-8');
    fs.writeFileSync(STATUS_BACKUP_FILE, jsonStr, 'utf-8');
  } catch (err) {
    console.error('Failed to persist store status:', err);
  }
}

function isValidMode(mode: unknown): mode is StoreOverrideMode {
  return mode === 'auto' || mode === 'open' || mode === 'closed';
}

function loadStatusFromDisk(): void {
  try {
    ensureDataDir();
    for (const filePath of [STATUS_FILE, STATUS_BACKUP_FILE]) {
      if (fs.existsSync(filePath)) {
        try {
          const raw = fs.readFileSync(filePath, 'utf-8');
          const parsed = JSON.parse(raw) as Partial<StoreStatusData>;
          if (parsed && isValidMode(parsed.mode)) {
            currentStatus = {
              mode: parsed.mode,
              note: typeof parsed.note === 'string' ? parsed.note : '',
              updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
              updatedBy: typeof parsed.updatedBy === 'string' ? parsed.updatedBy : 'system',
            };
            return;
          }
        } catch {
          // try backup
        }
      }
    }
  } catch (err) {
    console.error('Failed to load store status:', err);
  }
  saveStatusToDisk();
}

loadStatusFromDisk();

export function getStoreStatus(): StoreStatusData {
  return { ...currentStatus };
}

export function updateStoreStatus(
  mode: StoreOverrideMode,
  note: string,
  updatedBy: string
): StoreStatusData {
  currentStatus = {
    mode,
    note: note.trim().slice(0, 200),
    updatedAt: new Date().toISOString(),
    updatedBy,
  };
  saveStatusToDisk();
  return { ...currentStatus };
}
