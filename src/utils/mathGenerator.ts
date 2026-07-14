import type { MathLevel, MathQuestion } from '../types';

type MathCategory = 'simpleAdd' | 'simpleSubtract' | 'hardAdd' | 'hardSubtract';

const simpleAddSource =
  '10+10 12+6 2+8 7+12 40+6 20+12 30+10 12+5 2+8 7+3 33+21 20+10 35+5 22+6 56+2 50+6 32+6 99+1 71+8 66+22 30+20 16+4 60+12 5+10 55+10 20+18 7+31 29+10 5+14 5+5 4+53 23+23 31+4 56+3 21+12 9+6 7+8 11+55 52+15 7+62 30+19 31+8 16+13 25+25 12+60 36+4 61+8 13+13 45+12 35+22 14+52 21+11 31+15 55+2 23+6 62+13 14+52 21+11 31+15 55+2 62+1 5+61 36+4 21+33 85+2 55+22 23+6 41+7 39+10 14+22 27+30 33+16 22+26 31+8 11+38 12+5 15+5 22+6 50+50 21+33 16+50 72+3 24+40 10+76 38+40 22+60 41+15 16+12 26+3 56+12 80+10 1+23 8+12 5+13 5+33 6+23 21+21 33+12 7+12 22+50';
const simpleSubtractSource =
  '36-4 48-7 59-19 27-10 62-11 56-22 68-18 73-30 45-13 25-15 10-10 26-4 33-11 68-33 40-6 22-12 36-30 75-50 51-11 43-20 58-24 68-33 35-5 47-15 72-22 95-60 45-23 88-22 99-23 95-60 29-24 36-15 29-14 77-12 70-30 60-30 87-27 30-8 66-24 33-2 49-6 56-54 87-67 70-60 32-1 69-19 56-32 76-5 88-33 98-38 25-15 31-11 56-12 78-14 69-39 58-24 50-25 67-35 74-23 35-22 86-52 36-15 55-2 28-6 66-14 94-22 38-28 78-76 82-20 62-31 65-44 79-60 87-25 30-15 80-30 40-35 92-2 30-22 80-50 97-30 33-12 68-26 30-8 38-22 12-5 14-7 16-8 18-6 12-9 15-7 15-4 11-3 12-6 22-21 46-22 64-4 68-38 99-30 56-13 80-10 71-2 16-9 11-3 33-12';
const hardAddSource =
  '19+18 17+26 37+36 57+16 22+39 74+26 39+17 52+28 35+38 67+14 34+28 37+28 63+28 56+26 34+29 72+19 55+26 38+38 24+67 56+18 27+36 57+28 48+17 69+16 18+63 72+18 34+37 65+28 25+17 36+25 38+53 67+23 58+13 68+16 28+17 59+24 37+28 17+55 57+15 17+66 56+19 36+8 27+13 25+55 26+67 36+14 63+18 43+17 46+16 28+18 14+59 29+19 38+15 56+27 27+26 61+19 54+27 26+19 38+25 43+27 45+16 28+46 13+29 28+47 16+26 55+29 28+6 76+14 39+16 19+22 34+27 33+29 68+26 37+38 78+18 76+8 88+12 45+35 62+29 23+48 16+77 28+63 28+28 35+16 38+43 52+29 46+18 49+22 36+26 27+27 36+18 28+23 49+19 25+38 15+37 66+25 28+43 13+69 24+56 22+59';
const hardSubtractSource =
  '32-18 76-19 32-26 62-36 32-29 84-26 49-17 62-28 55-38 82-24 64-28 57-28 63-28 56-27 34-29 42-19 74-25 32-16 84-67 56-18 29-18 66-28 98-19 92-16 27-18 62-36 64-27 55-37 22-17 86-25 92-78 83-46 52-29 73-56 61-27 84-37 32-16 73-65 85-38 62-25 61-19 34-28 56-29 72-46 83-67';

const bankSources: Record<MathCategory, string> = {
  simpleAdd: simpleAddSource,
  simpleSubtract: simpleSubtractSource,
  hardAdd: hardAddSource,
  hardSubtract: hardSubtractSource,
};

const levelWeights: Record<MathLevel, Record<MathCategory, number>> = {
  L1: { simpleAdd: 50, simpleSubtract: 50, hardAdd: 0, hardSubtract: 0 },
  L2: { simpleAdd: 40, simpleSubtract: 40, hardAdd: 10, hardSubtract: 10 },
  L3: { simpleAdd: 30, simpleSubtract: 30, hardAdd: 30, hardSubtract: 10 },
  L4: { simpleAdd: 30, simpleSubtract: 30, hardAdd: 20, hardSubtract: 20 },
  L5: { simpleAdd: 25, simpleSubtract: 25, hardAdd: 25, hardSubtract: 25 },
};

function randomId(index: number): string {
  return `math-${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`;
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function parseExpression(expression: string): MathQuestion {
  const match = expression.match(/^(\d+)([+-])(\d+)$/);
  if (!match) throw new Error(`Invalid math expression: ${expression}`);
  const left = Number(match[1]);
  const operator = match[2];
  const right = Number(match[3]);
  return {
    id: '',
    expression: `${left} ${operator} ${right} =`,
    correctAnswer: operator === '+' ? left + right : left - right,
  };
}

const questionBanks: Record<MathCategory, MathQuestion[]> = Object.fromEntries(
  Object.entries(bankSources).map(([category, source]) => [
    category,
    source.split(/\s+/).filter(Boolean).map(parseExpression),
  ]),
) as Record<MathCategory, MathQuestion[]>;

function allocateByWeights(level: MathLevel, count: number): Record<MathCategory, number> {
  const weights = levelWeights[level] ?? levelWeights.L1;
  const categories = Object.keys(weights) as MathCategory[];
  const exact = categories.map((category) => ({
    category,
    count: (count * weights[category]) / 100,
  }));
  const allocation = Object.fromEntries(
    exact.map(({ category, count: exactCount }) => [category, Math.floor(exactCount)]),
  ) as Record<MathCategory, number>;
  let remaining = count - Object.values(allocation).reduce((sum, value) => sum + value, 0);

  for (const item of exact.sort((a, b) => b.count % 1 - a.count % 1)) {
    if (remaining <= 0) break;
    if (weights[item.category] <= 0) continue;
    allocation[item.category] += 1;
    remaining -= 1;
  }

  return allocation;
}

function drawFromBank(category: MathCategory, count: number): MathQuestion[] {
  if (count <= 0) return [];
  const bank = questionBanks[category];
  const selected: MathQuestion[] = [];
  while (selected.length < count) {
    selected.push(...shuffle(bank).slice(0, count - selected.length));
  }
  return selected;
}

export function generateMathQuestions(
  level: MathLevel,
  count: 10 | 20 | 30,
  _includeSubtraction = true,
): MathQuestion[] {
  const allocation = allocateByWeights(level, count);
  const selected = (Object.keys(allocation) as MathCategory[]).flatMap((category) =>
    drawFromBank(category, allocation[category]),
  );

  return shuffle(selected).map((question, index) => ({
    ...question,
    id: randomId(index),
  }));
}
