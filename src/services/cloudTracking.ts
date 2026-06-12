import type { Session, User } from '@supabase/supabase-js';
import type { TrainingSession } from '../types';
import { isCloudConfigured, supabase } from '../lib/supabase';

const PATIENT_ID_KEY = 'cta-cloud-patient-id';
const SYNC_QUEUE_KEY = 'cta-cloud-sync-queue';
const APP_VERSION = '0.1.0';
const SETTINGS_KEY = 'cta-settings';

export type ActivityEventType =
  | 'app_opened'
  | 'settings_saved'
  | 'training_started'
  | 'training_completed'
  | 'caregiver_note_saved';

interface QueueItem {
  id: string;
  kind: 'session' | 'event';
  payload: Record<string, unknown>;
}

export type CloudSyncResult = 'synced' | 'queued' | 'disabled';

export interface AdminPatient {
  id: string;
  nickname: string;
  created_at: string;
  last_active_at: string;
}

export interface AdminTrainingSession {
  id: string;
  patient_id: string;
  started_at: string;
  completed_at?: string | null;
  session_date: string;
  status: 'started' | 'completed';
  result_data: TrainingSession;
  updated_at: string;
}

export interface AdminActivityEvent {
  id: string;
  patient_id: string;
  session_id?: string | null;
  event_type: string;
  event_data: Record<string, unknown>;
  occurred_at: string;
}

function queueItem(kind: QueueItem['kind'], payload: Record<string, unknown>): boolean {
  try {
    const queue = loadQueue();
    const next =
      kind === 'session'
        ? queue.filter((item) => item.kind !== 'session' || item.payload.id !== payload.id)
        : queue;
    next.push({ id: crypto.randomUUID(), kind, payload });
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(next.slice(-100)));
    return true;
  } catch {
    return false;
  }
}

function loadQueue(): QueueItem[] {
  try {
    return JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) ?? '[]') as QueueItem[];
  } catch {
    return [];
  }
}

function hasTrackingConsent(): boolean {
  try {
    const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') as {
      cloudTrackingConsent?: boolean;
    };
    return settings.cloudTrackingConsent === true;
  } catch {
    return false;
  }
}

