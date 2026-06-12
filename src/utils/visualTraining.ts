import type { ObjectNamingQuestion, OddOneOutQuestion, ShapeCopyTask, TrainingSession } from '../types';

const objectImageBase = `${import.meta.env.BASE_URL}object-images/`;
const shapeCopyImageBase = `${import.meta.env.BASE_URL}shape-copy-images/`;

const objectBank: Array<Omit<ObjectNamingQuestion, 'id'>> = [
  { name: '图片 1', aliases: [], icon: `${objectImageBase}object-01.webp` },
  { name: '图片 2', aliases: [], icon: `${objectImageBase}object-02.webp` },
  { name: '图片 3', aliases: [], icon: `${objectImageBase}object-03.webp` },
  { name: '图片 4', aliases: [], icon: `${objectImageBase}object-04.webp` },
  { name: '仙人掌', aliases: ['仙人掌'], icon: `${objectImageBase}object-05.webp` },
  { name: '台灯', aliases: ['台灯', '灯'], icon: `${objectImageBase}object-06.webp` },
  { name: '圆规', aliases: ['圆规'], icon: `${objectImageBase}object-07.webp` },
  { name: '孔雀', aliases: ['孔雀'], icon: `${objectImageBase}object-08.webp` },
  { name: '尺子', aliases: ['尺子', '直尺'], icon: `${objectImageBase}object-09.webp` },
  { name: '山羊', aliases: ['山羊', '羊'], icon: `${objectImageBase}object-10.webp` },
  { name: '松鼠', aliases: ['松鼠'], icon: `${objectImageBase}object-11.webp` },
  { name: '汽车', aliases: ['汽车', '车'], icon: `${objectImageBase}object-12.webp` },
  { name: '牙刷', aliases: ['牙刷'], icon: `${objectImageBase}object-13.webp` },
  { name: '狮子', aliases: ['狮子'], icon: `${objectImageBase}object-14.webp` },
  { name: '猫咪', aliases: ['猫咪', '猫'], icon: `${objectImageBase}object-15.webp` },
  { name: '羽毛球', aliases: ['羽毛球'], icon: `${objectImageBase}object-16.webp` },
  { name: '老虎', aliases: ['老虎', '虎'], icon: `${objectImageBase}object-17.webp` },
  { name: '自行车', aliases: ['自行车', '单车'], icon: `${objectImageBase}object-18.webp` },
  { name: '蘑菇', aliases: ['蘑菇'], icon: `${objectImageBase}object-19.webp` },
  { name: '足球', aliases: ['足球'], icon: `${objectImageBase}object-20.webp` },
  { name: '量角器', aliases: ['量角器'], icon: `${objectImageBase}object-21.webp` },
  { name: '钢琴', aliases: ['钢琴', '琴'], icon: `${objectImageBase}object-22.webp` },
  { name: '铅笔', aliases: ['铅笔', '笔'], icon: `${objectImageBase}object-23.webp` },
  { name: '靴子', aliases: ['靴子', '鞋子'], icon: `${objectImageBase}object-24.webp` },
  { name: '风扇', aliases: ['风扇'], icon: `${objectImageBase}object-25.webp` },
  { name: '飞机', aliases: ['飞机'], icon: `${objectImageBase}object-26.webp` },
  { name: '马甲', aliases: ['马甲', '背心'], icon: `${objectImageBase}object-27.webp` },
  { name: '骆驼', aliases: ['骆驼'], icon: `${objectImageBase}object-28.webp` },
  { name: '鹦鹉', aliases: ['鹦鹉', '鸟'], icon: `${objectImageBase}object-29.webp` },
];

const shapes: Array<Pick<ShapeCopyTask, 'shapeName' | 'shapeKind' | 'referenceImageUrl'>> = [
  { shapeName: '圆形', shapeKind: 'circle' },
  { shapeName: '矩形', shapeKind: 'rectangle' },
  { shapeName: '三角形', shapeKind: 'triangle' },
  { shapeName: '跟画图 1', shapeKind: 'rectangle', referenceImageUrl: `${shapeCopyImageBase}shape-01.webp` },
  { shapeName: '跟画图 2', shapeKind: 'rectangle', referenceImageUrl: `${shapeCopyImageBase}shape-02.webp` },
  { shapeName: '跟画图 3', shapeKind: 'rectangle', referenceImageUrl: `${shapeCopyImageBase}shape-03.webp` },
  { shapeName: '跟画图 4', shapeKind: 'rectangle', referenceImageUrl: `${shapeCopyImageBase}shape-04.webp` },
];

const objectIconByName = new Map(objectBank.map((item) => [item.name, item.icon]));
const shapeReferenceByName = new Map(shapes.map((item) => [item.shapeName, item.referenceImageUrl]));

export function normalizeVisualAssetUrls(session: TrainingSession): void {
  session.objectNamingQuestions?.forEach((question) => {
    question.icon = objectIconByName.get(question.name) ?? question.icon;
  });

  if (session.shapeCopyTask) {
    session.shapeCopyTask.referenceImageUrl =
      shapeReferenceByName.get(session.shapeCopyTask.shapeName) ?? session.shapeCopyTask.referenceImageUrl;
  }
}

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
