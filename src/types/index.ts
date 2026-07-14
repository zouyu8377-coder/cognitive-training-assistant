export type MathLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
export type NumberConnectLevel = 5 | 10 | 15;
export type PatientMood = 'calm' | 'happy' | 'tired' | 'resistant' | 'need_lower_difficulty';
export type PreTrainingStatus = 'steady' | 'tired' | 'low_mood' | 'not_willing';
export type ShapeType = 'circle' | 'rectangle' | 'triangle';
export type DrawingLevel = 'excellent' | 'good' | 'completed' | 'try_again';
export type NumberConnectOrder = 'ascending' | 'descending';

export interface TrainingSettings {
  patientNickname: string;
  cloudTrackingConsent: boolean;
  mathQuestionCount: 10 | 20 | 30;
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
  order?: NumberConnectOrder;
  completed: boolean;
  wrongClicks: number;
  durationSeconds: number;
}

export interface ObjectNamingQuestion {
  id: string;
  name: string;
  aliases: string[];
  icon: string;
  userAnswer?: string;
  inputMethod?: 'voice' | 'handwriting' | 'skipped';
  drawingDataUrl?: string;
  isCorrect?: boolean;
  skipped?: boolean;
  timeSpentSeconds?: number;
}

export interface ShapeCopyTask {
  id: string;
  shapeName: string;
  shapeKind: ShapeType;
  referenceImageUrl?: string;
  completed?: boolean;
  skipped?: boolean;
  redrawCount: number;
  drawingDataUrl?: string;
  durationSeconds?: number;
  attempts?: ShapeDrawingAttempt[];
  selectedAttemptId?: string;
}

export interface DrawingPoint {
  x: number;
  y: number;
  t: number;
  strokeId: string;
}

export interface ShapeDrawingMetrics {
  shapeType: ShapeType;
  durationSeconds: number;
  strokeCount: number;
  pointCount: number;
  coverageRate?: number;
  precisionRate?: number;
  closureRate?: number;
  aspectScore?: number;
  extraStrokeRate?: number;
  radialError?: number;
  circularCoverage?: number;
  score: number;
  level: DrawingLevel;
  feedbackText: string;
  caregiverText: string;
}

export interface ShapeDrawingAttempt {
  id: string;
  shapeType: ShapeType;
  points: DrawingPoint[];
  imageDataUrl?: string;
  metrics: ShapeDrawingMetrics;
  createdAt: string;
}

export interface OddOneOutQuestion {
  id: string;
  prompt: string;
  itemLabel: string;
  oddLabel: string;
  grid: string[];
  answerIndex: number;
  selectedIndex?: number;
  isCorrect?: boolean;
  skipped?: boolean;
  timeSpentSeconds?: number;
}

export interface TrainingSession {
  id: string;
  patientNickname: string;
  date: string;
  startedAt: string;
  completedAt?: string;
  preTrainingStatus?: PreTrainingStatus;
  mathQuestions: MathQuestion[];
  numberConnectOrder?: NumberConnectOrder;
  numberConnectResult?: NumberConnectResult;
  objectNamingQuestions?: ObjectNamingQuestion[];
  shapeCopyTask?: ShapeCopyTask;
  oddOneOutQuestions?: OddOneOutQuestion[];
  writingStatus?: 'completed' | 'skipped' | 'help_needed';
  writingDataUrl?: string;
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
