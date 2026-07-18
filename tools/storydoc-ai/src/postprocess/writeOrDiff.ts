import fs from 'node:fs/promises';
import path from 'node:path';
import { createTwoFilesPatch } from 'diff';

export type WriteOrDiffStatus = 'created' | 'diff-only' | 'unchanged';

export interface WriteOrDiffResult {
  status: WriteOrDiffStatus;
  path: string;
}

// e.g. "SparklineChart.stories.tsx" -> "SparklineChart.stories.ai.tsx.diff"
function toDiffPath(targetPath: string): string {
  const ext = path.extname(targetPath);
  const base = targetPath.slice(0, -ext.length);
  return `${base}.ai${ext}.diff`;
}

export async function writeOrDiff(targetPath: string, content: string): Promise<WriteOrDiffResult> {
  let existing: string | null = null;
  try {
    existing = await fs.readFile(targetPath, 'utf-8');
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
  }

  if (existing === null) {
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, content, 'utf-8');
    return { status: 'created', path: targetPath };
  }

  if (existing === content) {
    return { status: 'unchanged', path: targetPath };
  }

  const diffPath = toDiffPath(targetPath);
  const patch = createTwoFilesPatch(
    path.basename(targetPath),
    path.basename(targetPath),
    existing,
    content,
    'existing',
    'ai-generated'
  );
  await fs.writeFile(diffPath, patch, 'utf-8');
  return { status: 'diff-only', path: diffPath };
}
