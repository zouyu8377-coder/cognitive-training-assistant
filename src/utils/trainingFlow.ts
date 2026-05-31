import type { TrainingSession, TrainingSettings } from '../types';

export function nextTaskRoute(settings: TrainingSettings, session: TrainingSession): string {
  const hasPendingMath = session.mathQuestions.some((question) => question.userAnswer === undefined && !question.skipped);
  if (hasPendingMath) return '/math';
  if (!session.numberConnectResult) return '/number-connect';
  if (settings.includeWritingTask && !session.writingStatus) return '/writing';
  if (settings.includeSingingTask && !session.singingStatus) return '/singing';
  return '/complete';
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
