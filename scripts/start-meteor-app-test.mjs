import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, spawnSync } from "node:child_process";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const appDir = resolve(
  process.env.SLATEBOX_APP_DIR ||
    resolve(projectRoot, "../app.slatebox.com/web/app")
);
const settingsPath = resolve(
  process.env.SLATEBOX_APP_SETTINGS || resolve(appDir, "settings.dev.json")
);

function requirePath(path, label) {
  if (!existsSync(path)) {
    throw new Error(`${label} not found: ${path}`);
  }
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    env: process.env,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed (${result.status})`);
  }
}

requirePath(resolve(appDir, "package.json"), "Canonical Meteor app");
requirePath(settingsPath, "Meteor settings file");

// Exercise the exact consumer artifact, not the source tree or a stale tgz.
run("npm", ["run", "build"], projectRoot);
run("npm", ["pack", "--pack-destination", projectRoot], projectRoot);
const packageMeta = JSON.parse(
  readFileSync(resolve(projectRoot, "package.json"), "utf8")
);
const packedName = packageMeta.name.replace(/^@/, "").replace("/", "-");
const tarball = resolve(projectRoot, `${packedName}-${packageMeta.version}.tgz`);
requirePath(tarball, "Packed SlateboxJS artifact");
run(
  "npm",
  ["install", "--no-save", "--package-lock=false", tarball],
  appDir
);

const meteor = spawn(
  "meteor",
  ["run", "--settings", settingsPath],
  {
    cwd: appDir,
    stdio: "inherit",
    env: { ...process.env, PORT: process.env.PORT || "3000" },
  }
);

const stop = (signal) => {
  if (!meteor.pid) return;
  try {
    meteor.kill(signal);
  } catch {
    // The child may already have exited.
  }
};

process.on("SIGINT", () => stop("SIGINT"));
process.on("SIGTERM", () => stop("SIGTERM"));
meteor.on("error", (error) => {
  console.error("Unable to start Meteor app:", error);
  process.exitCode = 1;
});
meteor.on("exit", (code, signal) => {
  if (code && code !== 0) {
    console.error(`Meteor app exited with code ${code}${signal ? ` (${signal})` : ""}`);
  }
  process.exitCode = code || 0;
});
