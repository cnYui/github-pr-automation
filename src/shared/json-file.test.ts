import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readJsonFile, writeJsonFileAtomic } from './json-file';

describe('json-file', () => {
  it('创建目录并写入可解析 JSON', async () => {
    const root = await mkdtemp(join(tmpdir(), 'github-pr-json-'));
    const path = join(root, 'nested', 'state.json');

    await writeJsonFileAtomic(path, { status: 'running' });

    expect(await readJsonFile(path)).toEqual({ status: 'running' });
    expect(await readFile(path, 'utf8')).toMatch(/\n$/);
  });

  it('能够替换已有 JSON', async () => {
    const root = await mkdtemp(join(tmpdir(), 'github-pr-json-'));
    const path = join(root, 'state.json');

    await writeJsonFileAtomic(path, { version: 1 });
    await writeJsonFileAtomic(path, { version: 2 });

    expect(await readJsonFile(path)).toEqual({ version: 2 });
  });

  it('主文件缺失时读取备份', async () => {
    const root = await mkdtemp(join(tmpdir(), 'github-pr-json-'));
    const path = join(root, 'state.json');

    await writeFile(`${path}.backup`, '{"version":1}\n', 'utf8');

    expect(await readJsonFile(path)).toEqual({ version: 1 });
  });
});
