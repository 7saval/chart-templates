import Anthropic from '@anthropic-ai/sdk';
import type { LLMClient } from './LLMClient.js';
import {
  STORY_DOC_OUTPUT_SCHEMA,
  STORY_DOC_TOOL_NAME,
  type StoryDocOutput,
  type StoryVariant,
} from '../schema/storyDocOutput.js';

const DEFAULT_MODEL = 'claude-sonnet-5';

export class AnthropicClient implements LLMClient {
  private readonly client: Anthropic;
  private readonly model: string;

  constructor() {
    this.client = new Anthropic();
    this.model = process.env.STORYDOC_AI_MODEL ?? DEFAULT_MODEL;
  }

  async generate(prompt: string): Promise<StoryDocOutput> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 8192,
      // Forced tool_choice guarantees the structured tool call every time;
      // reasoning transparency isn't needed for this extraction task, so
      // thinking is explicitly disabled rather than left to interact with
      // a non-auto tool_choice.
      thinking: { type: 'disabled' },
      tools: [
        {
          name: STORY_DOC_TOOL_NAME,
          description:
            'Emit the generated Storybook MDX documentation draft and story variant list for a component.',
          input_schema: STORY_DOC_OUTPUT_SCHEMA,
          strict: true,
        },
      ],
      tool_choice: { type: 'tool', name: STORY_DOC_TOOL_NAME },
      messages: [{ role: 'user', content: prompt }],
    });

    const toolUseBlock = response.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
    );
    if (!toolUseBlock) {
      throw new Error(`No tool_use block in Claude response (stop_reason: ${response.stop_reason})`);
    }

    const input = toolUseBlock.input as { mdx: string; storyVariants: { name: string; argsJson: string }[] };

    const storyVariants: StoryVariant[] = input.storyVariants.map((variant) => {
      let args: Record<string, unknown>;
      try {
        args = JSON.parse(variant.argsJson);
      } catch (err) {
        throw new Error(
          `Story variant "${variant.name}" has invalid argsJson: ${(err as Error).message}`
        );
      }
      return { name: variant.name, args };
    });

    return { mdx: input.mdx, storyVariants };
  }
}