async function ensureAnonymousUser(): Promise<User | undefined> {
  if (!supabase) return undefined;
  const { data } = await supabase.auth.getSession();
  if (data.session?.user && data.session.user.is_anonymous) return data.session.user;
  if (data.session?.user) return undefined;

  const { data: signInData, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return signInData.user ?? undefined;
}

async function ensurePatient(nickname: string): Promise<string | undefined> {
  if (!supabase) return undefined;
  const user = await ensureAnonymousUser();
  if (!user) return undefined;

  const cachedId = localStorage.getItem(PATIENT_ID_KEY);
  if (cachedId) {
    const { error } = await supabase
      .from('patients')
      .update({ nickname, last_active_at: new Date().toISOString() })
      .eq('id', cachedId);
    if (!error) return cachedId;
    localStorage.removeItem(PATIENT_ID_KEY);
  }

  const { data: existing, error: selectError } = await supabase
    .from('patients')
    .select('id')
    .eq('owner_user_id', user.id)
    .limit(1)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existing) {
    const { error: updateError } = await supabase
      .from('patients')
      .update({ nickname, last_active_at: new Date().toISOString() })
      .eq('id', existing.id);
    if (updateError) throw updateError;
    localStorage.setItem(PATIENT_ID_KEY, existing.id);
    return existing.id;
  }

  const { data, error } = await supabase
    .from('patients')
    .insert({
      owner_user_id: user.id,
      nickname,
      last_active_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error) throw error;
  localStorage.setItem(PATIENT_ID_KEY, data.id);
  return data.id;
}

function sessionPayload(session: TrainingSession, patientId: string): Record<string, unknown> {
  return {
    id: session.id,
    patient_id: patientId,
    started_at: session.startedAt,
    completed_at: session.completedAt ?? null,
    session_date: session.date,
    status: session.completedAt ? 'completed' : 'started',
    result_data: session,
    app_version: APP_VERSION,
    updated_at: new Date().toISOString(),
  };
}

async function sendSession(payload: Record<string, unknown>) {
  if (!supabase) return;
  const { error } = await supabase.from('training_sessions').upsert(payload, { onConflict: 'id' });
  if (error) throw error;
}

async function sendEvent(payload: Record<string, unknown>) {
  if (!supabase) return;
  const { error } = await supabase.from('activity_events').insert(payload);
  if (error) throw error;
}

export async function syncTrainingSession(session: TrainingSession): Promise<CloudSyncResult> {
  if (!isCloudConfigured || !hasTrackingConsent()) return 'disabled';
  const cachedPatientId = localStorage.getItem(PATIENT_ID_KEY);
  if (cachedPatientId) queueItem('session', sessionPayload(session, cachedPatientId));

  try {
    const patientId = await ensurePatient(session.patientNickname);
    if (!patientId) return 'queued';
    const payload = sessionPayload(session, patientId);
    if (!queueItem('session', payload)) {
      await sendSession(payload);
      return 'synced';
    }
    await flushSyncQueue();
    return loadQueue().some((item) => item.kind === 'session' && item.payload.id === session.id)
      ? 'queued'
      : 'synced';
  } catch {
    return 'queued';
  }
}

export async function trackActivity(
  eventType: ActivityEventType,
  nickname: string,
  session?: TrainingSession,
  eventData: Record<string, unknown> = {},
): Promise<void> {
  if (!isCloudConfigured || !hasTrackingConsent()) return;
  try {
    const patientId = await ensurePatient(nickname);
    if (!patientId) return;
    const payload = {
      patient_id: patientId,
      session_id: session?.id ?? null,
      event_type: eventType,
      event_data: eventData,
      occurred_at: new Date().toISOString(),
    };
    if (queueItem('event', payload)) await flushSyncQueue();
    else await sendEvent(payload);
  } catch {
    const patientId = localStorage.getItem(PATIENT_ID_KEY);
    if (patientId) {
      queueItem('event', {
        patient_id: patientId,
        session_id: session?.id ?? null,
        event_type: eventType,
        event_data: eventData,
        occurred_at: new Date().toISOString(),
      });
    }
  }
}

let activeFlush: Promise<void> | undefined;

export async function flushSyncQueue(): Promise<void> {
  if (activeFlush) return activeFlush;
  activeFlush = (async () => {
    if (!supabase || !navigator.onLine || !hasTrackingConsent()) return;
    const queue = loadQueue();
    if (!queue.length) return;

    const remaining: QueueItem[] = [];
    for (const item of queue) {
      try {
        if (item.kind === 'session') await sendSession(item.payload);
        else await sendEvent(item.payload);
      } catch {
        remaining.push(item);
      }
    }
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(remaining));
  })();

  try {
    await activeFlush;
  } finally {
    activeFlush = undefined;
  }
}

export function watchConnectivity() {
  window.addEventListener('online', () => void flushSyncQueue());
}

export async function getCurrentSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function signInAdmin(email: string, password: string): Promise<void> {
  if (!supabase) throw new Error('云端服务尚未配置');
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOutAdmin(): Promise<void> {
  await supabase?.auth.signOut();
  localStorage.removeItem(PATIENT_ID_KEY);
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  if (!supabase) return false;
  const { data, error } = await supabase.from('admin_users').select('user_id').maybeSingle();
  return !error && Boolean(data);
}

export async function loadAdminDashboard(): Promise<{
  patients: AdminPatient[];
  sessions: AdminTrainingSession[];
  events: AdminActivityEvent[];
}> {
  if (!supabase) return { patients: [], sessions: [], events: [] };
  const [patientsResult, sessionsResult, eventsResult] = await Promise.all([
    supabase.from('patients').select('id,nickname,created_at,last_active_at').order('last_active_at', { ascending: false }),
    supabase
      .from('training_sessions')
      .select('id,patient_id,started_at,completed_at,session_date,status,result_data,updated_at')
      .order('started_at', { ascending: false })
      .limit(100),
    supabase
      .from('activity_events')
      .select('id,patient_id,session_id,event_type,event_data,occurred_at')
      .order('occurred_at', { ascending: false })
      .limit(500),
  ]);

  const error = patientsResult.error ?? sessionsResult.error ?? eventsResult.error;
  if (error) throw error;
  return {
    patients: (patientsResult.data ?? []) as AdminPatient[],
    sessions: (sessionsResult.data ?? []) as AdminTrainingSession[],
    events: (eventsResult.data ?? []) as AdminActivityEvent[],
  };
}

export async function loadAdminTrainingSession(id: string): Promise<AdminTrainingSession | undefined> {
  if (!supabase) return undefined;
  const { data, error } = await supabase
    .from('training_sessions')
    .select('id,patient_id,started_at,completed_at,session_date,status,result_data,updated_at')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as AdminTrainingSession | undefined;
}
