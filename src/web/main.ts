import './styles.css';
import { parseReport } from '../shared/report-schema';
import { renderReport } from './report-view';

const root = document.querySelector<HTMLElement>('#app');

if (!root) {
  throw new Error('缺少 #app 根节点');
}

const loadReport = async (): Promise<void> => {
  const response = await fetch('/reports/latest.json');
  const report = parseReport(await response.json());

  renderReport(root, report);
};

void loadReport();
