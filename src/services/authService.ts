/**
 * Antigravity High-Security Admin Authentication Service
 * Cryptographically verifies credentials with SHA-256 salted digest.
 * Zero plaintext passwords in source code.
 */

const DEFAULT_ADMIN_HASH = '9ddac2afa1bbde398d45f28fa416a8ecc747cdd86decce1bc5fd81a22fae4aa4';
const AUTH_SALT = 'portfolio_series_admin_salt_2026';
const CUSTOM_HASH_KEY = 'portfolio_admin_custom_hash_v4';
const SESSION_KEY = 'portfolio_admin_auth_token_v4';
const SESSION_EXPIRY_KEY = 'portfolio_admin_auth_expiry_v4';
const FAILED_ATTEMPTS_KEY = 'portfolio_admin_fail_count_v4';
const LOCKOUT_UNTIL_KEY = 'portfolio_admin_lockout_until_v4';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface AuthResult {
  success: boolean;
  message?: string;
  lockoutRemainingMs?: number;
}

export interface LockoutStatus {
  isLocked: boolean;
  remainingMs: number;
  attemptsLeft: number;
}

/**
 * Computes SHA-256 hash of a string using Web Crypto API
 */
export async function computeSHA256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Returns active admin hash (custom or default)
 */
export function getActiveTargetHash(): string {
  try {
    return localStorage.getItem(CUSTOM_HASH_KEY) || DEFAULT_ADMIN_HASH;
  } catch {
    return DEFAULT_ADMIN_HASH;
  }
}

/**
 * Checks if custom credentials have been set
 */
export function hasCustomCredentials(): boolean {
  try {
    return Boolean(localStorage.getItem(CUSTOM_HASH_KEY));
  } catch {
    return false;
  }
}

/**
 * Checks current brute-force lockout status
 */
export function getLockoutStatus(): LockoutStatus {
  try {
    const lockoutUntil = parseInt(localStorage.getItem(LOCKOUT_UNTIL_KEY) || '0', 10);
    const now = Date.now();
    if (lockoutUntil > now) {
      return {
        isLocked: true,
        remainingMs: lockoutUntil - now,
        attemptsLeft: 0,
      };
    }

    const fails = parseInt(localStorage.getItem(FAILED_ATTEMPTS_KEY) || '0', 10);
    return {
      isLocked: false,
      remainingMs: 0,
      attemptsLeft: Math.max(0, MAX_FAILED_ATTEMPTS - fails),
    };
  } catch {
    return { isLocked: false, remainingMs: 0, attemptsLeft: MAX_FAILED_ATTEMPTS };
  }
}

/**
 * Verifies admin credentials (username & password)
 */
export async function authenticateAdmin(username: string, password: string): Promise<AuthResult> {
  const lockout = getLockoutStatus();
  if (lockout.isLocked) {
    const minutes = Math.ceil(lockout.remainingMs / 60000);
    return {
      success: false,
      message: `Security Lockout Active. Access blocked for ${minutes} minute(s).`,
      lockoutRemainingMs: lockout.remainingMs,
    };
  }

  const normalizedUser = username.trim().toLowerCase();
  const combined = `${normalizedUser}:${password}:${AUTH_SALT}`;
  const inputHash = await computeSHA256(combined);
  const targetHash = getActiveTargetHash();

  if (inputHash === targetHash) {
    // Reset lockout counters on success
    try {
      localStorage.removeItem(FAILED_ATTEMPTS_KEY);
      localStorage.removeItem(LOCKOUT_UNTIL_KEY);
    } catch {
      /* ignore */
    }

    // Create session token with timestamp and signature
    const expiry = Date.now() + SESSION_DURATION_MS;
    const sessionToken = await computeSHA256(`${targetHash}:${expiry}:${AUTH_SALT}`);

    sessionStorage.setItem(SESSION_KEY, sessionToken);
    sessionStorage.setItem(SESSION_EXPIRY_KEY, expiry.toString());

    return { success: true };
  } else {
    // Increment failed attempts
    try {
      const fails = parseInt(localStorage.getItem(FAILED_ATTEMPTS_KEY) || '0', 10) + 1;
      localStorage.setItem(FAILED_ATTEMPTS_KEY, fails.toString());

      if (fails >= MAX_FAILED_ATTEMPTS) {
        const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
        localStorage.setItem(LOCKOUT_UNTIL_KEY, lockoutUntil.toString());
        return {
          success: false,
          message: 'Threat threshold triggered. Admin portal locked for 15 minutes.',
          lockoutRemainingMs: LOCKOUT_DURATION_MS,
        };
      }

      const attemptsLeft = MAX_FAILED_ATTEMPTS - fails;
      return {
        success: false,
        message: `Authentication rejected. Cryptographic signature mismatch (${attemptsLeft} attempt(s) remaining).`,
      };
    } catch {
      return {
        success: false,
        message: 'Authentication rejected. Cryptographic signature mismatch.',
      };
    }
  }
}

/**
 * Allows the admin to change their credentials from the admin panel
 */
export async function updateAdminCredentials(
  _currentPass: string,
  newUsername: string,
  newPass: string
): Promise<{ success: boolean; message: string }> {
  if (!newUsername.trim() || newUsername.trim().length < 3) {
    return { success: false, message: 'New username must be at least 3 characters long.' };
  }
  if (!newPass || newPass.length < 6) {
    return { success: false, message: 'New password must be at least 6 characters long.' };
  }

  // Generate SHA-256 hash for new credentials
  const normalizedNewUser = newUsername.trim().toLowerCase();
  const newHash = await computeSHA256(`${normalizedNewUser}:${newPass}:${AUTH_SALT}`);

  try {
    localStorage.setItem(CUSTOM_HASH_KEY, newHash);
    // Renew session with new hash
    const expiry = Date.now() + SESSION_DURATION_MS;
    const sessionToken = await computeSHA256(`${newHash}:${expiry}:${AUTH_SALT}`);
    sessionStorage.setItem(SESSION_KEY, sessionToken);
    sessionStorage.setItem(SESSION_EXPIRY_KEY, expiry.toString());
    return { success: true, message: 'Security credentials updated successfully. New credentials are active.' };
  } catch {
    return { success: false, message: 'Failed to write credentials to persistent security storage.' };
  }
}

/**
 * Resets admin credentials to initial system default
 */
export function resetAdminCredentialsToDefault(): void {
  try {
    localStorage.removeItem(CUSTOM_HASH_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Validates active admin session token
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const token = sessionStorage.getItem(SESSION_KEY);
    const expiryStr = sessionStorage.getItem(SESSION_EXPIRY_KEY);
    if (!token || !expiryStr) return false;

    const expiry = parseInt(expiryStr, 10);
    if (Date.now() > expiry) {
      logoutAdmin();
      return false;
    }

    const targetHash = getActiveTargetHash();
    const expectedToken = await computeSHA256(`${targetHash}:${expiry}:${AUTH_SALT}`);
    return token === expectedToken;
  } catch {
    return false;
  }
}

/**
 * Logs out the administrator and clears secure tokens
 */
export function logoutAdmin(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_EXPIRY_KEY);
  } catch {
    /* ignore */
  }
}

