import type { MathLevel, MathQuestion } from '../types';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeQuestion(index: number, a: number, b: number, operator: '+' | '-'): MathQuestion {
  const correctAnswer = operator === '+' ? a + b : a - b;
  return {
    id: `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
    expression: `${a} ${operator} ${b} =`,
    correctAnswer,
  };
}

function easyHundredPair(): [number, number] {
  const tens = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  const ones = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return [tens[randomInt(0, tens.length - 1)], ones[randomInt(0, ones.length - 1)]];
}

function carryAdditionPair(): [number, number] {
  const a = randomInt(6, 89);
  const ones = a % 10;
  const minB = Math.max(10 - ones, 1);
  const b = randomInt(minB, 100 - a);
  return [a, b];
}

function borrowSubtractionPair(): [number, number] {
  const a = randomInt(11, 100);
  const aOnes = a % 10;
  const candidates = Array.from({ length: a }, (_, index) => index + 1).filter((value) => value % 10 > aOnes);
  const b = candidates.length ? candidates[randomInt(0, candidates.length - 1)] : randomInt(0, a);
  return [a, b];
}

function generateOne(
  level: MathLevel,
  includeSubtraction: boolean,
  index: number,
  forcedOperator?: '+' | '-',
): MathQuestion {
  const allowSubtraction = includeSubtraction && ['L2', 'L4', 'L5', 'L6'].includes(level);
  const operator: '+' | '-' = forcedOperator ?? (allowSubtraction && Math.random() > 0.55 ? '-' : '+');

  if (level === 'L1') {
    const a = randomInt(0, 10);
    const b = randomInt(0, 10 - a);
    return makeQuestion(index, a, b, '+');
  }

  if (level === 'L2') {
    if (operator === '-') {
      const a = randomInt(0, 10);
      const b = randomInt(0, a);
      return makeQuestion(index, a, b, '-');
    }
    const a = randomInt(0, 10);
    const b = randomInt(0, 10 - a);
    return makeQuestion(index, a, b, '+');
  }

  if (level === 'L3') {
    const a = randomInt(0, 20);
    const b = randomInt(0, 20 - a);
    return makeQuestion(index, a, b, '+');
  }

  if (level === 'L4') {
    if (operator === '-') {
      const a = randomInt(0, 20);
      const b = randomInt(0, a);
      return makeQuestion(index, a, b, '-');
    }
    const a = randomInt(0, 20);
    const b = randomInt(0, 20 - a);
    return makeQuestion(index, a, b, '+');
  }

  if (level === 'L5') {
    const [x, y] = easyHundredPair();
    if (operator === '-') {
      const a = Math.max(x, y);
      const b = Math.min(x, y);
      return makeQuestion(index, a, b, '-');
    }
    return makeQuestion(index, x, y, '+');
  }

  if (operator === '-') {
    const [a, b] = borrowSubtractionPair();
    return makeQuestion(index, a, b, '-');
  }
  const [a, b] = carryAdditionPair();
  return makeQuestion(index, a, b, '+');
}

export function generateMathQuestions(
  level: MathLevel,
  count: 5 | 10 | 15 | 20,
  includeSubtraction: boolean,
): MathQuestion[] {
  const allowSubtraction = includeSubtraction && ['L2', 'L4', 'L5', 'L6'].includes(level);
  const subtractionSlots = allowSubtraction ? new Set([1, Math.floor(count / 2), count - 2].filter((index) => index >= 0)) : new Set();
  return Array.from({ length: count }, (_, index) =>
    generateOne(level, includeSubtraction, index, subtractionSlots.has(index) ? '-' : undefined),
  );
}
