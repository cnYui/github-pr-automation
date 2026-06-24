import { describe, expect, it } from 'vitest';
import { buildSearchQueries } from './search-templates';

describe('buildSearchQueries', () => {
  it('默认生成面向 agent、mcp、cli、developer-tools 的全网查询', () => {
    const queries = buildSearchQueries({
      pushedAfter: '2026-01-01',
      languages: []
    });

    expect(queries).toEqual([
      'topic:agent archived:false stars:>50 pushed:>=2026-01-01',
      'topic:mcp archived:false stars:>50 pushed:>=2026-01-01',
      'topic:cli archived:false stars:>50 pushed:>=2026-01-01',
      'topic:developer-tools archived:false stars:>50 pushed:>=2026-01-01',
      '"model context protocol" archived:false stars:>50 pushed:>=2026-01-01'
    ]);
  });

  it('传入语言白名单时为每条查询附加 language 限制', () => {
    const queries = buildSearchQueries({
      pushedAfter: '2026-01-01',
      languages: ['TypeScript']
    });

    expect(queries).toContain(
      'topic:agent language:TypeScript archived:false stars:>50 pushed:>=2026-01-01'
    );
  });
});
