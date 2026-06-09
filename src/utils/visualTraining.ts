import type { ObjectNamingQuestion, OddOneOutQuestion, ShapeCopyTask } from '../types';

const objectImageBase = `${import.meta.env.BASE_URL}object-images/`;
const shapeCopyImageBase = `${import.meta.env.BASE_URL}shape-copy-images/`;

function publicImageUrl(base: string, fileName: string): string {
  return `${base}${encodeURIComponent(fileName)}`;
}

const objectBank: Array<Omit<ObjectNamingQuestion, 'id'>> = [
  { name: '图片 1', aliases: [], icon: `${objectImageBase}eagle.jpg` },
  { name: '图片 2', aliases: [], icon: `${objectImageBase}cat.jpg` },
  { name: '图片 3', aliases: [], icon: `${objectImageBase}dog.jpg` },
  { name: '图片 4', aliases: [], icon: `${objectImageBase}deer.jpg` },
  { name: '仙人掌', aliases: ['仙人掌'], icon: publicImageUrl(objectImageBase, '仙人掌.png') },
  { name: '台灯', aliases: ['台灯', '灯'], icon: publicImageUrl(objectImageBase, '台灯.png') },
  { name: '圆规', aliases: ['圆规'], icon: publicImageUrl(objectImageBase, '圆规.png') },
  { name: '孔雀', aliases: ['孔雀'], icon: publicImageUrl(objectImageBase, '孔雀.png') },
  { name: '尺子', aliases: ['尺子', '直尺'], icon: publicImageUrl(objectImageBase, '尺子.png') },
  { name: '山羊', aliases: ['山羊', '羊'], icon: publicImageUrl(objectImageBase, '山羊.png') },
  { name: '松鼠', aliases: ['松鼠'], icon: publicImageUrl(objectImageBase, '松鼠.png') },
  { name: '汽车', aliases: ['汽车', '车'], icon: publicImageUrl(objectImageBase, '汽车.png') },
  { name: '牙刷', aliases: ['牙刷'], icon: publicImageUrl(objectImageBase, '牙刷.png') },
  { name: '狮子', aliases: ['狮子'], icon: publicImageUrl(objectImageBase, '狮子.png') },
  { name: '猫咪', aliases: ['猫咪', '猫'], icon: publicImageUrl(objectImageBase, '猫咪.png') },
  { name: '羽毛球', aliases: ['羽毛球'], icon: publicImageUrl(objectImageBase, '羽毛球.png') },
  { name: '老虎', aliases: ['老虎', '虎'], icon: publicImageUrl(objectImageBase, '老虎.png') },
  { name: '自行车', aliases: ['自行车', '单车'], icon: publicImageUrl(objectImageBase, '自行车.png') },
  { name: '蘑菇', aliases: ['蘑菇'], icon: publicImageUrl(objectImageBase, '蘑菇.png') },
  { name: '足球', aliases: ['足球'], icon: publicImageUrl(objectImageBase, '足球.png') },
  { name: '量角器', aliases: ['量角器'], icon: publicImageUrl(objectImageBase, '量角器.png') },
  { name: '钢琴', aliases: ['钢琴', '琴'], icon: publicImageUrl(objectImageBase, '钢琴.png') },
  { name: '铅笔', aliases: ['铅笔', '笔'], icon: publicImageUrl(objectImageBase, '铅笔.png') },
  { name: '靴子', aliases: ['靴子', '鞋子'], icon: publicImageUrl(objectImageBase, '靴子.png') },
  { name: '风扇', aliases: ['风扇'], icon: publicImageUrl(objectImageBase, '风扇.png') },
  { name: '飞机', aliases: ['飞机'], icon: publicImageUrl(objectImageBase, '飞机.png') },
  { name: '马甲', aliases: ['马甲', '背心'], icon: publicImageUrl(objectImageBase, '马甲.png') },
  { name: '骆驼', aliases: ['骆驼'], icon: publicImageUrl(objectImageBase, '骆驼.png') },
  { name: '鹦鹉', aliases: ['鹦鹉', '鸟'], icon: publicImageUrl(objectImageBase, '鹦鹉.png') },
];

const shapes: Array<Pick<ShapeCopyTask, 'shapeName' | 'shapeKind' | 'referenceImageUrl'>> = [
  { shapeName: '圆形', shapeKind: 'circle' },
  { shapeName: '矩形', shapeKind: 'rectangle' },
  { shapeName: '三角形', shapeKind: 'triangle' },
  { shapeName: '跟画图 1', shapeKind: 'rectangle', referenceImageUrl: publicImageUrl(shapeCopyImageBase, '1-跟画.png') },
  { shapeName: '跟画图 2', shapeKind: 'rectangle', referenceImageUrl: publicImageUrl(shapeCopyImageBase, '2-跟画.png') },
  { shapeName: '跟画图 3', shapeKind: 'rectangle', referenceImageUrl: publicImageUrl(shapeCopyImageBase, '3-跟画.png') },
  { shapeName: '跟画图 4', shapeKind: 'rectangle', referenceImageUrl: publicImageUrl(shapeCopyImageBase, '4-跟画.png') },
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
