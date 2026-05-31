import type { TrainingSession, TrainingSettings } from '../types';

const SETTINGS_KEY = 'cta-settings';
const SESSIONS_KEY = 'cta-sessions';

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
    return JSON.parse(raw) as TrainingSession[];
  } catch {
    return [];
  }
}

export function saveSession(session: TrainingSession): void {
  const sessions = loadSessions();
  const next = [session, ...sessions.filter((item) => item.id !== session.id)];
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(next));
}

export function updateSession(session: TrainingSession): void {
  saveSession(session);
}

export function findSession(id: string): TrainingSession | undefined {
  return loadSessions().find((session) => session.id === id);
}
