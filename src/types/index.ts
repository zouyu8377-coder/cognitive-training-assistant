export type MathLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6';
export type NumberConnectLevel = 5 | 10 | 15;
export type PatientMood = 'calm' | 'happy' | 'tired' | 'resistant' | 'need_lower_difficulty';
export type PreTrainingStatus = 'steady' | 'tired' | 'low_mood' | 'not_willing';

export interface TrainingSettings {
  patientNickname: string;
  mathQuestionCount: 5 | 10 | 15 | 20;
  mathLevel: MathLevel;
  includeSubtraction: boolean;
  numberConnectLevel: NumberConnectLevel;
  includeWritingTask: boolean;
  includeSingingTask: boolean;
}

export interface MathQuestion {
  id: string;
  expression: string;
  correctAnswer: number;
  userAnswer?: number;
  isCorrect?: boolean;
  skipped?: boolean;
  timeSpentSeconds?: number;
}

export interface NumberConnectResult {
  level: NumberConnectLevel;
  completed: boolean;
  wrongClicks: number;
  durationSeconds: number;
}

export interface TrainingSession {
  id: string;
  patientNickname: string;
  date: string;
  startedAt: string;
  completedAt?: string;
  preTrainingStatus?: PreTrainingStatus;
  mathQuestions: MathQuestion[];
  numberConnectResult?: NumberConnectResult;
  writingStatus?: 'completed' | 'skipped' | 'help_needed';
  singingStatus?: 'completed_good' | 'completed_tired' | 'skipped' | 'not_done';
  patientMood?: PatientMood;
  caregiverNote?: string;
}

export interface NumberDot {
  value: number;
  x: number;
  y: number;
  completed: boolean;
}
