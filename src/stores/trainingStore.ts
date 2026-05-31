import { reactive } from 'vue';
import type {
  MathQuestion,
  NumberConnectResult,
  PatientMood,
  TrainingSession,
  TrainingSettings,
} from '../types';
import { todayKey } from '../utils/date';
import { defaultSettings, loadSettings, saveSession, saveSettings, updateSession } from '../utils/storage';
import { generateMathQuestions } from '../utils/mathGenerator';

interface TrainingState {
  settings: TrainingSettings;
  currentSession?: TrainingSession;
}

const state = reactive<TrainingState>({
  settings: loadSettings(),
});

function newId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useTrainingStore() {
  function updateSettings(settings: TrainingSettings) {
    state.settings = { ...settings };
    saveSettings(state.settings);
  }

  function startTodaySession() {
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
      mathQuestions: questions,
    };
  }

  function ensureSession() {
    if (!state.currentSession) startTodaySession();
    return state.currentSession as TrainingSession;
  }

  function setMathQuestion(index: number, question: MathQuestion) {
    const session = ensureSession();
    session.mathQuestions[index] = question;
  }

  function setNumberConnectResult(result: NumberConnectResult) {
    ensureSession().numberConnectResult = result;
  }

  function setWritingStatus(status: TrainingSession['writingStatus']) {
    ensureSession().writingStatus = status;
  }

  function setSingingStatus(status: TrainingSession['singingStatus']) {
    ensureSession().singingStatus = status;
  }

  function finishSession() {
    const session = ensureSession();
    session.completedAt = session.completedAt ?? new Date().toISOString();
  }

  function saveCaregiverResult(patientMood: PatientMood, caregiverNote: string) {
    const session = ensureSession();
    session.patientMood = patientMood;
    session.caregiverNote = caregiverNote;
    session.completedAt = session.completedAt ?? new Date().toISOString();
    saveSession(JSON.parse(JSON.stringify(session)) as TrainingSession);
  }

  function saveExistingResult(session: TrainingSession, patientMood: PatientMood, caregiverNote: string) {
    updateSession({
      ...session,
      patientMood,
      caregiverNote,
      completedAt: session.completedAt ?? new Date().toISOString(),
    });
  }

  return {
    state,
    updateSettings,
    startTodaySession,
    ensureSession,
    setMathQuestion,
    setNumberConnectResult,
    setWritingStatus,
    setSingingStatus,
    finishSession,
    saveCaregiverResult,
    saveExistingResult,
  };
}
