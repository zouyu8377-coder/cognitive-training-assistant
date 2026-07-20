import type { ObjectNamingQuestion, OddOneOutQuestion, ShapeCopyTask, TrainingSession } from '../types';

const objectImageBase = `${import.meta.env.BASE_URL}object-images/`;
const shapeCopyImageBase = `${import.meta.env.BASE_URL}shape-copy-images/`;
const oddOneOutImageBase = `${import.meta.env.BASE_URL}odd-one-out-images/`;

const objectItems = [
  { name: 'T恤', icon: `${objectImageBase}object-001.webp` },
  { name: '乌龟', icon: `${objectImageBase}object-002.webp` },
  { name: '乒乓球拍', icon: `${objectImageBase}object-003.webp` },
  { name: '仙人掌', icon: `${objectImageBase}object-004.webp` },
  { name: '企鹅', icon: `${objectImageBase}object-005.webp` },
  { name: '兔子', icon: `${objectImageBase}object-006.webp` },
  { name: '公鸡', icon: `${objectImageBase}object-007.webp` },
  { name: '刺猬', icon: `${objectImageBase}object-008.webp` },
  { name: '剪刀', icon: `${objectImageBase}object-009.webp` },
  { name: '双肩包', icon: `${objectImageBase}object-010.webp` },
  { name: '台灯', icon: `${objectImageBase}object-011.webp` },
  { name: '圆规', icon: `${objectImageBase}object-012.webp` },
  { name: '外套', icon: `${objectImageBase}object-013.webp` },
  { name: '大衣', icon: `${objectImageBase}object-014.webp` },
  { name: '大象', icon: `${objectImageBase}object-015.webp` },
  { name: '孔雀', icon: `${objectImageBase}object-016.webp` },
  { name: '尺子', icon: `${objectImageBase}object-017.webp` },
  { name: '山羊', icon: `${objectImageBase}object-018.webp` },
  { name: '扳子', icon: `${objectImageBase}object-019.webp` },
  { name: '拖鞋', icon: `${objectImageBase}object-020.webp` },
  { name: '收音机', icon: `${objectImageBase}object-021.webp` },
  { name: '斑马', icon: `${objectImageBase}object-022.webp` },
  { name: '斧头', icon: `${objectImageBase}object-023.webp` },
  { name: '本子', icon: `${objectImageBase}object-024.webp` },
  { name: '松鼠', icon: `${objectImageBase}object-025.webp` },
  { name: '梨', icon: `${objectImageBase}object-026.webp` },
  { name: '樱桃', icon: `${objectImageBase}object-027.webp` },
  { name: '水母', icon: `${objectImageBase}object-028.webp` },
  { name: '汽车', icon: `${objectImageBase}object-029.webp` },
  { name: '海狮', icon: `${objectImageBase}object-030.webp` },
  { name: '海豚', icon: `${objectImageBase}object-031.webp` },
  { name: '海马', icon: `${objectImageBase}object-032.webp` },
  { name: '火车', icon: `${objectImageBase}object-033.webp` },
  { name: '熊猫', icon: `${objectImageBase}object-034.webp` },
  { name: '燕子', icon: `${objectImageBase}object-035.webp` },
  { name: '牙刷', icon: `${objectImageBase}object-036.webp` },
  { name: '牛', icon: `${objectImageBase}object-037.webp` },
  { name: '狐狸', icon: `${objectImageBase}object-038.webp` },
  { name: '狗', icon: `${objectImageBase}object-039.webp` },
  { name: '狮子', icon: `${objectImageBase}object-040.webp` },
  { name: '猪', icon: `${objectImageBase}object-041.webp` },
  { name: '猫咪', icon: `${objectImageBase}object-042.webp` },
  { name: '猴', icon: `${objectImageBase}object-043.webp` },
  { name: '电动车', icon: `${objectImageBase}object-044.webp` },
  { name: '电风扇', icon: `${objectImageBase}object-045.webp` },
  { name: '白菜', icon: `${objectImageBase}object-046.webp` },
  { name: '皮带', icon: `${objectImageBase}object-047.webp` },
  { name: '短裤', icon: `${objectImageBase}object-048.webp` },
  { name: '章鱼', icon: `${objectImageBase}object-049.webp` },
  { name: '篮球', icon: `${objectImageBase}object-050.webp` },
  { name: '羽毛球', icon: `${objectImageBase}object-051.webp` },
  { name: '老虎', icon: `${objectImageBase}object-052.webp` },
  { name: '老鼠', icon: `${objectImageBase}object-053.webp` },
  { name: '自行车', icon: `${objectImageBase}object-054.webp` },
  { name: '苹果', icon: `${objectImageBase}object-055.webp` },
  { name: '茄子', icon: `${objectImageBase}object-056.webp` },
  { name: '菠萝', icon: `${objectImageBase}object-057.webp` },
  { name: '葡萄', icon: `${objectImageBase}object-058.webp` },
  { name: '蘑菇', icon: `${objectImageBase}object-059.webp` },
  { name: '虾米', icon: `${objectImageBase}object-060.webp` },
  { name: '蚂蚱', icon: `${objectImageBase}object-061.webp` },
  { name: '蛇', icon: `${objectImageBase}object-062.webp` },
  { name: '蜗牛', icon: `${objectImageBase}object-063.webp` },
  { name: '蜘蛛', icon: `${objectImageBase}object-064.webp` },
  { name: '蜻蜓', icon: `${objectImageBase}object-065.webp` },
  { name: '蝙蝠', icon: `${objectImageBase}object-066.webp` },
  { name: '蝴蝶', icon: `${objectImageBase}object-067.webp` },
  { name: '螃蟹', icon: `${objectImageBase}object-068.webp` },
  { name: '螳螂', icon: `${objectImageBase}object-069.webp` },
  { name: '行李箱', icon: `${objectImageBase}object-070.webp` },
  { name: '袋鼠', icon: `${objectImageBase}object-071.webp` },
  { name: '袜子', icon: `${objectImageBase}object-072.webp` },
  { name: '裙子', icon: `${objectImageBase}object-073.webp` },
  { name: '裤子', icon: `${objectImageBase}object-074.webp` },
  { name: '西蓝花', icon: `${objectImageBase}object-075.webp` },
  { name: '足球', icon: `${objectImageBase}object-076.webp` },
  { name: '连衣裙', icon: `${objectImageBase}object-077.webp` },
  { name: '遥控器', icon: `${objectImageBase}object-078.webp` },
  { name: '量角器', icon: `${objectImageBase}object-079.webp` },
  { name: '金鱼', icon: `${objectImageBase}object-080.webp` },
  { name: '钢琴', icon: `${objectImageBase}object-081.webp` },
  { name: '铅笔', icon: `${objectImageBase}object-082.webp` },
  { name: '锯子', icon: `${objectImageBase}object-083.webp` },
  { name: '长颈鹿', icon: `${objectImageBase}object-084.webp` },
  { name: '青蛙', icon: `${objectImageBase}object-085.webp` },
  { name: '靴子', icon: `${objectImageBase}object-086.webp` },
  { name: '风扇', icon: `${objectImageBase}object-087.webp` },
  { name: '飞机', icon: `${objectImageBase}object-088.webp` },
  { name: '香蕉', icon: `${objectImageBase}object-089.webp` },
  { name: '马甲', icon: `${objectImageBase}object-090.webp` },
  { name: '骆驼', icon: `${objectImageBase}object-091.webp` },
  { name: '高跟鞋', icon: `${objectImageBase}object-092.webp` },
  { name: '鱼', icon: `${objectImageBase}object-093.webp` },
  { name: '鲨鱼', icon: `${objectImageBase}object-094.webp` },
  { name: '鳄鱼', icon: `${objectImageBase}object-095.webp` },
  { name: '鸭子', icon: `${objectImageBase}object-096.webp` },
  { name: '鹅', icon: `${objectImageBase}object-097.webp` },
  { name: '鹦鹉', icon: `${objectImageBase}object-098.webp` },
  { name: '书桌', icon: `${objectImageBase}object-099.webp` },
  { name: '冰淇淋', icon: `${objectImageBase}object-100.webp` },
  { name: '凳子', icon: `${objectImageBase}object-101.webp` },
  { name: '凳子', icon: `${objectImageBase}object-102.webp` },
  { name: '吹风机', icon: `${objectImageBase}object-103.webp` },
  { name: '塔吊', icon: `${objectImageBase}object-104.webp` },
  { name: '大萝卜', icon: `${objectImageBase}object-105.webp` },
  { name: '姜', icon: `${objectImageBase}object-106.webp` },
  { name: '小桥', icon: `${objectImageBase}object-107.webp` },
  { name: '小麦', icon: `${objectImageBase}object-108.webp` },
  { name: '帽子', icon: `${objectImageBase}object-109.webp` },
  { name: '床', icon: `${objectImageBase}object-110.webp` },
  { name: '扇子', icon: `${objectImageBase}object-111.webp` },
  { name: '扇贝', icon: `${objectImageBase}object-112.webp` },
  { name: '手表', icon: `${objectImageBase}object-113.webp` },
  { name: '打火机', icon: `${objectImageBase}object-114.webp` },
  { name: '指南针', icon: `${objectImageBase}object-115.webp` },
  { name: '梳子', icon: `${objectImageBase}object-116.webp` },
  { name: '棒球帽', icon: `${objectImageBase}object-117.webp` },
  { name: '椰子树', icon: `${objectImageBase}object-118.webp` },
  { name: '水龙头', icon: `${objectImageBase}object-119.webp` },
  { name: '汉堡包', icon: `${objectImageBase}object-120.webp` },
  { name: '沙发', icon: `${objectImageBase}object-121.webp` },
  { name: '洋葱', icon: `${objectImageBase}object-122.webp` },
  { name: '洗衣机', icon: `${objectImageBase}object-123.webp` },
  { name: '海螺', icon: `${objectImageBase}object-124.webp` },
  { name: '游泳圈', icon: `${objectImageBase}object-125.webp` },
  { name: '滑梯', icon: `${objectImageBase}object-126.webp` },
  { name: '灯笼', icon: `${objectImageBase}object-127.webp` },
  { name: '照相机', icon: `${objectImageBase}object-128.webp` },
  { name: '牡丹', icon: `${objectImageBase}object-129.webp` },
  { name: '牵牛花', icon: `${objectImageBase}object-130.webp` },
  { name: '玉米', icon: `${objectImageBase}object-131.webp` },
  { name: '电脑', icon: `${objectImageBase}object-132.webp` },
  { name: '眼镜', icon: `${objectImageBase}object-133.webp` },
  { name: '秋千', icon: `${objectImageBase}object-134.webp` },
  { name: '竹子', icon: `${objectImageBase}object-135.webp` },
  { name: '竹笋', icon: `${objectImageBase}object-136.webp` },
  { name: '箩筐', icon: `${objectImageBase}object-137.webp` },
  { name: '荷花', icon: `${objectImageBase}object-138.webp` },
  { name: '轮椅', icon: `${objectImageBase}object-139.webp` },
  { name: '辣椒', icon: `${objectImageBase}object-140.webp` },
  { name: '钥匙', icon: `${objectImageBase}object-141.webp` },
  { name: '铁锹', icon: `${objectImageBase}object-142.webp` },
  { name: '长城', icon: `${objectImageBase}object-143.webp` },
  { name: '闹钟', icon: `${objectImageBase}object-144.webp` },
  { name: '雨伞', icon: `${objectImageBase}object-145.webp` },
  { name: '风车', icon: `${objectImageBase}object-146.webp` },
  { name: '马扎', icon: `${objectImageBase}object-147.webp` },
  { name: '马桶', icon: `${objectImageBase}object-148.webp` },
  { name: '麦克风', icon: `${objectImageBase}object-149.webp` },
];

