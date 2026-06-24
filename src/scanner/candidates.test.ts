import { describe, expect, it } from 'vitest';
import { selectCandidateRepositories } from './candidates';

describe('selectCandidateRepositories', () => {
  it('只保留活跃且语言匹配的非 archived 仓库', () => {
    const result = selectCandidateRepositories(
      [
        {
          fullName: 'a/ts',
          owner: 'a',
          name: 'ts',
          url: 'https://github.com/a/ts',
          language: 'TypeScript',
          archived: false,
          starsTotal: 5000,
          pushedAt: '2026-06-04T10:00:00Z'
        },
        {
          fullName: 'b/rust',
          owner: 'b',
          name: 'rust',
          url: 'https://github.com/b/rust',
          language: 'Rust',
          archived: false,
          starsTotal: 9000,
          pushedAt: '2026-06-04T10:00:00Z'
        },
        {
          fullName: 'c/old',
          owner: 'c',
          name: 'old',
          url: 'https://github.com/c/old',
          language: 'Python',
          archived: true,
          starsTotal: 7000,
          pushedAt: '2026-06-04T10:00:00Z'
        }
      ],
      {
        languages: ['TypeScript', 'JavaScript', 'Python'],
        pushedAfter: '2026-01-01'
      }
    );

    expect(result.map((item) => item.fullName)).toEqual(['a/ts']);
  });

  it('没有指定语言白名单时保留任意主语言仓库', () => {
    const result = selectCandidateRepositories(
      [
        {
          fullName: 'a/rust',
          owner: 'a',
          name: 'rust',
          url: 'https://github.com/a/rust',
          language: 'Rust',
          archived: false,
          starsTotal: 9000,
          pushedAt: '2026-06-04T10:00:00Z'
        },
        {
          fullName: 'b/go',
          owner: 'b',
          name: 'go',
          url: 'https://github.com/b/go',
          language: 'Go',
          archived: false,
          starsTotal: 8000,
          pushedAt: '2026-06-04T10:00:00Z'
        }
      ],
      {
        languages: [],
        pushedAfter: '2026-01-01'
      }
    );

    expect(result.map((item) => item.fullName)).toEqual(['a/rust', 'b/go']);
  });

  it('过滤长期不活跃仓库，即使总 Star 很高也不保留', () => {
    const result = selectCandidateRepositories(
      [
        {
          fullName: 'a/active',
          owner: 'a',
          name: 'active',
          url: 'https://github.com/a/active',
          language: 'TypeScript',
          archived: false,
          starsTotal: 300,
          pushedAt: '2026-06-10T10:00:00Z'
        },
        {
          fullName: 'b/stale',
          owner: 'b',
          name: 'stale',
          url: 'https://github.com/b/stale',
          language: 'TypeScript',
          archived: false,
          starsTotal: 8000,
          pushedAt: '2025-01-01T10:00:00Z'
        }
      ],
      {
        languages: ['TypeScript'],
        pushedAfter: '2026-01-01'
      }
    );

    expect(result.map((item) => item.fullName)).toEqual(['a/active']);
  });
});
