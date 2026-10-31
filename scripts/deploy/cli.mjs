// DEPLOY-001 shared helper for build.bat, preview.bat and deploy-cloudflare.bat.
//
// - Reads .env as plain KEY=VALUE data (no shell evaluation, no expansion);
//   process environment values take precedence.
// - Runs every external command with an argument array (no shell), so paths
//   with spaces or shell metacharacters are passed through unchanged.
// - Never prints the API token; the token reaches Wrangler only through the
//   environment of `docker run` (`-e NAME` without a value), never argv,
//   build args or image layers.
// - Every build exports a fresh artifact; a failed build leaves no artifact,
//   so a stale one can never be uploaded.

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { createServer } from 'node:net';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const artifactParent = join(projectRoot, '.artifacts');
const artifactDir = join(artifactParent, 'out');
const WRANGLER_VERSION = '4.155.0';

const DEFAULTS = {
  DOCKER_IMAGE_NAME: 'villa-luma',
  DOCKER_IMAGE_TAG: 'local',
  PREVIEW_PORT: '4173',
  CLOUDFLARE_ACCOUNT_ID: '',
  CLOUDFLARE_API_TOKEN: '',
  CLOUDFLARE_PAGES_PROJECT_NAME: '',
  CLOUDFLARE_PRODUCTION_BRANCH: '',
  CLOUDFLARE_DEPLOY_BRANCH: 'preview',
  DEPLOY_TARGET: 'preview',
};
const SECRET_KEYS = new Set(['CLOUDFLARE_API_TOKEN']);
const REQUIRED_ARTIFACT_FILES = ['index.html', 'services/index.html', '404.html', 'robots.txt', 'sitemap.xml', '_headers'];

class UsageError extends Error {}

const log = (scope, message) => console.log(`[${scope}] ${message}`);

/** Parse .env text. Supports KEY=VALUE, optional matching single/double quotes and `#` comments. */
export function parseEnv(text) {
  const values = {};
  const errors = [];
  text.split(/\r?\n/).forEach((raw, index) => {
    const line = raw.trim();
    if (!line || line.startsWith('#')) return;
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) { errors.push(`.env line ${index + 1}: expected KEY=VALUE`); return; }
    let value = match[2];
    const quote = value[0];
    if ((quote === '"' || quote === "'") && value.length >= 2 && value.endsWith(quote)) value = value.slice(1, -1);
    else value = value.replace(/\s+#.*$/, '').trim();
    values[match[1]] = value;
  });
  return { values, errors };
}

/** Defaults < .env < process environment (non-empty values only). */
export function loadConfig(env = process.env, envFile = join(projectRoot, '.env')) {
  let fileValues = {};
  if (existsSync(envFile)) {
    const parsed = parseEnv(readFileSync(envFile, 'utf8'));
    if (parsed.errors.length) throw new UsageError(parsed.errors.join('\n'));
    fileValues = parsed.values;
  }
  const config = {};
  for (const key of Object.keys(DEFAULTS)) {
    const fromEnv = env[key];
    config[key] = fromEnv !== undefined && fromEnv !== '' ? fromEnv : (fileValues[key] ?? DEFAULTS[key]);
  }
  return config;
}

