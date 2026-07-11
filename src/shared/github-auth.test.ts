import { resolveGitHubToken } from './github-auth';

describe('resolveGitHubToken', () => {
  it('优先读取 GH_TOKEN', async () => {
    const token = await resolveGitHubToken({
      env: { GH_TOKEN: 'gh-token', GITHUB_TOKEN: 'github-token' },
      readGhToken: async () => 'cli-token'
    });

    expect(token).toBe('gh-token');
  });

  it('在 GH_TOKEN 缺失时读取 GITHUB_TOKEN', async () => {
    const token = await resolveGitHubToken({
      env: { GITHUB_TOKEN: 'github-token' },
      readGhToken: async () => 'cli-token'
    });

    expect(token).toBe('github-token');
  });

  it('在环境变量缺失时回退到 gh', async () => {
    const token = await resolveGitHubToken({
      env: {},
      readGhToken: async () => 'cli-token'
    });

    expect(token).toBe('cli-token');
  });

  it('认证不可用时不泄漏命令错误', async () => {
    const leakedToken = 'gho_should_not_appear';

    let thrown: unknown;

    try {
      await resolveGitHubToken({
        env: {},
        readGhToken: async () => {
          throw new Error(leakedToken);
        }
      });
    } catch (error) {
      thrown = error;
    }

    expect(String(thrown)).toContain('缺少 GitHub 认证');
    expect(String(thrown)).not.toContain(leakedToken);
  });
});
