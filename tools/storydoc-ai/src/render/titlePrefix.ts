import path from 'node:path';

// Derived from an exhaustive grep of every `title:` line across the repo's
// existing *.stories.tsx files (see 3주차 계획). Only folders with a real,
// observed convention are mapped — `topology/` and `misc/` have no
// implemented components yet, so there's no real title to copy.
const TITLE_PREFIX_BY_FOLDER: Record<string, string> = {
  charts: '📈 Charts/ECharts',
  kpi: '📊 KPI Cards',
  layout: '📐 Layout',
  flow: '🔗 Flow',
  tables: '📋 Tables',
};

// sourceFile looks like "src/components/<folder>/<Component>/<Component>.tsx"
export function deriveTitlePrefix(sourceFile: string): string {
  const parts = sourceFile.split(path.sep).join('/').split('/');
  const componentsIndex = parts.indexOf('components');
  const folder = componentsIndex >= 0 ? parts[componentsIndex + 1] : undefined;

  const prefix = folder ? TITLE_PREFIX_BY_FOLDER[folder] : undefined;
  if (!prefix) {
    const known = Object.keys(TITLE_PREFIX_BY_FOLDER).join(', ');
    throw new Error(
      `No known Storybook title prefix for folder "${folder ?? '(unknown)'}" (from sourceFile "${sourceFile}"). ` +
        `Known folders with a real convention: ${known}. Add a real example story before mapping a new folder.`
    );
  }
  return prefix;
}