/** Validate only what the command needs. Messages name keys, never secret values. */
export function validateConfig(config, command, { confirmProduction = false } = {}) {
  const errors = [];
  if (!/^[a-z0-9]+(?:[._-][a-z0-9]+)*(?:\/[a-z0-9]+(?:[._-][a-z0-9]+)*)*$/.test(config.DOCKER_IMAGE_NAME)) errors.push('DOCKER_IMAGE_NAME must be a lowercase Docker repository name, e.g. villa-luma');
  if (!/^[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}$/.test(config.DOCKER_IMAGE_TAG)) errors.push('DOCKER_IMAGE_TAG must be a valid Docker tag, e.g. local');
  if (command === 'preview') {
    const port = Number(config.PREVIEW_PORT);
    if (!Number.isInteger(port) || port < 1 || port > 65535) errors.push('PREVIEW_PORT must be an integer from 1 to 65535');
  }
  if (command === 'deploy') {
    if (!/^[0-9a-f]{32}$/i.test(config.CLOUDFLARE_ACCOUNT_ID)) errors.push('CLOUDFLARE_ACCOUNT_ID is required (32 hex characters)');
    if (!config.CLOUDFLARE_API_TOKEN) errors.push('CLOUDFLARE_API_TOKEN is required');
    else if (/\s/.test(config.CLOUDFLARE_API_TOKEN)) errors.push('CLOUDFLARE_API_TOKEN must not contain whitespace');
    if (!/^[a-z0-9][a-z0-9-]{0,57}$/.test(config.CLOUDFLARE_PAGES_PROJECT_NAME)) errors.push('CLOUDFLARE_PAGES_PROJECT_NAME is required (lowercase letters, digits, dashes; max 58)');
    const branch = /^[A-Za-z0-9][A-Za-z0-9._/-]*$/;
    if (!branch.test(config.CLOUDFLARE_PRODUCTION_BRANCH)) errors.push('CLOUDFLARE_PRODUCTION_BRANCH is required and must match the Pages project production branch');
    if (!['preview', 'production'].includes(config.DEPLOY_TARGET)) errors.push('DEPLOY_TARGET must be preview or production');
    if (config.DEPLOY_TARGET === 'preview') {
      if (!branch.test(config.CLOUDFLARE_DEPLOY_BRANCH)) errors.push('CLOUDFLARE_DEPLOY_BRANCH is required for preview deployments');
      else if (config.CLOUDFLARE_DEPLOY_BRANCH === config.CLOUDFLARE_PRODUCTION_BRANCH) errors.push('CLOUDFLARE_DEPLOY_BRANCH must differ from CLOUDFLARE_PRODUCTION_BRANCH, or a preview would replace production');
    }
    if (config.DEPLOY_TARGET === 'production' && !confirmProduction) errors.push('DEPLOY_TARGET=production also requires the --confirm-production flag (check SEO-008 release readiness first)');
  }
  return errors;
}

/** Run a command without a shell; return the exit status. */
function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: projectRoot, stdio: 'inherit', windowsHide: true, ...options });
  if (result.error) throw new UsageError(`${command} could not be started: ${result.error.code || result.error.message}`);
  return result;
}

function runOrFail(scope, command, args, options) {
  const result = run(command, args, options);
  if (result.status !== 0) throw new UsageError(`${scope}: ${command} ${args[0]} failed with exit code ${result.status}`);
  return result;
}

function requireDocker() {
  const result = spawnSync('docker', ['info', '--format', '{{.OSType}}'], { encoding: 'utf8', windowsHide: true });
  if (result.error?.code === 'ENOENT') throw new UsageError('Docker CLI not found. Install Docker Desktop and make sure `docker` is on PATH.');
  if (result.status !== 0) throw new UsageError('Docker engine is not running. Start Docker Desktop and wait until it reports "Engine running".');
  if (result.stdout.trim() !== 'linux') throw new UsageError(`Docker is using ${result.stdout.trim() || 'unknown'} containers. Switch Docker Desktop to Linux containers.`);
}

function assertMountable(path) {
  // --mount uses comma-separated fields; spaces are fine, commas are not.
  if (path.includes(',')) throw new UsageError(`Path contains a comma and cannot be bind-mounted safely: ${path}`);
}

function portIsFree(port) {
  return new Promise(resolvePromise => {
    const server = createServer();
    server.once('error', () => resolvePromise(false));
    server.once('listening', () => server.close(() => resolvePromise(true)));
    server.listen(port, '127.0.0.1');
  });
}

function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? listFiles(full) : [full];
  });
}

