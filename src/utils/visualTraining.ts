import type { ObjectNamingQuestion, OddOneOutQuestion, ShapeCopyTask } from '../types';

const objectImageBase = `${import.meta.env.BASE_URL}object-images/`;

const objectBank: Array<Omit<ObjectNamingQuestion, 'id'>> = [
  { name: '图片 1', aliases: [], icon: `${objectImageBase}eagle.jpg` },
  { name: '图片 2', aliases: [], icon: `${objectImageBase}cat.jpg` },
  { name: '图片 3', aliases: [], icon: `${objectImageBase}dog.jpg` },
  { name: '图片 4', aliases: [], icon: `${objectImageBase}deer.jpg` },
];

const shapes: Array<Pick<ShapeCopyTask, 'shapeName' | 'shapeKind'>> = [
  { shapeName: '圆形', shapeKind: 'circle' },
  { shapeName: '矩形', shapeKind: 'rectangle' },
  { shapeName: '三角形', shapeKind: 'triangle' },
];

const oddBank = [
  { prompt: '找出不一样的数字', itemLabel: '15', oddLabel: '12' },
  { prompt: '找出不一样的数字', itemLabel: '68', oddLabel: '86' },
  { prompt: '找出不一样的数字', itemLabel: '36', oddLabel: '38' },
  { prompt: '找出不一样的数字', itemLabel: '909', oddLabel: '606' },
  { prompt: '找出不一样的字母', itemLabel: 'T', oddLabel: '⊥' },
  { prompt: '找出不一样的字母', itemLabel: 'E', oddLabel: 'F' },
  { prompt: '找出不一样的字母', itemLabel: 'b', oddLabel: 'd' },
  { prompt: '找出不一样的字母', itemLabel: 'p', oddLabel: 'q' },
  { prompt: '找出不一样的汉字', itemLabel: '千', oddLabel: '干' },
  { prompt: '找出不一样的汉字', itemLabel: '日', oddLabel: '目' },
  { prompt: '找出不一样的汉字', itemLabel: '土', oddLabel: '士' },
  { prompt: '找出不一样的汉字', itemLabel: '未', oddLabel: '末' },
  { prompt: '找出不一样的数字', itemLabel: '180', oddLabel: 'IBO' },
  { prompt: '找出不一样的图形', itemLabel: '○', oddLabel: '◇' },
  { prompt: '找出不一样的图形', itemLabel: '□', oddLabel: '△' },
  { prompt: '找出不一样的图形', itemLabel: '＋', oddLabel: '×' },
  { prompt: '找出不一样的图形', itemLabel: '●', oddLabel: '○' },
  { prompt: '找出不一样的方向', itemLabel: '↑', oddLabel: '↓' },
  { prompt: '找出不一样的方向', itemLabel: '←', oddLabel: '→' },
  { prompt: '找出不一样的方向', itemLabel: '↗', oddLabel: '↘' },
  { prompt: '找出不一样的符号', itemLabel: '✓', oddLabel: '∨' },
  { prompt: '找出不一样的符号', itemLabel: '＝', oddLabel: '≠' },
];

function randomId(prefix: string, index: number): string {
  return `${prefix}-${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`;
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export function generateObjectNamingQuestions(count = 4): ObjectNamingQuestion[] {
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
