#!/usr/bin/env node
import 'dotenv/config';
import { Command } from 'commander';
import { registerParseCommand } from './commands/parse.js';
import { registerGenerateCommand } from './commands/generate.js';

const program = new Command();
program
  .name('storydoc-ai')
  .description('StoryDoc AI — component metadata extraction + Claude-generated Storybook drafts')
  .version('0.1.0');

registerParseCommand(program);
registerGenerateCommand(program);

program.parseAsync(process.argv);
