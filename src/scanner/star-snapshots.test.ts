import { describe, expect, it } from 'vitest';
import { calculateStarDeltas } from './star-snapshots';

describe('calculateStarDeltas', () => {
  it('用两天快照计算 24 小时新增 Star 并降序排序', () => {
    const result = calculateStarDeltas(
      [
        { fullName: 'a/fast', starsTotal: 150 },
        { fullName: 'b/slow', starsTotal: 90 }
      ],
      [
        { fullName: 'a/fast', starsTotal: 100 },
        { fullName: 'b/slow', starsTotal: 80 }
      ]
    );

    expect(result).toEqual([
      { fullName: 'a/fast', starsTotal: 150, starsAdded24h: 50, isColdStart: false },
      { fullName: 'b/slow', starsTotal: 90, starsAdded24h: 10, isColdStart: false }
    ]);
  });

  it('首次运行缺少历史快照时标记冷启动', () => {
    const result = calculateStarDeltas([{ fullName: 'a/new', starsTotal: 120 }], []);

    expect(result).toEqual([
      { fullName: 'a/new', starsTotal: 120, starsAdded24h: 120, isColdStart: true }
    ]);
  });
});
