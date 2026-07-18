import type { StoryDocOutput } from '../schema/storyDocOutput.js';

// Schema enforcement is bound to the fixed StoryDocOutput shape, so it isn't
// passed per-call — each implementation (AnthropicClient, a future
// LocalLLMClient for closed-network deployment) encodes it internally.
export interface LLMClient {
  generate(prompt: string): Promise<StoryDocOutput>;
}
