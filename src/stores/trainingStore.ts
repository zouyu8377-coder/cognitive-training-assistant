import { reactive } from 'vue';
import type {
  MathQuestion,
  NumberConnectOrder,
  NumberConnectResult,
  ObjectNamingQuestion,
  OddOneOutQuestion,
  PatientMood,
  PreTrainingStatus,
  ShapeCopyTask,
  TrainingSession,
  TrainingSettings,
} from '../types';
import { todayKey } from '../utils/date';
import {
  clearDraftSession,
  defaultSettings,
  loadDraftSession,
  loadSettings,
  saveDraftSession,
  saveSession,
  saveSettings,
  updateSession,
} from '../utils/storage';
import { generateMathQuestions } from '../utils/mathGenerator';
import {
  generateObjectNamingQuestions,
  generateOddOneOutQuestions,
  generateShapeCopyTask,
  normalizeVisualAssetUrls,
} from '../utils/visualTraining';
import { syncTrainingSession, trackActivity } from '../services/cloudTracking';
import { preloadTrainingImages } from '../utils/imagePreloader';

interface TrainingState {
  settings: TrainingSettings;
  currentSession?: TrainingSession;
}

const state = reactive<TrainingState>({
  settings: loadSettings(),
  currentSession: loadDraftSession(),
});

function newId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useTrainingStore() {
  function ensureVisualTasks(session: TrainingSession) {
    if (!session.objectNamingQuestions?.length) session.objectNamingQuestions = generateObjectNamingQuestions();
    if (!session.shapeCopyTask) session.shapeCopyTask = generateShapeCopyTask();
    if (!session.oddOneOutQuestions?.length) session.oddOneOutQuestions = generateOddOneOutQuestions();
    normalizeVisualAssetUrls(session);
    preloadTrainingImages(session);
  }

  function updateSettings(settings: TrainingSettings) {
    state.settings = { ...settings, cloudTrackingConsent: true };
    saveSettings(state.settings);
    void trackActivity('settings_saved', state.settings.patientNickname, undefined, {
      mathLevel: state.settings.mathLevel,
      mathQuestionCount: state.settings.mathQuestionCount,
      numberConnectLevel: state.settings.numberConnectLevel,
    });
  }

  function startTodaySession(preTrainingStatus: PreTrainingStatus = 'steady') {
    const questions = generateMathQuestions(
      state.settings.mathLevel,
      state.settings.mathQuestionCount,
      state.settings.includeSubtraction,
    );
    state.currentSession = {
      id: newId(),
      patientNickname: state.settings.patientNickname || defaultSettings.patientNickname,
      date: todayKey(),
      startedAt: new Date().toISOString(),
      preTrainingStatus,
      mathQuestions: questions,
      numberConnectOrder: Math.random() > 0.5 ? 'ascending' : 'descending',
      objectNamingQuestions: generateObjectNamingQuestions(),
      shapeCopyTask: generateShapeCopyTask(),
      oddOneOutQuestions: generateOddOneOutQuestions(),
    };
    persistDraft();
    preloadTrainingImages(state.currentSession);
    void syncTrainingSession(state.currentSession);
    void trackActivity('training_started', state.currentSession.patientNickname, state.currentSession, {
      preTrainingStatus,
    });
  }

  function ensureSession() {
    if (!state.currentSession) startTodaySession();
    ensureVisualTasks(state.currentSession as TrainingSession);
    return state.currentSession as TrainingSession;
  }

  function persistDraft() {
    if (state.currentSession) saveDraftSession(JSON.parse(JSON.stringify(state.currentSession)) as TrainingSession);
  }

  function setMathQuestion(index: number, question: MathQuestion) {
    const session = ensureSession();
    session.mathQuestions[index] = question;
    persistDraft();
  }

  function setNumberConnectResult(result: NumberConnectResult) {
    ensureSession().numberConnectResult = result;
    persistDraft();
  }

  function setNumberConnectOrder(order: NumberConnectOrder) {
    ensureSession().numberConnectOrder = order;
    persistDraft();
  }

  function setObjectNamingQuestion(index: number, question: ObjectNamingQuestion) {
    const session = ensureSession();
    if (!session.objectNamingQuestions) session.objectNamingQuestions = generateObjectNamingQuestions();
    session.objectNamingQuestions[index] = question;
    persistDraft();
  }

  function setShapeCopyTask(task: ShapeCopyTask) {
    ensureSession().shapeCopyTask = task;
    persistDraft();
  }

  function setOddOneOutQuestion(index: number, question: OddOneOutQuestion) {
    const session = ensureSession();
    if (!session.oddOneOutQuestions) session.oddOneOutQuestions = generateOddOneOutQuestions();
    session.oddOneOutQuestions[index] = question;
    persistDraft();
  }

  function setWritingStatus(status: TrainingSession['writingStatus'], writingDataUrl?: string) {
    const session = ensureSession();
    session.writingStatus = status;
    session.writingDataUrl = writingDataUrl;
    persistDraft();
  }

  function setSingingStatus(status: TrainingSession['singingStatus']) {
    ensureSession().singingStatus = status;
    persistDraft();
  }

  function finishSession() {
    const session = ensureSession();
    session.completedAt = session.completedAt ?? new Date().toISOString();
    persistDraft();
  }

  async function finishAndSaveSession() {
    if (!state.currentSession) return 'disabled' as const;
    const session = state.currentSession;
    session.completedAt = session.completedAt ?? new Date().toISOString();
    saveSession(JSON.parse(JSON.stringify(session)) as TrainingSession);
    const syncResult = await syncTrainingSession(session);
    await trackActivity('training_completed', session.patientNickname, session);
    clearDraftSession();
    state.currentSession = undefined;
    return syncResult;
  }

  function saveCaregiverResult(patientMood: PatientMood, caregiverNote: string) {
    const session = ensureSession();
    session.patientMood = patientMood;
    session.caregiverNote = caregiverNote;
    session.completedAt = session.completedAt ?? new Date().toISOString();
    saveSession(JSON.parse(JSON.stringify(session)) as TrainingSession);
    void syncTrainingSession(session);
    void trackActivity('caregiver_note_saved', session.patientNickname, session, {
      patientMood,
      hasNote: Boolean(caregiverNote.trim()),
    });
    clearDraftSession();
    state.currentSession = undefined;
  }

  function saveExistingResult(session: TrainingSession, patientMood: PatientMood, caregiverNote: string) {
    const updatedSession = {
      ...session,
      patientMood,
      caregiverNote,
      completedAt: session.completedAt ?? new Date().toISOString(),
    };
    updateSession(updatedSession);
    void syncTrainingSession(updatedSession);
    void trackActivity('caregiver_note_saved', updatedSession.patientNickname, updatedSession, {
      patientMood,
      hasNote: Boolean(caregiverNote.trim()),
    });
  }

  function discardCurrentSession() {
    clearDraftSession();
    state.currentSession = undefined;
  }

  return {
    state,
    updateSettings,
    startTodaySession,
    ensureSession,
    setMathQuestion,
    setNumberConnectResult,
    setNumberConnectOrder,
    setObjectNamingQuestion,
    setShapeCopyTask,
    setOddOneOutQuestion,
    setWritingStatus,
    setSingingStatus,
    finishSession,
    finishAndSaveSession,
    saveCaregiverResult,
    saveExistingResult,
    discardCurrentSession,
  };
}
