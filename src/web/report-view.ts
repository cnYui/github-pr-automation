import type { OpportunityReport, ReportItem } from '../shared/report-schema';

const appendText = (parent: HTMLElement, tag: keyof HTMLElementTagNameMap, text: string, className?: string): HTMLElement => {
  const element = document.createElement(tag);
  element.textContent = text;

  if (className) {
    element.className = className;
  }

  parent.append(element);
  return element;
};

const appendMetric = (parent: HTMLElement, label: string, value: string | number): void => {
  const wrapper = document.createElement('div');
  appendText(wrapper, 'dt', label);
  appendText(wrapper, 'dd', String(value));
  parent.append(wrapper);
};

const yesNo = (value: boolean): string => (value ? '是' : '否');

const formatHealth = (item: ReportItem): string => {
  return [
    `license: ${item.health.license}`,
    `CI: ${yesNo(item.health.hasCi)}`,
    `测试: ${yesNo(item.health.hasTests)}`,
    `贡献指南: ${yesNo(item.health.hasContributing)}`,
    `issue: ${item.health.issueActivity}`
  ].join(' / ');
};

const appendCell = (row: HTMLTableRowElement, build: (cell: HTMLTableCellElement) => void): void => {
  const cell = document.createElement('td');
  build(cell);
  row.append(cell);
};

const appendEvidence = (cell: HTMLTableCellElement, evidence: string[]): void => {
  evidence.forEach((item) => appendText(cell, 'span', item));
};

const appendRow = (body: HTMLTableSectionElement, item: ReportItem): void => {
  const row = document.createElement('tr');

  appendCell(row, (cell) => appendText(cell, 'span', String(item.rank), 'rank'));
  appendCell(row, (cell) => {
    const link = document.createElement('a');
    link.href = item.repository.url;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.textContent = `${item.repository.owner}/${item.repository.name}`;
    cell.append(link);
    appendText(cell, 'span', item.repository.primaryLanguage);
  });
  appendCell(row, (cell) => {
    appendText(cell, 'strong', `+${item.popularity.starsAdded24h} / ${item.popularity.starsTotal}`);
    appendText(cell, 'span', item.popularity.lastUpdatedAt);
  });
  appendCell(row, (cell) => appendText(cell, 'span', formatHealth(item)));
  appendCell(row, (cell) => {
    appendText(cell, 'strong', item.opportunity.category);
    appendText(cell, 'span', item.opportunity.summary);
  });
  appendCell(row, (cell) => appendEvidence(cell, item.opportunity.evidence));
  appendCell(row, (cell) => {
    appendText(cell, 'strong', item.risk.level);
    appendText(cell, 'span', item.risk.reason);
  });
  appendCell(row, (cell) => appendText(cell, 'strong', item.recommendation));

  body.append(row);
};

const createHeader = (report: OpportunityReport): HTMLElement => {
  const header = document.createElement('header');
  header.className = 'summary';

  const titleGroup = document.createElement('div');
  appendText(titleGroup, 'p', 'GitHub PR 机会日报', 'eyebrow');
  appendText(titleGroup, 'h1', report.date);

  const metrics = document.createElement('dl');
  appendMetric(metrics, '候选项目', report.summary.candidateCount);
  appendMetric(metrics, '可推进', report.summary.actionableCount);
  appendMetric(metrics, '更新时间', report.generatedAt);

  header.append(titleGroup, metrics);
  return header;
};

const createTable = (items: ReportItem[]): HTMLElement => {
  const wrapper = document.createElement('div');
  wrapper.className = 'table-wrap';

  const table = document.createElement('table');
  const head = document.createElement('thead');
  const headRow = document.createElement('tr');
  ['排名', '项目', '热度', '项目健康度', 'PR 切入口', '证据', '风险', '建议动作'].forEach((label) =>
    appendText(headRow, 'th', label)
  );
  const body = document.createElement('tbody');
  items.forEach((item) => appendRow(body, item));

  head.append(headRow);
  table.append(head, body);
  wrapper.append(table);

  return wrapper;
};

export const renderReport = (root: HTMLElement, report: OpportunityReport): void => {
  root.replaceChildren();

  const page = document.createElement('section');
  page.className = 'page';
  page.append(createHeader(report), createTable(report.items));

  root.append(page);
};
