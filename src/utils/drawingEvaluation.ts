import type { DrawingLevel, DrawingPoint, ShapeDrawingAttempt, ShapeDrawingMetrics, ShapeType } from '../types';

interface DrawingBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

function distance(a: DrawingPoint, b: DrawingPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getDrawingBounds(points: DrawingPoint[]): DrawingBounds {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);
  return {
    minX,
    maxX,
    minY,
    maxY,
    width,
    height,
    centerX: minX + width / 2,
    centerY: minY + height / 2,
  };
}

function calculateStrokeCount(points: DrawingPoint[]): number {
  return new Set(points.map((point) => point.strokeId)).size;
}

function calculateDuration(points: DrawingPoint[]): number {
  if (points.length < 2) return 0;
  return Math.max(1, Math.round((points[points.length - 1].t - points[0].t) / 1000));
}

function closureRate(points: DrawingPoint[], bounds: DrawingBounds): number {
  if (points.length < 2) return 0;
  const first = points[0];
  const last = points[points.length - 1];
  const normalized = distance(first, last) / Math.max(bounds.width, bounds.height, 1);
  return clamp(1 - normalized * 2, 0, 1);
}

function aspectScore(shapeType: ShapeType, bounds: DrawingBounds): number {
  const ratio = bounds.width / Math.max(bounds.height, 1);
  if (shapeType === 'circle') {
    return clamp(1 - Math.abs(bounds.width - bounds.height) / Math.max(bounds.width, bounds.height, 1), 0, 1);
  }
  if (shapeType === 'rectangle') {
    return clamp(1 - Math.abs(Math.log(ratio / 1.45)), 0, 1);
  }
  return clamp(1 - Math.abs(Math.log(ratio / 1.15)), 0, 1);
}

function circularMetrics(points: DrawingPoint[], bounds: DrawingBounds) {
  const radius = (bounds.width + bounds.height) / 4;
  if (radius <= 1) return { radialError: 1, circularCoverage: 0 };
  const buckets = new Set<number>();
  const radialError =
    points.reduce((sum, point) => {
      const angle = Math.atan2(point.y - bounds.centerY, point.x - bounds.centerX);
      buckets.add(Math.floor(((angle + Math.PI) / (Math.PI * 2)) * 36));
      return sum + Math.abs(Math.hypot(point.x - bounds.centerX, point.y - bounds.centerY) - radius) / radius;
    }, 0) / Math.max(points.length, 1);
  return {
    radialError: clamp(radialError, 0, 1),
    circularCoverage: clamp(buckets.size / 36, 0, 1),
  };
}

function roughCoverage(shapeType: ShapeType, points: DrawingPoint[], bounds: DrawingBounds): number {
  if (points.length < 8) return 0;
  if (shapeType === 'circle') return circularMetrics(points, bounds).circularCoverage;
  const left = points.some((point) => point.x < bounds.minX + bounds.width * 0.28);
  const right = points.some((point) => point.x > bounds.maxX - bounds.width * 0.28);
  const top = points.some((point) => point.y < bounds.minY + bounds.height * 0.28);
  const bottom = points.some((point) => point.y > bounds.maxY - bounds.height * 0.28);
  return [left, right, top, bottom].filter(Boolean).length / 4;
}

function roughPrecision(shapeType: ShapeType, points: DrawingPoint[], bounds: DrawingBounds): number {
  if (points.length < 8) return 0;
  if (shapeType === 'circle') return clamp(1 - circularMetrics(points, bounds).radialError, 0, 1);
  const centerPenalty = points.filter((point) => {
    const nearVertical = point.x < bounds.minX + bounds.width * 0.25 || point.x > bounds.maxX - bounds.width * 0.25;
    const nearHorizontal = point.y < bounds.minY + bounds.height * 0.25 || point.y > bounds.maxY - bounds.height * 0.25;
    return !(nearVertical || nearHorizontal);
  }).length / points.length;
  return clamp(1 - centerPenalty, 0, 1);
}

export function getDrawingLevel(score: number): DrawingLevel {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'completed';
  return 'try_again';
}

export function getDrawingFeedback(level: DrawingLevel, audience: 'patient' | 'caregiver'): string {
  if (audience === 'caregiver') {
    const caregiver: Record<DrawingLevel, string> = {
      excellent: '主要结构完成较好，线条与目标图形匹配度较高。',
      good: '图形基本清晰，主要结构已完成。',
      completed: '本次已完成，部分结构可能有偏差，可由家属查看。',
      try_again: '本次可能未完整完成，建议家属结合实际情况查看。不要据此做医学判断。',
    };
    return caregiver[level];
  }
  const patient: Record<DrawingLevel, string> = {
    excellent: '画得很完整，今天完成得很好！',
    good: '完成得不错，主要形状已经画出来啦！',
    completed: '已经完成啦，愿意练习就很棒。',
    try_again: '已经尝试完成啦，如果愿意，可以再画一次。',
  };
  return patient[level];
}

export function evaluateShapeDrawing(shapeType: ShapeType, points: DrawingPoint[]): ShapeDrawingMetrics {
  if (points.length < 6) {
    const level = getDrawingLevel(20);
    return {
      shapeType,
      durationSeconds: calculateDuration(points),
      strokeCount: calculateStrokeCount(points),
      pointCount: points.length,
      score: 20,
      level,
      feedbackText: getDrawingFeedback(level, 'patient'),
      caregiverText: getDrawingFeedback(level, 'caregiver'),
    };
  }

  const bounds = getDrawingBounds(points);
  const strokeCount = calculateStrokeCount(points);
  const pointCount = points.length;
  const durationSeconds = calculateDuration(points);
  const coverageRate = roughCoverage(shapeType, points, bounds);
  const precisionRate = roughPrecision(shapeType, points, bounds);
  const close = closureRate(points, bounds);
  const aspect = aspectScore(shapeType, bounds);
  const extraStrokeRate = clamp(1 - precisionRate, 0, 1);
  const circle = shapeType === 'circle' ? circularMetrics(points, bounds) : undefined;

  const score =
    shapeType === 'circle'
      ? clamp(
          100 -
            (circle?.radialError ?? 1) * 120 -
            (1 - (circle?.circularCoverage ?? 0)) * 40 -
            (1 - close) * 20 -
            (1 - aspect) * 20 -
            extraStrokeRate * 20,
        )
      : clamp(
          coverageRate * (shapeType === 'triangle' ? 45 : 40) +
            precisionRate * 25 +
            close * 20 +
            aspect * (shapeType === 'triangle' ? 10 : 15) -
            extraStrokeRate * 10,
        );

  const level = getDrawingLevel(score);
  return {
    shapeType,
    durationSeconds,
    strokeCount,
    pointCount,
    coverageRate,
    precisionRate,
    closureRate: close,
    aspectScore: aspect,
    extraStrokeRate,
    radialError: circle?.radialError,
    circularCoverage: circle?.circularCoverage,
    score: Math.round(score),
    level,
    feedbackText: getDrawingFeedback(level, 'patient'),
    caregiverText: getDrawingFeedback(level, 'caregiver'),
  };
}

export function bestShapeAttempt(attempts?: ShapeDrawingAttempt[]): ShapeDrawingAttempt | undefined {
  return attempts?.reduce<ShapeDrawingAttempt | undefined>((best, attempt) => {
    if (!best || attempt.metrics.score > best.metrics.score) return attempt;
    return best;
  }, undefined);
}
