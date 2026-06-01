import type { ObjectNamingQuestion, OddOneOutQuestion, ShapeCopyTask } from '../types';

const objectBank: Array<Omit<ObjectNamingQuestion, 'id'>> = [
  { name: '斑马', aliases: ['斑马'], icon: 'zebra' },
  { name: '尺子', aliases: ['尺子', '直尺'], icon: 'ruler' },
  { name: '桌子', aliases: ['桌子', '书桌', '餐桌'], icon: 'table' },
  { name: '苹果', aliases: ['苹果'], icon: 'apple' },
  { name: '雨伞', aliases: ['雨伞', '伞'], icon: 'umbrella' },
  { name: '杯子', aliases: ['杯子', '水杯'], icon: 'cup' },
  { name: '钥匙', aliases: ['钥匙'], icon: 'key' },
  { name: '鞋子', aliases: ['鞋子'], icon: 'shoe' },
];

const shapes: Array<Pick<ShapeCopyTask, 'shapeName' | 'shapeKind'>> = [
  { shapeName: '圆形', shapeKind: 'circle' },
  { shapeName: '矩形', shapeKind: 'rectangle' },
  { shapeName: '三角形', shapeKind: 'triangle' },
];

const oddBank = [
  { prompt: '找出不一样的数字', itemLabel: '15', oddLabel: '12' },
  { prompt: '找出不一样的字母', itemLabel: 'T', oddLabel: '⊥' },
  { prompt: '找出不一样的汉字', itemLabel: '千', oddLabel: '干' },
  { prompt: '找出不一样的数字', itemLabel: '180', oddLabel: 'IBO' },
  { prompt: '找出不一样的图形', itemLabel: '○', oddLabel: '◇' },
  { prompt: '找出不一样的方向', itemLabel: '↑', oddLabel: '↓' },
];

function randomId(prefix: string, index: number): string {
  return `${prefix}-${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`;
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export function generateObjectNamingQuestions(count = 3): ObjectNamingQuestion[] {
  return shuffle(objectBank)
    .slice(0, count)
    .map((item, index) => ({ ...item, id: randomId('object', index) }));
}

export function generateShapeCopyTask(): ShapeCopyTask {
  const shape = shuffle(shapes)[0];
  return {
    id: randomId('shape', 0),
    ...shape,
    redrawCount: 0,
  };
}

export function generateOddOneOutQuestions(count = 3): OddOneOutQuestion[] {
  return shuffle(oddBank)
    .slice(0, count)
    .map((item, index) => {
      const answerIndex = Math.floor(Math.random() * 9);
      return {
        id: randomId('odd', index),
        ...item,
        answerIndex,
        grid: Array.from({ length: 9 }, (_, gridIndex) => (gridIndex === answerIndex ? item.oddLabel : item.itemLabel)),
      };
    });
}

export function normalizeAnswer(value: string): string {
  return value.replace(/\s/g, '').replace(/[，。,.！？!?]/g, '').toLowerCase();
}

export function isObjectAnswerCorrect(question: ObjectNamingQuestion, answer: string): boolean {
  const normalized = normalizeAnswer(answer);
  return question.aliases.some((alias) => normalized.includes(normalizeAnswer(alias)));
}
