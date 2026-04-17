#!/usr/bin/env -S npx tsx
import { promises as fs } from "node:fs";
import * as path from "node:path";
import { argv, cwd, env, exit, stdout } from "node:process";

type InitReport = {
  written: string[];
  skipped: string[];
  settingsAction: "created" | "merged" | "already-set" | "unchanged";
};

type UpgradeEntry = {
  target: string;
  source: string;
  status: "changed" | "new";
  diff: string;
};

type UpgradePlan = {
  changes: UpgradeEntry[];
  unchangedCount: number;
};

const LANG_PACKS = ["typescript", "python", "rust"] as const;
const TEMPLATE_ROOTS = ["universal", ...LANG_PACKS] as const;
const SETTINGS_KEY = "autoMemoryDirectory";
const SETTINGS_VALUE = ".claude/memory/automemory";
const HOOK_SCRIPT_EXT = ".sh";

function requirePluginRoot(): string {
  const root = env.CLAUDE_PLUGIN_ROOT;
  if (!root || root.trim() === "") {
    console.error(
      "vaquita: CLAUDE_PLUGIN_ROOT is not set. This is required to locate templates.",
    );
    console.error(
      "If you installed vaquita via the Claude Code plugin system, this should be set automatically.",
    );
    exit(1);
  }
  return root;
}

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function readFileOrNull(p: string): Promise<string | null> {
  try {
    return await fs.readFile(p, "utf8");
  } catch {
    return null;
  }
}

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (e.isFile()) {
      files.push(full);
    }
  }
  return files;
}

/**
 * Map a source template path (absolute, under $PLUGIN_ROOT/templates/<root>/...)
 * to its destination path (absolute, under $TARGET).
 *
 * Rules:
 *   templates/universal/settings.json   -> <TARGET>/settings.json
 *   templates/universal/<rest>          -> <TARGET>/.claude/<rest>
 *   templates/<lang>/<kind>/<rest>      -> <TARGET>/.claude/<kind>/<lang>/<rest>
 */
function mapTemplatePath(
  sourceAbs: string,
  templatesRoot: string,
  targetRoot: string,
): string {
  const rel = path.relative(templatesRoot, sourceAbs);
  const segs = rel.split(path.sep);
  const pack = segs[0];
  const inner = segs.slice(1);

  if (pack === "universal") {
    if (inner.length === 1 && inner[0] === "settings.json") {
      return path.join(targetRoot, "settings.json");
    }
    return path.join(targetRoot, ".claude", ...inner);
  }

  // language packs
  if ((LANG_PACKS as readonly string[]).includes(pack)) {
    const [kind, ...rest] = inner;
    return path.join(targetRoot, ".claude", kind, pack, ...rest);
  }

  throw new Error(`vaquita: unexpected template pack: ${pack}`);
}

function interpolate(
  content: string,
  vars: Record<string, string>,
): string {
  return content.replace(/\{\{(\w+)\}\}/g, (_m, key: string) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : "",
  );
}

async function detectTestCommand(targetRoot: string): Promise<string> {
  const pkg = await readFileOrNull(path.join(targetRoot, "package.json"));
  if (pkg) {
    try {
      const parsed = JSON.parse(pkg);
      if (parsed?.scripts?.test) return "npm test";
    } catch {
      // ignore
    }
  }
  if (await exists(path.join(targetRoot, "pyproject.toml"))) return "pytest";
  if (await exists(path.join(targetRoot, "Cargo.toml"))) return "cargo test";
  return "";
}

async function detectBuildCommand(targetRoot: string): Promise<string> {
  const pkg = await readFileOrNull(path.join(targetRoot, "package.json"));
  if (pkg) {
    try {
      const parsed = JSON.parse(pkg);
      if (parsed?.scripts?.build) return "npm run build";
    } catch {
      // ignore
    }
  }
  if (await exists(path.join(targetRoot, "Cargo.toml"))) return "cargo build";
  // Python has no canonical build command; leave blank
  return "";
}

async function buildVars(targetRoot: string): Promise<Record<string, string>> {
  return {
    PROJECT_NAME: path.basename(targetRoot),
    STACK: "typescript, python, rust",
    TEST_CMD: await detectTestCommand(targetRoot),
    BUILD_CMD: await detectBuildCommand(targetRoot),
  };
}

function isHookScript(destPath: string): boolean {
  return (
    destPath.includes(`/.claude/hooks/scripts/`) &&
    destPath.endsWith(HOOK_SCRIPT_EXT)
  );
}

async function writeFileCreatingDirs(
  destPath: string,
  content: string | Buffer,
): Promise<void> {
  await fs.mkdir(path.dirname(destPath), { recursive: true });
  await fs.writeFile(destPath, content);
}

