import { isAbsolute, relative, resolve, sep } from 'node:path';

const assertInsideRoot = (root: string, target: string, label: string): void => {
  const relativePath = relative(root, target);

  if (
    isAbsolute(relativePath) ||
    relativePath === '..' ||
    relativePath.startsWith(`..${sep}`)
  ) {
    throw new Error(`${label}必须位于允许目录内`);
  }
};

export const resolveWithinRoot = (root: string, path: string, label: string): string => {
  const normalizedRoot = resolve(root);
  const target = resolve(normalizedRoot, path);
  assertInsideRoot(normalizedRoot, target, label);
  return target;
};

export const toRelativePathInsideRoot = (
  root: string,
  target: string,
  label: string
): string => {
  const normalizedRoot = resolve(root);
  const normalizedTarget = resolve(target);
  assertInsideRoot(normalizedRoot, normalizedTarget, label);
  return relative(normalizedRoot, normalizedTarget).split(sep).join('/');
};
