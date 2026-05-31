import type { PatientMood, PreTrainingStatus, TrainingSession } from '../types';

export const preTrainingStatusText: Record<PreTrainingStatus, string> = {
  steady: '平稳',
  tired: '有些疲劳',
  low_mood: '情绪一般',
  not_willing: '不太想做',
};

export const patientMoodText: Record<PatientMood, string> = {
  calm: '平稳',
  happy: '愉快',
  tired: '疲劳',
  resistant: '抵触',
  need_lower_difficulty: '需要降低难度',
};

export function buildNextTrainingSuggestions(session: TrainingSession): string[] {
  const total = session.mathQuestions.length;
  const answered = session.mathQuestions.filter((question) => !question.skipped).length;
  const skipped = session.mathQuestions.filter((question) => question.skipped).length;
  const correct = session.mathQuestions.filter((question) => question.isCorrect).length;
  const suggestions: string[] = [];

  if (skipped >= Math.max(3, Math.ceil(total * 0.35))) {
    suggestions.push('本次数学题暂未作答较多。下次可以减少题量，优先让练习更容易完成。');
  }

  if (answered >= 3 && correct / answered < 0.6) {
    suggestions.push('本次数学题可能偏难。下次可以选择低一档数学难度，先保持轻松参与。');
  }

  if (!session.numberConnectResult?.completed || (session.numberConnectResult?.wrongClicks ?? 0) >= 3) {
    suggestions.push('数字顺序练习出现多次重新尝试。下次可以先选择更少数字，例如 1-5 或 1-10。');
  }

  const objectQuestions = session.objectNamingQuestions ?? [];
  const objectAnswered = objectQuestions.filter((question) => !question.skipped).length;
  const objectCorrect = objectQuestions.filter((question) => question.isCorrect).length;
  if (objectAnswered > 0 && objectCorrect / objectAnswered < 0.6) {
    suggestions.push('看图说名称可以先选更熟悉的常见物品，鼓励表达和尝试。');
  }

  const oddQuestions = session.oddOneOutQuestions ?? [];
  const oddAnswered = oddQuestions.filter((question) => !question.skipped).length;
  const oddCorrect = oddQuestions.filter((question) => question.isCorrect).length;
  if (oddAnswered > 0 && oddCorrect / oddAnswered < 0.6) {
    suggestions.push('找不同任务可以放慢节奏，先从图形或数字数量较少的题开始。');
  }

  if (session.preTrainingStatus === 'tired' || session.preTrainingStatus === 'low_mood') {
    suggestions.push('训练前状态一般时，可以改成短练习，只保留最容易完成的任务。');
  }

  if (session.preTrainingStatus === 'not_willing') {
    suggestions.push('如果今天不太想做，可以先只完成一个小任务，把参与意愿放在前面。');
  }

  if (session.patientMood === 'tired' || session.patientMood === 'resistant' || session.patientMood === 'need_lower_difficulty') {
    suggestions.push('本次家属标记了疲劳、抵触或需要降低难度。下次可以适当降低题量或难度。');
  }

  if (suggestions.length === 0) {
    suggestions.push('本次记录较平稳。下次可以继续保持短时间、低压力的练习节奏。');
  }

  return suggestions;
}
