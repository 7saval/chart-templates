#!/usr/bin/env node
import { Command } from 'commander';
import { registerParseCommand } from './commands/parse.js';

const program = new Command();
program
  .name('storydoc-ai')
  .description('StoryDoc AI — component metadata extraction PoC (Week 1)')
  .version('0.1.0');

registerParseCommand(program);

program.parseAsync(process.argv);
