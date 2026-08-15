import type { RegisterDraft } from "./register.types";

let registerDraft: RegisterDraft | null = null;

export function saveRegisterDraft(draft: RegisterDraft): void {
  registerDraft = draft;
}

export function getRegisterDraft(): RegisterDraft | null {
  return registerDraft;
}

export function clearRegisterDraft(): void {
  registerDraft = null;
}
