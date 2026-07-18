import path from 'node:path';
import fs from 'node:fs/promises';
import type { Command } from 'commander';
import { REPO_ROOT, TOOL_DIR } from '../paths.js';
import { createParser, parseComponent } from '../parser/index.js';
import { toComponentMetadata } from '../metadata.js';
import { loadFewShotExamples } from '../prompt/fewshot.js';
import { buildPrompt } from '../prompt/buildPrompt.js';
import { AnthropicClient } from '../client/AnthropicClient.js';
import { deriveTitlePrefix } from '../render/titlePrefix.js';
import { renderStoryFile } from '../render/storyFile.js';
import { formatTypeScript } from '../postprocess/format.js';
import { writeOrDiff } from '../postprocess/writeOrDiff.js';

interface GenerateCommandOptions {
  out: string;
  tsconfig: string;
}

export function registerGenerateCommand(program: Command) {
  program
    .command('generate <componentPath>')
    .description(
      'Parse a component, build a prompt from repo conventions, and call Claude to draft MDX docs + story variants'
    )
    .option('-o, --out <dir>', 'output directory for generated drafts', path.join(TOOL_DIR, '.output'))
    .option(
      '--tsconfig <path>',
      "tsconfig used to resolve the target project's types (paths, jsx, etc.)",
      path.join(REPO_ROOT, 'tsconfig.app.json')
    )
    .action(async (componentPath: string, options: GenerateCommandOptions) => {
      const absolutePath = path.isAbsolute(componentPath)
        ? componentPath
        : path.resolve(REPO_ROOT, componentPath);

      const parser = createParser({ tsconfigPath: path.resolve(options.tsconfig) });
      const doc = parseComponent(parser, absolutePath);
      const metadata = toComponentMetadata(doc, path.relative(REPO_ROOT, absolutePath));

      const fewshot = await loadFewShotExamples();
      const prompt = buildPrompt(metadata, fewshot);

      const client = new AnthropicClient();
      const output = await client.generate(prompt);

      // Raw JSON dump kept for debugging — cheap to keep alongside the real
      // file-write pipeline below.
      const outDir = path.resolve(options.out);
      await fs.mkdir(outDir, { recursive: true });
      const outFile = path.join(outDir, `${metadata.component}.storydoc.json`);
      await fs.writeFile(outFile, JSON.stringify(output, null, 2), 'utf-8');

      const titlePrefix = deriveTitlePrefix(metadata.sourceFile);
      const rawStoryCode = renderStoryFile(metadata, output.storyVariants, titlePrefix);
      const storyCode = await formatTypeScript(rawStoryCode);

      const componentDir = path.dirname(absolutePath);
      const storyTarget = path.join(componentDir, `${metadata.component}.stories.tsx`);
      const mdxTarget = path.join(componentDir, `${metadata.component}.mdx`);

      const storyResult = await writeOrDiff(storyTarget, storyCode);
      const mdxResult = await writeOrDiff(mdxTarget, output.mdx);

      console.log(`OK   ${componentPath} -> ${path.relative(REPO_ROOT, outFile)}`);
      console.log(`     mdx: ${output.mdx.length} chars`);
      console.log(`     storyVariants: ${output.storyVariants.map((v) => v.name).join(', ')}`);
      console.log(`     stories.tsx: ${storyResult.status} -> ${path.relative(REPO_ROOT, storyResult.path)}`);
      console.log(`     mdx file:    ${mdxResult.status} -> ${path.relative(REPO_ROOT, mdxResult.path)}`);
    });
}
