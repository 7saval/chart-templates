import path from 'node:path';
import fs from 'node:fs/promises';
import type { Command } from 'commander';
import { REPO_ROOT, TOOL_DIR } from '../paths.js';
import { createParser, parseComponent } from '../parser/index.js';
import { toComponentMetadata } from '../metadata.js';

interface ParseCommandOptions {
  out: string;
  tsconfig: string;
}

export function registerParseCommand(program: Command) {
  program
    .command('parse <componentPaths...>')
    .description(
      'Parse one or more component files with react-docgen-typescript and dump extracted metadata as JSON'
    )
    .option('-o, --out <dir>', 'output directory for JSON dumps', path.join(TOOL_DIR, '.output'))
    .option(
      '--tsconfig <path>',
      "tsconfig used to resolve the target project's types (paths, jsx, etc.)",
      path.join(REPO_ROOT, 'tsconfig.app.json')
    )
    .action(async (componentPaths: string[], options: ParseCommandOptions) => {
      const parser = createParser({ tsconfigPath: path.resolve(options.tsconfig) });
      const outDir = path.resolve(options.out);
      await fs.mkdir(outDir, { recursive: true });

      for (const componentPath of componentPaths) {
        const absolutePath = path.isAbsolute(componentPath)
          ? componentPath
          : path.resolve(REPO_ROOT, componentPath);

        try {
          const doc = parseComponent(parser, absolutePath);
          const metadata = toComponentMetadata(doc, path.relative(REPO_ROOT, absolutePath));
          const dump = { ...metadata, extractedAt: new Date().toISOString() };

          const outFile = path.join(outDir, `${doc.displayName}.json`);
          await fs.writeFile(outFile, JSON.stringify(dump, null, 2), 'utf-8');
          console.log(
            `OK   ${componentPath} -> ${path.relative(REPO_ROOT, outFile)} (${dump.props.length} props)`
          );
        } catch (err) {
          console.error(`FAIL ${componentPath}: ${(err as Error).message}`);
        }
      }
    });
}
