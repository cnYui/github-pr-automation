import { resolve } from 'node:path';
import { resolveWithinRoot, toRelativePathInsideRoot } from './path';

describe('path', () => {
  it('允许根目录内路径', () => {
    const root = resolve('project-root');
    const target = resolveWithinRoot(root, 'data/pipeline', '状态目录');

    expect(toRelativePathInsideRoot(root, target, '状态目录')).toBe('data/pipeline');
  });

  it('拒绝根目录外路径', () => {
    const root = resolve('project-root');

    expect(() => resolveWithinRoot(root, '../outside', '状态目录')).toThrow(
      '状态目录必须位于允许目录内'
    );
  });

  it.runIf(process.platform === 'win32')('拒绝 Windows 跨盘路径', () => {
    expect(() => resolveWithinRoot('D:\\project', 'C:\\outside', '报告文件')).toThrow(
      '报告文件必须位于允许目录内'
    );
  });
});
