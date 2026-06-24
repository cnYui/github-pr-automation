export type SearchTemplateInput = {
  pushedAfter: string;
  languages: string[];
};

const defaultTopics = ['agent', 'mcp', 'cli', 'developer-tools'];
const defaultFreeTextQueries = ['"model context protocol"'];

const withLanguage = (query: string, language: string | null): string => {
  return language ? `${query} language:${language}` : query;
};

export const buildSearchQueries = (input: SearchTemplateInput): string[] => {
  const baseQueries = [
    ...defaultTopics.map((topic) => `topic:${topic}`),
    ...defaultFreeTextQueries
  ];
  const languages = input.languages.length > 0 ? input.languages : [null];

  return languages.flatMap((language) =>
    baseQueries.map((baseQuery) =>
      `${withLanguage(baseQuery, language)} archived:false stars:>50 pushed:>=${input.pushedAfter}`
    )
  );
};
