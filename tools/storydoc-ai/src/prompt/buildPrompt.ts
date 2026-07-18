import type { ComponentMetadata } from '../metadata.js';
import type { FewShotExample } from './fewshot.js';

export function buildPrompt(metadata: ComponentMetadata, fewshot: FewShotExample[]): string {
  const fewshotBlocks = fewshot
    .map((ex) => `### Example: ${ex.name}.stories.tsx\n\`\`\`tsx\n${ex.storySource}\n\`\`\``)
    .join('\n\n');

  const propsTable = metadata.props
    .map((p) => `| \`${p.name}\` | \`${p.type ?? 'unknown'}\` | ${p.required ? 'yes' : 'no'} | ${p.defaultValue ?? '-'} |`)
    .join('\n');

  return `You are generating a Storybook MDX documentation draft and a list of Story variants for a React component in this design system, following the existing conventions exactly.

## Conventions to follow (from the design system's Storybook playbook)

Every chart/card/table Story set must include variants that exercise these controls:

| Control | Type | Purpose |
|---------|------|---------|
| \`status\` | select | normal / warning / critical color changes |
| \`isLoading\` | boolean | loading skeleton state |
| \`error\` | text | error message UI |
| \`height\` | number | responsive height |

(Only include a control if the target component actually has that prop — do not invent props that aren't in the Props list below.)

Story naming convention: \`Default\`, \`WithWarning\`, \`Loading\`, \`Empty\` (see examples). Match this naming when the corresponding prop exists.

## Reference examples (existing convention in this codebase)

${fewshotBlocks}

## Target component to document

Component: ${metadata.component}
Source file: ${metadata.sourceFile}

Props:
| Name | Type | Required | Default |
|------|------|----------|---------|
${propsTable}

Note: these props have no JSDoc comments in the source. Write plausible, natural-language prop descriptions inferred from the prop name and type — do not fabricate specific factual claims about runtime behavior you cannot infer from the name/type alone.

## Output

Call the \`emit_story_doc\` tool with:
- \`mdx\`: a full MDX documentation draft. Import MDX blocks from \`'@storybook/addon-docs/blocks'\` — **not** \`'@storybook/blocks'\`, which does not exist in this repo's Storybook 10 setup (verified from \`src/stories/Configure.mdx\`). Only import blocks you actually use in the body (e.g. \`Meta\`, \`Canvas\`, \`Story\`) — do not import unused blocks like \`ArgsTable\`. Write the Meta block as \`<Meta of={${metadata.component}Stories} />\` only — do **not** also pass a \`title\` prop; \`of\` already attaches the docs page to that CSF file's title, and adding an explicit \`title\` alongside \`of\` creates a duplicate-title index conflict that breaks Storybook's index build ("Error fetching /index.json"). Include a Meta block, a one-paragraph description, a Props table, and a Canvas of the Default story, matching the style of the reference examples' surrounding conventions. **Write the one-paragraph description in Korean (한글)** — keep everything else (headings, import statements, JSX, prop names/types in the table) as-is; only the descriptive prose paragraph is translated.
- \`storyVariants\`: the list of Story variants to add to \`${metadata.component}.stories.tsx\`, each with a \`name\` and \`argsJson\` (a JSON-encoded string of the args object for that variant).
`;
}
