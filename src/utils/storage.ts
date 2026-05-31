import type { TrainingSession, TrainingSettings } from '../types';

const SETTINGS_KEY = 'cta-settings';
const SESSIONS_KEY = 'cta-sessions';
const DRAFT_SESSION_KEY = 'cta-draft-session';

export const defaultSettings: TrainingSettings = {
  patientNickname: '家人',
  mathQuestionCount: 10,
  mathLevel: 'L3',
  includeSubtraction: false,
  numberConnectLevel: 10,
  includeWritingTask: true,
  includeSingingTask: true,
};

export function loadSettings(): TrainingSettings {
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) return defaultSettings;
  try {
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: TrainingSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadSessions(): TrainingSession[] {
  const raw = localStorage.getItem(SESSIONS_KEY);
  if (!raw) return [];
  try {
    return normalizeDailySessions(JSON.parse(raw) as TrainingSession[]);
  } catch {
    return [];
  }
}

export function saveSession(session: TrainingSession): void {
  const sessions = loadSessions();
  const next = normalizeDailySessions([
    session,
    ...sessions.filter((item) => item.id !== session.id && item.date !== session.date),
  ]);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(next));
}

export function updateSession(session: TrainingSession): void {
  saveSession(session);
}

export function findSession(id: string): TrainingSession | undefined {
  return loadSessions().find((session) => session.id === id);
}

export function loadDraftSession(): TrainingSession | undefined {
  const raw = localStorage.getItem(DRAFT_SESSION_KEY);
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as TrainingSession;
  } catch {
    return undefined;
  }
}

export function saveDraftSession(session: TrainingSession): void {
  localStorage.setItem(DRAFT_SESSION_KEY, JSON.stringify(session));
}

export function clearDraftSession(): void {
  localStorage.removeItem(DRAFT_SESSION_KEY);
}

function sessionTime(session: TrainingSession): number {
  return new Date(session.completedAt ?? session.startedAt).getTime();
}

function normalizeDailySessions(sessions: TrainingSession[]): TrainingSession[] {
  const byDate = new Map<string, TrainingSession>();
  for (const session of [...sessions].sort((a, b) => sessionTime(b) - sessionTime(a))) {
    if (!byDate.has(session.date)) byDate.set(session.date, session);
  }
  return [...byDate.values()].sort((a, b) => sessionTime(b) - sessionTime(a));
}
