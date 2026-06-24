import type { RepositoryCandidate, SupportedLanguage } from './candidates';
import type { RepositorySignalsInput } from './repository-signals';
import { buildSearchQueries } from './search-templates';

export type GitHubClient = {
  searchRepositories: (languages: SupportedLanguage[], limit: number) => Promise<RepositoryCandidate[]>;
  getRepositorySignals: (repository: RepositoryCandidate) => Promise<RepositorySignalsInput>;
};

type GitHubSearchItem = {
  full_name: string;
  name: string;
  html_url: string;
  language: string | null;
  archived: boolean;
  stargazers_count: number;
  pushed_at: string;
  default_branch?: string;
  owner: { login: string };
};

type GitHubTreeItem = {
  path: string;
  type: string;
};

const requestJson = async <T>(url: string, token: string): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  if (!response.ok) {
    throw new Error(`GitHub API 请求失败：${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};

const uniqueByFullName = (repositories: RepositoryCandidate[]): RepositoryCandidate[] => {
  return [...new Map(repositories.map((repository) => [repository.fullName, repository])).values()];
};

export const createGitHubClient = (token: string): GitHubClient => ({
  async searchRepositories(languages, limit) {
    const perLanguageLimit = Math.max(limit, 10);
    const pushedAfter = new Date();
    pushedAfter.setDate(pushedAfter.getDate() - 180);
    const searchQueries = buildSearchQueries({
      pushedAfter: pushedAfter.toISOString().slice(0, 10),
      languages
    });
    const results = await Promise.all(
      searchQueries.map(async (searchQuery) => {
        const query = encodeURIComponent(searchQuery);
        const data = await requestJson<{ items: GitHubSearchItem[] }>(
          `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=${perLanguageLimit}`,
          token
        );

        return data.items.map((item) => ({
          fullName: item.full_name,
          owner: item.owner.login,
          name: item.name,
          url: item.html_url,
          language: item.language,
          archived: item.archived,
          starsTotal: item.stargazers_count,
          pushedAt: item.pushed_at,
          defaultBranch: item.default_branch
        }));
      })
    );

    return uniqueByFullName(results.flat())
      .sort((left, right) => right.starsTotal - left.starsTotal)
      .slice(0, limit);
  },

  async getRepositorySignals(repository) {
    const treeRef = encodeURIComponent(repository.defaultBranch ?? 'HEAD');
    const [repositoryMeta, contents, issues, pulls] = await Promise.all([
      requestJson<{ license: { spdx_id: string } | null }>(
        `https://api.github.com/repos/${repository.fullName}`,
        token
      ),
      requestJson<{ tree: GitHubTreeItem[] }>(
        `https://api.github.com/repos/${repository.fullName}/git/trees/${treeRef}?recursive=1`,
        token
      ),
      requestJson<Array<{ title: string; pull_request?: unknown }>>(
        `https://api.github.com/repos/${repository.fullName}/issues?state=open&per_page=20`,
        token
      ),
      requestJson<Array<{ title: string }>>(
        `https://api.github.com/repos/${repository.fullName}/pulls?state=open&per_page=20`,
        token
      )
    ]);

    return {
      license: repositoryMeta.license?.spdx_id ?? null,
      files: contents.tree.filter((item) => item.type === 'blob').map((item) => item.path),
      issueTitles: issues.filter((issue) => !issue.pull_request).map((issue) => issue.title),
      openPullRequestTitles: pulls.map((pull) => pull.title)
    };
  }
});