const aliasMap: Record<string, string[]> = {
  T恤: ['T恤衫', '短袖'],
  乒乓球拍: ['球拍', '乒乓拍'],
  扳子: ['扳手'],
  本子: ['笔记本'],
  猫咪: ['猫'],
  猴: ['猴子'],
  狗: ['小狗'],
  电动车: ['电瓶车'],
  电风扇: ['风扇'],
  虾米: ['虾'],
  西蓝花: ['西兰花'],
  马甲: ['背心'],
  书桌: ['桌子', '写字台'],
  冰淇淋: ['冰激凌', '雪糕'],
  吹风机: ['电吹风'],
  大萝卜: ['萝卜'],
  照相机: ['相机'],
  电脑: ['计算机'],
  箩筐: ['筐子', '篮子'],
  铁锹: ['铁铲', '铲子'],
  马扎: ['凳子'],
  麦克风: ['话筒'],
};

const objectBank: Array<Omit<ObjectNamingQuestion, 'id'>> = objectItems.map((item) => ({
  ...item,
  aliases: [item.name, ...(aliasMap[item.name] ?? [])],
}));

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
  {
    prompt: '找出方向不一样的手套',
    itemLabel: '手套图一',
    oddLabel: '手套图二',
    itemImageUrl: `${oddOneOutImageBase}glove-1.webp`,
    oddImageUrl: `${oddOneOutImageBase}glove-2.webp`,
  },
  {
    prompt: '找出翅膀花纹不一样的蝴蝶',
    itemLabel: '蝴蝶图一',
    oddLabel: '蝴蝶图二',
    itemImageUrl: `${oddOneOutImageBase}butterfly-1.webp`,
    oddImageUrl: `${oddOneOutImageBase}butterfly-2.webp`,
  },
  {
    prompt: '找出篮子里不一样的青菜',
    itemLabel: '青菜图一',
    oddLabel: '青菜图二',
    itemImageUrl: `${oddOneOutImageBase}vegetable-1.webp`,
    oddImageUrl: `${oddOneOutImageBase}vegetable-2.webp`,
  },
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
        prompt: item.prompt,
        itemLabel: item.itemLabel,
        oddLabel: item.oddLabel,
        contentType: 'image',
        answerIndex,
        grid: Array.from({ length: 9 }, (_, gridIndex) =>
          gridIndex === answerIndex ? item.oddImageUrl : item.itemImageUrl,
        ),
      };
    });
}

export function isImageOddOneOutQuestion(question: OddOneOutQuestion): boolean {
  return question.contentType === 'image';
}

export function oddOneOutChoiceLabel(question: OddOneOutQuestion, index: number): string {
  if (question.contentType === 'image') {
    return index === question.answerIndex ? question.oddLabel : question.itemLabel;
  }
  return question.grid[index] ?? '未记录';
}

export function normalizeAnswer(value: string): string {
  return value.replace(/\s/g, '').replace(/[，、。,.！？!?]/g, '').toLowerCase();
}

export function isObjectAnswerCorrect(question: ObjectNamingQuestion, answer: string): boolean {
  const normalized = normalizeAnswer(answer);
  return question.aliases.some((alias) => normalized.includes(normalizeAnswer(alias)));
}
