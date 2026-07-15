import path from 'node:path';
import { fileURLToPath } from 'node:url';

// This file lives at tools/storydoc-ai/src/paths.ts (dev, via tsx)
// or tools/storydoc-ai/dist/paths.js (after `npm run build`) — both are
// exactly one directory below the package root, so the same two `..`
// hops resolve correctly in both dev and compiled modes.
export const TOOL_DIR = path.resolve(fileURLToPath(import.meta.url), '..', '..');
export const REPO_ROOT = path.resolve(TOOL_DIR, '..', '..');