async function mergeSettings(
  templatesRoot: string,
  targetRoot: string,
): Promise<InitReport["settingsAction"]> {
  const destPath = path.join(targetRoot, "settings.json");
  const templatePath = path.join(templatesRoot, "universal", "settings.json");

  if (!(await exists(destPath))) {
    const templateContent = await fs.readFile(templatePath, "utf8");
    await writeFileCreatingDirs(destPath, templateContent);
    return "created";
  }

  const raw = await fs.readFile(destPath, "utf8");
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.error(
      `vaquita: existing ${destPath} is not valid JSON; leaving it untouched.`,
    );
    return "unchanged";
  }

  if (parsed[SETTINGS_KEY] !== undefined) {
    return "already-set";
  }

  parsed[SETTINGS_KEY] = SETTINGS_VALUE;
  await fs.writeFile(destPath, JSON.stringify(parsed, null, 2) + "\n");
  return "merged";
}

async function runInit(): Promise<void> {
  const pluginRoot = requirePluginRoot();
  const targetRoot = cwd();
  const templatesRoot = path.join(pluginRoot, "templates");

  if (!(await exists(templatesRoot))) {
    console.error(
      `vaquita: expected templates directory at ${templatesRoot} but it does not exist.`,
    );
    exit(1);
  }

  const vars = await buildVars(targetRoot);
  const report: InitReport = {
    written: [],
    skipped: [],
    settingsAction: "unchanged",
  };

  for (const pack of TEMPLATE_ROOTS) {
    const packRoot = path.join(templatesRoot, pack);
    if (!(await exists(packRoot))) continue;

    const files = await walk(packRoot);
    for (const sourceAbs of files) {
      // settings.json is handled separately via narrow merge.
      if (
        pack === "universal" &&
        path.relative(packRoot, sourceAbs) === "settings.json"
      ) {
        continue;
      }

      const destPath = mapTemplatePath(sourceAbs, templatesRoot, targetRoot);
      const relForReport = path.relative(targetRoot, destPath);

      if (await exists(destPath)) {
        report.skipped.push(relForReport);
        continue;
      }

      const content = await fs.readFile(sourceAbs, "utf8");
      const rendered = interpolate(content, vars);
      await writeFileCreatingDirs(destPath, rendered);

      if (isHookScript(destPath)) {
        await fs.chmod(destPath, 0o755);
      }

      report.written.push(relForReport);
    }
  }

  report.settingsAction = await mergeSettings(templatesRoot, targetRoot);

  printInitReport(report, vars);
}

function printInitReport(
  report: InitReport,
  vars: Record<string, string>,
): void {
  const { written, skipped, settingsAction } = report;
  stdout.write("vaquita-init: complete\n");
  stdout.write(`  project:  ${vars.PROJECT_NAME}\n`);
  stdout.write(`  stack:    ${vars.STACK}\n`);
  stdout.write(`  test_cmd: ${vars.TEST_CMD || "(blank)"}\n`);
  stdout.write(`  build_cmd:${vars.BUILD_CMD ? " " + vars.BUILD_CMD : " (blank)"}\n`);
  stdout.write(`  settings.json: ${settingsAction}\n`);

  stdout.write(`\nwritten (${written.length}):\n`);
  for (const p of written.sort()) stdout.write(`  + ${p}\n`);

  stdout.write(`\nskipped (${skipped.length}):\n`);
  for (const p of skipped.sort()) stdout.write(`  = ${p}\n`);
}

function unifiedDiff(
  a: string,
  b: string,
  pathLabel: string,
): string {
  // Minimal line-based diff without external deps.
  const aLines = a.split("\n");
  const bLines = b.split("\n");
  const out: string[] = [];
  out.push(`--- ${pathLabel} (current)`);
  out.push(`+++ ${pathLabel} (template)`);

  // Use a naive longest-common-subsequence-free diff: Myers is overkill for
  // template-scale files. We emit context by walking both sequences.
  let i = 0;
  let j = 0;
  while (i < aLines.length || j < bLines.length) {
    if (i < aLines.length && j < bLines.length && aLines[i] === bLines[j]) {
      out.push(`  ${aLines[i]}`);
      i++;
      j++;
      continue;
    }
    // Find next matching line within a small window.
    const window = 50;
    let matched = false;
    for (let k = 1; k < window && !matched; k++) {
      if (
        j + k < bLines.length &&
        i < aLines.length &&
        aLines[i] === bLines[j + k]
      ) {
        for (let x = 0; x < k; x++) out.push(`+ ${bLines[j + x]}`);
        j += k;
        matched = true;
        break;
      }
      if (
        i + k < aLines.length &&
        j < bLines.length &&
        aLines[i + k] === bLines[j]
      ) {
        for (let x = 0; x < k; x++) out.push(`- ${aLines[i + x]}`);
        i += k;
        matched = true;
        break;
      }
    }
    if (matched) continue;
    if (i < aLines.length) {
      out.push(`- ${aLines[i]}`);
      i++;
    }
    if (j < bLines.length) {
      out.push(`+ ${bLines[j]}`);
      j++;
    }
  }
  return out.join("\n");
}