/** Check the exact artifact that will be uploaded. */
function verifyArtifact(config) {
  const missing = REQUIRED_ARTIFACT_FILES.filter(file => !existsSync(join(artifactDir, file)));
  if (missing.length) throw new UsageError(`artifact is incomplete, missing: ${missing.join(', ')}`);
  const files = listFiles(artifactDir);
  if (files.some(file => /(^|[\\/])\.env(\.|$)|\.dev\.vars$/.test(file))) throw new UsageError('artifact contains an environment file; refusing to continue');
  const token = config.CLOUDFLARE_API_TOKEN;
  if (token) {
    for (const file of files) {
      if (statSync(file).size > 5_000_000) continue;
      if (readFileSync(file).includes(token)) throw new UsageError(`artifact contains the API token (${file}); refusing to continue`);
    }
  }
  // Same static HTML/SEO assertions as `npm run verify:html`, against this artifact.
  const verify = spawnSync(process.execPath, [join(projectRoot, 'scripts', 'verify-static-html.mjs')], { cwd: artifactParent, encoding: 'utf8', windowsHide: true });
  if (verify.status !== 0) {
    const failed = `${verify.stdout}${verify.stderr}`.split(/\r?\n/).filter(line => line.startsWith('FAIL') || /failures|Error/.test(line));
    throw new UsageError(`verify:html failed on the artifact:\n  ${failed.join('\n  ')}`);
  }
  log('verify', `artifact OK: ${files.length} files, required routes present, verify:html passed`);
}

/** Build inside Docker (lint, typecheck, build, verify:html) and export a fresh artifact. */
function buildArtifact(config) {
  requireDocker();
  rmSync(artifactDir, { recursive: true, force: true });
  log('build', 'building in Docker (npm ci, lint, typecheck, next build, verify:html)...');
  const result = run('docker', ['build', '--target', 'artifact', '--output', `type=local,dest=${artifactDir}`, '--progress', 'plain', '.']);
  if (result.status !== 0) {
    rmSync(artifactDir, { recursive: true, force: true });
    throw new UsageError(`build failed with exit code ${result.status}; no artifact was produced`);
  }
  verifyArtifact(config);
  log('build', `artifact: ${artifactDir}`);
}

async function preview(config) {
  requireDocker();
  const port = Number(config.PREVIEW_PORT);
  if (!(await portIsFree(port))) throw new UsageError(`port ${port} is already in use. Stop the other process or set PREVIEW_PORT.`);
  const image = `${config.DOCKER_IMAGE_NAME}:${config.DOCKER_IMAGE_TAG}`;
  log('preview', `building ${image}...`);
  runOrFail('preview', 'docker', ['build', '--target', 'preview', '--tag', image, '--progress', 'plain', '.']);
  log('preview', `serving http://127.0.0.1:${port}/  (Ctrl+C to stop)`);
  const result = run('docker', ['run', '--rm', '--init', '--read-only', '--cap-drop', 'ALL', '--security-opt', 'no-new-privileges', '--publish', `127.0.0.1:${port}:4173`, image]);
  // 130 = Ctrl+C (SIGINT), 143 = `docker stop` (SIGTERM): both are normal ways to stop the preview.
  if (![0, 130, 143].includes(result.status)) throw new UsageError(`preview container exited with code ${result.status}`);
}

function gitInfo() {
  const git = args => spawnSync('git', args, { cwd: projectRoot, encoding: 'utf8', windowsHide: true });
  const hash = git(['rev-parse', 'HEAD']);
  if (hash.status !== 0) return undefined;
  return {
    hash: hash.stdout.trim(),
    message: git(['log', '-1', '--format=%s']).stdout.trim().slice(0, 300),
    dirty: git(['status', '--porcelain']).stdout.trim().length > 0,
  };
}

