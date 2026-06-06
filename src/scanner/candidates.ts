export type SupportedLanguage = string;

export type RepositoryCandidate = {
  fullName: string;
  owner: string;
  name: string;
  url: string;
  language: string | null;
  archived: boolean;
  starsTotal: number;
  pushedAt: string;
  defaultBranch?: string;
};

export const selectCandidateRepositories = (
  repositories: RepositoryCandidate[],
  languages: SupportedLanguage[]
): RepositoryCandidate[] => {
  const allowed = new Set<string>(languages);

  return repositories
    .filter((repository) => !repository.archived)
    .filter((repository) => repository.language !== null)
    .filter((repository) => allowed.size === 0 || allowed.has(repository.language ?? ''))
    .sort((left, right) => right.starsTotal - left.starsTotal);
};
