export type SupportedLanguage = string;

export type CandidateSelectionInput = {
  languages: SupportedLanguage[];
  pushedAfter: string;
};

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
  input: CandidateSelectionInput
): RepositoryCandidate[] => {
  const allowed = new Set<string>(input.languages);
  const pushedAfter = Date.parse(input.pushedAfter);

  return repositories
    .filter((repository) => !repository.archived)
    .filter((repository) => repository.language !== null)
    .filter((repository) => allowed.size === 0 || allowed.has(repository.language ?? ''))
    .filter((repository) => Date.parse(repository.pushedAt) >= pushedAfter)
    .sort((left, right) => right.starsTotal - left.starsTotal);
};