async function buildUpgradePlan(
  pluginRoot: string,
  targetRoot: string,
): Promise<UpgradePlan> {
  const templatesRoot = path.join(pluginRoot, "templates");
  const vars = await buildVars(targetRoot);
  const changes: UpgradeEntry[] = [];
  let unchangedCount = 0;

  for (const pack of TEMPLATE_ROOTS) {
    const packRoot = path.join(templatesRoot, pack);
    if (!(await exists(packRoot))) continue;

    const files = await walk(packRoot);
    for (const sourceAbs of files) {
      // settings.json is not part of the upgrade diff surface. Its merge
      // rule is fixed (narrow key merge only).
      if (
        pack === "universal" &&
        path.relative(packRoot, sourceAbs) === "settings.json"
      ) {
        continue;
      }

      const destPath = mapTemplatePath(sourceAbs, templatesRoot, targetRoot);
      const relForReport = path.relative(targetRoot, destPath);
      const templateContent = interpolate(
        await fs.readFile(sourceAbs, "utf8"),
        vars,
      );

      if (!(await exists(destPath))) {
        changes.push({
          target: relForReport,
          source: sourceAbs,
          status: "new",
          diff: templateContent
            .split("\n")
            .map((l) => `+ ${l}`)
            .join("\n"),
        });
        continue;
      }

      const current = await fs.readFile(destPath, "utf8");
      if (current === templateContent) {
        unchangedCount++;
        continue;
      }

      changes.push({
        target: relForReport,
        source: sourceAbs,
        status: "changed",
        diff: unifiedDiff(current, templateContent, relForReport),
      });
    }
  }

  return { changes, unchangedCount };
}

async function runUpgradePlan(): Promise<void> {
  const pluginRoot = requirePluginRoot();
  const targetRoot = cwd();

  if (!(await exists(path.join(targetRoot, ".claude")))) {
    console.error(
      "vaquita: no .claude/ directory in the current project. Run /vaquita:init first.",
    );
    exit(1);
  }

  const plan = await buildUpgradePlan(pluginRoot, targetRoot);
  stdout.write(JSON.stringify(plan, null, 2) + "\n");
}

async function runUpgradeApply(targetPaths: string[]): Promise<void> {
  const pluginRoot = requirePluginRoot();
  const targetRoot = cwd();
  const vars = await buildVars(targetRoot);

  if (!(await exists(path.join(targetRoot, ".claude")))) {
    console.error(
      "vaquita: no .claude/ directory in the current project. Run /vaquita:init first.",
    );
    exit(1);
  }

  const plan = await buildUpgradePlan(pluginRoot, targetRoot);
  const wanted = new Set(targetPaths);
  const applied: string[] = [];
  const notFound: string[] = [];

  for (const targetPath of wanted) {
    const entry = plan.changes.find((c) => c.target === targetPath);
    if (!entry) {
      notFound.push(targetPath);
      continue;
    }
    const destPath = path.join(targetRoot, entry.target);
    const templateContent = interpolate(
      await fs.readFile(entry.source, "utf8"),
      vars,
    );
    await writeFileCreatingDirs(destPath, templateContent);
    if (isHookScript(destPath)) await fs.chmod(destPath, 0o755);
    applied.push(entry.target);
  }

  stdout.write(`vaquita-upgrade: applied ${applied.length}\n`);
  for (const p of applied) stdout.write(`  + ${p}\n`);
  if (notFound.length > 0) {
    stdout.write(`\nnot-found (no pending change for these paths):\n`);
    for (const p of notFound) stdout.write(`  ? ${p}\n`);
  }
}

function usage(): never {
  console.error(
    "Usage:\n" +
      "  vaquita init\n" +
      "  vaquita upgrade plan\n" +
      "  vaquita upgrade apply <path> [<path>...]",
  );
  exit(2);
}

async function main(): Promise<void> {
  const args = argv.slice(2);
  const cmd = args[0];

  switch (cmd) {
    case "init":
      await runInit();
      return;
    case "upgrade": {
      const sub = args[1];
      if (sub === "plan") {
        await runUpgradePlan();
        return;
      }
      if (sub === "apply") {
        const paths = args.slice(2);
        if (paths.length === 0) {
          console.error("vaquita: upgrade apply requires at least one path");
          exit(2);
        }
        await runUpgradeApply(paths);
        return;
      }
      usage();
      return;
    }
    default:
      usage();
  }
}

main().catch((err) => {
  console.error(`vaquita: ${err instanceof Error ? err.message : String(err)}`);
  exit(1);
});
