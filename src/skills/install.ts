import { randomUUID } from 'node:crypto';
import { access, cp, mkdir, rename, rm } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

const skillNames = [
  'github-daily-pr-opportunity-scan',
  'github-implement-pr-opportunity',
  'github-run-pr-opportunity-pipeline'
];

const exists = async (path: string): Promise<boolean> => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const projectRoot = resolve(process.cwd());
const sourceRoot = join(projectRoot, 'skills');
const codexHome = process.env.CODEX_HOME?.trim() || join(homedir(), '.codex');
const targetRoot = join(codexHome, 'skills');
const installId = randomUUID();
const lockPath = join(targetRoot, '.github-pr-automation-install.lock');
const stagingRoot = join(targetRoot, `.github-pr-automation-staging-${installId}`);
const backupRoot = join(targetRoot, `.github-pr-automation-backup-${installId}`);

await mkdir(targetRoot, { recursive: true });

try {
  await mkdir(lockPath);
} catch (error) {
  if ((error as NodeJS.ErrnoException).code === 'EEXIST') {
    throw new Error('另一个 Skill 安装任务正在运行');
  }

  throw error;
}

const installed: string[] = [];

try {
  await mkdir(stagingRoot);
  await mkdir(backupRoot);

  for (const skillName of skillNames) {
    const source = join(sourceRoot, skillName);
    const staged = join(stagingRoot, skillName);

    await access(join(source, 'SKILL.md'));
    await cp(source, staged, {
      recursive: true,
      filter: (path) => !path.includes('__pycache__') && !path.endsWith('.pyc')
    });
    await access(join(staged, 'SKILL.md'));
  }

  for (const skillName of skillNames) {
    const staged = join(stagingRoot, skillName);
    const target = join(targetRoot, skillName);
    const backup = join(backupRoot, skillName);
    const hadTarget = await exists(target);

    if (hadTarget) {
      await rename(target, backup);
    }

    try {
      await rename(staged, target);
      installed.push(skillName);
    } catch (error) {
      if (hadTarget) {
        await rename(backup, target);
      }

      throw error;
    }
  }

  for (const skillName of skillNames) {
    process.stdout.write(`已安装 ${skillName} -> ${join(targetRoot, skillName)}\n`);
  }
} catch (error) {
  for (const skillName of installed.reverse()) {
    const target = join(targetRoot, skillName);
    const backup = join(backupRoot, skillName);

    await rm(target, { recursive: true, force: true });
    if (await exists(backup)) {
      await rename(backup, target);
    }
  }

  throw error;
} finally {
  await rm(stagingRoot, { recursive: true, force: true });
  await rm(backupRoot, { recursive: true, force: true });
  await rm(lockPath, { recursive: true, force: true });
}
