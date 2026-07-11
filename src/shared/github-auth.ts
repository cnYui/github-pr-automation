import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export type GitHubTokenCommand = () => Promise<string>;

export type ResolveGitHubTokenInput = {
  env?: NodeJS.ProcessEnv;
  readGhToken?: GitHubTokenCommand;
};

const readTokenFromGh: GitHubTokenCommand = async () => {
  const { stdout } = await execFileAsync('gh', ['auth', 'token'], {
    encoding: 'utf8',
    windowsHide: true
  });

  return stdout.trim();
};

export const resolveGitHubToken = async (
  input: ResolveGitHubTokenInput = {}
): Promise<string> => {
  const env = input.env ?? process.env;
  const environmentToken = env.GH_TOKEN?.trim() || env.GITHUB_TOKEN?.trim();

  if (environmentToken) {
    return environmentToken;
  }

  try {
    const token = await (input.readGhToken ?? readTokenFromGh)();

    if (token) {
      return token;
    }
  } catch {
    // 统一错误信息，避免命令异常意外携带认证内容。
  }

  throw new Error('缺少 GitHub 认证，请设置 GH_TOKEN、GITHUB_TOKEN 或先执行 gh auth login');
};
