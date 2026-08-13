import type { RegisterDraft } from './register.types';

const DRAFT_KEY = 'harmoniq_register_draft';

export function saveRegisterDraft(draft: RegisterDraft): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function getRegisterDraft(): RegisterDraft | null {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(DRAFT_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as RegisterDraft;
  } catch {
    return null;
  }
}

export function clearRegisterDraft(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(DRAFT_KEY);
}