function deploy(config) {
  const branch = config.DEPLOY_TARGET === 'production' ? config.CLOUDFLARE_PRODUCTION_BRANCH : config.CLOUDFLARE_DEPLOY_BRANCH;
  log('deploy', `target=${config.DEPLOY_TARGET} project=${config.CLOUDFLARE_PAGES_PROJECT_NAME} branch=${branch}`);
  assertMountable(artifactDir);
  buildArtifact(config);

  const wranglerImage = `${config.DOCKER_IMAGE_NAME}-wrangler:${WRANGLER_VERSION}`;
  log('deploy', `preparing Wrangler ${WRANGLER_VERSION} image...`);
  runOrFail('deploy', 'docker', ['build', '--target', 'wrangler', '--build-arg', `WRANGLER_VERSION=${WRANGLER_VERSION}`, '--tag', wranglerImage, '--progress', 'plain', '.']);

  const args = ['pages', 'deploy', 'out', '--project-name', config.CLOUDFLARE_PAGES_PROJECT_NAME, '--branch', branch];
  const git = gitInfo();
  if (git) args.push('--commit-hash', git.hash, '--commit-message', git.message, `--commit-dirty=${git.dirty}`);

  log('deploy', 'uploading the artifact built above...');
  const result = spawnSync('docker', [
    'run', '--rm', '--init', '--cap-drop', 'ALL', '--security-opt', 'no-new-privileges',
    // Names only: Docker copies the values from this process's environment.
    '--env', 'CLOUDFLARE_API_TOKEN', '--env', 'CLOUDFLARE_ACCOUNT_ID', '--env', 'WRANGLER_SEND_METRICS=false', '--env', 'CI=true',
    '--mount', `type=bind,source=${artifactDir},target=/home/node/deploy/out,readonly`,
    wranglerImage, ...args,
  ], {
    cwd: projectRoot,
    encoding: 'utf8',
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, CLOUDFLARE_API_TOKEN: config.CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID: config.CLOUDFLARE_ACCOUNT_ID },
  });
  if (result.error) throw new UsageError(`docker could not be started: ${result.error.code || result.error.message}`);
  const redact = text => (text || '').split(config.CLOUDFLARE_API_TOKEN).join('***');
  process.stdout.write(redact(result.stdout));
  process.stderr.write(redact(result.stderr));
  if (result.status !== 0) throw new UsageError(`upload failed with exit code ${result.status}. Check the token (Account > Cloudflare Pages > Edit), account ID and project name.`);
  const url = redact(result.stdout).match(/https:\/\/[^\s]+\.pages\.dev[^\s]*/)?.[0];
  log('deploy', url ? `deployment URL: ${url}` : 'upload finished; the deployment URL is in the Wrangler output above');
}

const COMMANDS = ['build', 'preview', 'deploy'];
const USAGE = `Usage: node scripts/deploy/cli.mjs <command> [--confirm-production]
  build              Build in Docker and export a fresh, verified artifact to .artifacts/out
  preview            Build the preview image and serve it on http://127.0.0.1:PREVIEW_PORT
  deploy             Validate config, build, verify, then upload that artifact to Cloudflare Pages
  check [command]    Validate configuration (default: all commands) without running Docker`;

async function main(argv) {
  const confirmProduction = argv.includes('--confirm-production');
  const [command, target, ...rest] = argv.filter(arg => arg !== '--confirm-production');
  const valid = command === 'check' ? (target === undefined || COMMANDS.includes(target)) && !rest.length : COMMANDS.includes(command) && target === undefined;
  if (!valid) throw new UsageError(USAGE);
  const config = loadConfig();

  if (command === 'check') {
    let invalid = false;
    for (const name of target ? [target] : COMMANDS) {
      const errors = validateConfig(config, name, { confirmProduction });
      invalid ||= errors.length > 0;
      log('check', `${name}: ${errors.length ? 'INVALID' : 'OK'}`);
      errors.forEach(error => log('check', `  - ${error}`));
    }
    const shown = Object.fromEntries(Object.entries(config).map(([key, value]) => [key, SECRET_KEYS.has(key) ? (value ? '(set)' : '(empty)') : value]));
    console.log(shown);
    if (invalid) process.exitCode = 1;
    return;
  }

  const errors = validateConfig(config, command, { confirmProduction });
  if (errors.length) throw new UsageError(`invalid configuration (.env or environment):\n  - ${errors.join('\n  - ')}`);
  if (command === 'build') buildArtifact(config);
  if (command === 'preview') await preview(config);
  if (command === 'deploy') deploy(config);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch(error => {
    console.error(error instanceof UsageError ? `ERROR ${error.message}` : error);
    process.exit(1);
  });
}
