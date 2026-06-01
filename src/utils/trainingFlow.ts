import type { ObjectNamingQuestion, TrainingSession, TrainingSettings } from '../types';

export function nextTaskRoute(settings: TrainingSettings, session: TrainingSession): string {
  const hasPendingMath = session.mathQuestions.some((question) => question.userAnswer === undefined && !question.skipped);
  const objectQuestions = session.objectNamingQuestions ?? [];
  const hasPendingObjects = objectQuestions.some((question) => !isObjectQuestionHandled(question));
  const oddQuestions = session.oddOneOutQuestions ?? [];
  const hasPendingOdd = oddQuestions.some((question) => question.selectedIndex === undefined && !question.skipped);
  if (hasPendingMath) return '/math';
  if (!session.numberConnectResult) return '/number-connect';
  if (hasPendingObjects) return '/object-naming';
  if (!session.shapeCopyTask?.completed && !session.shapeCopyTask?.skipped) return '/shape-copy';
  if (hasPendingOdd) return '/odd-one-out';
  if (settings.includeWritingTask && !session.writingStatus) return '/writing';
  if (settings.includeSingingTask && !session.singingStatus) return '/singing';
  return '/complete';
}

export function firstPendingObjectIndex(session: TrainingSession): number {
  const questions = session.objectNamingQuestions ?? [];
  const pendingIndex = questions.findIndex((question) => !isObjectQuestionHandled(question));
  return pendingIndex >= 0 ? pendingIndex : Math.max(0, questions.length - 1);
}

export function firstPendingOddIndex(session: TrainingSession): number {
  const questions = session.oddOneOutQuestions ?? [];
  const pendingIndex = questions.findIndex((question) => question.selectedIndex === undefined && !question.skipped);
  return pendingIndex >= 0 ? pendingIndex : Math.max(0, questions.length - 1);
}

export function firstPendingMathIndex(session: TrainingSession): number {
  const pendingIndex = session.mathQuestions.findIndex(
    (question) => question.userAnswer === undefined && !question.skipped,
  );
  return pendingIndex >= 0 ? pendingIndex : session.mathQuestions.length - 1;
}

export function isSessionComplete(settings: TrainingSettings, session: TrainingSession): boolean {
  return nextTaskRoute(settings, session) === '/complete' && Boolean(session.completedAt);
}

function isObjectQuestionHandled(question: ObjectNamingQuestion): boolean {
  return Boolean(question.skipped || question.userAnswer || question.drawingDataUrl || question.inputMethod === 'handwriting');
}
