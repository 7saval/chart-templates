import type { ComponentMetadata } from '../metadata.js';
import type { StoryVariant } from '../schema/storyDocOutput.js';

// args are already JSON-safe values (they round-tripped through JSON in
// AnthropicClient), so JSON.stringify produces a syntactically valid JS
// object literal — no separate JS-AST serializer needed.
export function renderStoryFile(
  metadata: ComponentMetadata,
  storyVariants: StoryVariant[],
  titlePrefix: string
): string {
  const { component } = metadata;

  const variantExports = storyVariants
    .map(
      (variant) =>
        `export const ${variant.name}: Story = { args: ${JSON.stringify(variant.args)} };`
    )
    .join('\n');

  return `import type { Meta, StoryObj } from '@storybook/react';
import { ${component} } from './${component}';

const meta: Meta<typeof ${component}> = {
  title: '${titlePrefix}/${component}',
  component: ${component},
};
export default meta;
type Story = StoryObj<typeof ${component}>;

${variantExports}
`;
}
