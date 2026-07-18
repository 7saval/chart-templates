import fs from 'node:fs/promises';
import path from 'node:path';
import { REPO_ROOT } from '../paths.js';

export interface FewShotExample {
  name: string;
  storySource: string;
}

// Read live from the repo's own *.stories.tsx files rather than duplicating
// their text here, so the examples never drift out of sync with the actual
// convention as those stories get edited.
const FEWSHOT_STORY_PATHS = [
  'src/components/charts/TrendLineChart/TrendLineChart.stories.tsx',
  'src/components/kpi/KpiCard/KpiCard.stories.tsx',
  'src/components/tables/AlertEventTable/AlertEventTable.stories.tsx',
];

export async function loadFewShotExamples(): Promise<FewShotExample[]> {
  return Promise.all(
    FEWSHOT_STORY_PATHS.map(async (relativePath) => {
      const absolutePath = path.resolve(REPO_ROOT, relativePath);
      const storySource = await fs.readFile(absolutePath, 'utf-8');
      return { name: path.basename(relativePath, '.stories.tsx'), storySource };
    })
  );
}
