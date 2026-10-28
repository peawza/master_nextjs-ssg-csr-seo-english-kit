import { execFileSync } from 'node:child_process';

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

const base = process.env.BASE_SHA ?? process.env.GITHUB_BASE_SHA;
if (!base) {
  console.error('BASE_SHA not set. This PR enforcement script must run with a pull request base SHA.');
  process.exit(2);
}

let changed;
try {
  changed = git('diff', '--name-only', '--diff-filter=ACMRT', `${base}...HEAD`)
    .split('\n').map((s) => s.trim()).filter(Boolean);
} catch (error) {
  console.error('Could not inspect git diff. Make sure checkout fetch-depth is 0.', error.message);
  process.exit(2);
}

const source = changed.filter((file) =>
  /^src\/|^scripts\/|^tests\/|^public\/|^(package\.json|next\.config\.ts|tsconfig\.json|eslint\.config\.mjs)$/.test(file));
if (!source.length) {
  console.log('No source-level changes; log gate does not apply.');
  process.exit(0);
}

const logs = changed.filter((file) =>
  /^docs\/agent-logs\/\d{4}-\d{2}-\d{2}-[A-Za-z0-9_-]+\.md$/.test(file) &&
  file !== 'docs/agent-logs/TEMPLATE.md');
const stateChanged = changed.includes('docs/PROJECT_STATE.md');

if (!logs.length || !stateChanged) {
  console.error('PR changed source files but is missing a dated docs/agent-logs/*.md task log and/or docs/PROJECT_STATE.md update.');
  console.error(`Source files: ${source.join(', ')}`);
  console.error(`Task logs: ${logs.length}; state updated: ${stateChanged}`);
  process.exit(1);
}
console.log(`Agent log check passed: ${logs.length} updated log(s) + project state for ${source.length} source file(s).`);
