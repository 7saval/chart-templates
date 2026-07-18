export interface StoryVariant {
  name: string;
  args: Record<string, unknown>;
}

export interface StoryDocOutput {
  mdx: string;
  storyVariants: StoryVariant[];
}

// Anthropic strict tool use requires `additionalProperties: false` on every
// object level, which can't represent a genuinely open-ended object like
// per-component story args. `argsJson` carries that as a JSON-encoded string
// instead, keeping the rest of the schema fully strict; AnthropicClient
// JSON.parses it back into `args` before returning StoryDocOutput.
export const STORY_DOC_TOOL_NAME = 'emit_story_doc';

export const STORY_DOC_OUTPUT_SCHEMA: {
  type: 'object';
  properties: Record<string, unknown>;
  required: string[];
  additionalProperties: false;
} = {
  type: 'object',
  properties: {
    mdx: {
      type: 'string',
      description: 'Full MDX documentation draft for the component.',
    },
    storyVariants: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Story export name, e.g. "Default", "Loading".',
          },
          argsJson: {
            type: 'string',
            description: 'JSON-encoded object of Storybook args for this variant.',
          },
        },
        required: ['name', 'argsJson'],
        additionalProperties: false,
      },
    },
  },
  required: ['mdx', 'storyVariants'],
  additionalProperties: false,
};
