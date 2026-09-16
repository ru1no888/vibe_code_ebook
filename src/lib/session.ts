/**
 * Session Management for Vibe Digital Store
 * Requirement: รีเซ็ตเซสชันทุก 1 ชั่วโมง (1-Hour Session Auto-Reset) เพื่อความปลอดภัย
 */

import { clearCart } from './storage';

export const SESSION_DURATION_MS = 60 * 60 * 1000; // 1 hour (3,600,000 ms)
const SESSION_STORAGE_KEY = 'vibe_store_security_session_v1';

export interface SecuritySession {
  sessionId: string;
  createdAt: number;
  expiresAt: number;
  lastActiveAt: number;
}

function generateSessionId(): string {
  return 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
}

export function initOrGetSession(): SecuritySession {
  if (typeof window === 'undefined') {
    return {
      sessionId: 'server_session',
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION_MS,
      lastActiveAt: Date.now(),
    };
  }

  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      const parsed: SecuritySession = JSON.parse(raw);
      const now = Date.now();
      // Check if session has expired (> 1 hour)
      if (now < parsed.expiresAt) {
        parsed.lastActiveAt = now;
        window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(parsed));
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error accessing session in localStorage:', err);
  }

  // Session expired or non-existent; create a fresh one
  return resetSession();
}

export function resetSession(): SecuritySession {
  if (typeof window === 'undefined') {
    return {
      sessionId: 'server_session',
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION_MS,
      lastActiveAt: Date.now(),
    };
  }

  const now = Date.now();
  const newSession: SecuritySession = {
    sessionId: generateSessionId(),
    createdAt: now,
    expiresAt: now + SESSION_DURATION_MS,
    lastActiveAt: now,
  };

  try {
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
    window.dispatchEvent(new CustomEvent('vibe-session-updated', { detail: newSession }));
  } catch (err) {
    console.warn('Error saving fresh session:', err);
  }

  return newSession;
}

export function extendSession(): SecuritySession {
  if (typeof window === 'undefined') {
    return initOrGetSession();
  }

  const now = Date.now();
  const session: SecuritySession = {
    sessionId: generateSessionId(),
    createdAt: now,
    expiresAt: now + SESSION_DURATION_MS,
    lastActiveAt: now,
  };

  try {
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    window.dispatchEvent(new CustomEvent('vibe-session-updated', { detail: session }));
  } catch (err) {
    console.warn('Error extending session:', err);
  }

  return session;
}

export function getSessionRemainingSeconds(): number {
  if (typeof window === 'undefined') return 3600;
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      const session: SecuritySession = JSON.parse(raw);
      const diff = Math.max(0, Math.floor((session.expiresAt - Date.now()) / 1000));
      return diff;
    }
  } catch (err) {
    // fallback
  }
  return 3600;
}

export function checkAndEnforceSessionExpiry(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      const session: SecuritySession = JSON.parse(raw);
      if (Date.now() >= session.expiresAt) {
        // Session expired! Clear cart and re-initialize
        clearCart();
        resetSession();
        window.dispatchEvent(new CustomEvent('vibe-session-expired'));
        return true;
      }
    }
  } catch (err) {
    // ignore
  }

  return false;
}
