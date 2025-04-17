const core = require("@actions/core");
const fs = require("fs").promises;
const path = require("path");

const EXTENSIONS = {
  python: [".py"],
  js: [".js", ".mjs", ".cjs"],
  ts: [".ts", ".mts"],
  asl: ".asl.json",
};

async function scanDirectoryForExtensions(dir, extensions) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const foundInSubdir = await scanDirectoryForExtensions(
          fullPath,
          extensions
        );
        if (foundInSubdir) return true;
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (extensions.includes(ext)) return true;
      }
    }
  } catch (err) {
    core.warning(`Failed to scan ${dir}: ${err.message}`);
  }
  return false;
}

async function detectLambdaLanguages(dir) {
  const result = {
    "lambda-python": false,
    "lambda-js": false,
    "lambda-ts": false,
  };

  try {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (EXTENSIONS.python.includes(ext)) result["lambda-python"] = true;
      else if (EXTENSIONS.js.includes(ext)) result["lambda-js"] = true;
      else if (EXTENSIONS.ts.includes(ext)) result["lambda-ts"] = true;

      if (Object.values(result).every(Boolean)) break;
    }
  } catch (err) {
    core.warning(`Could not read Lambda dir: ${err.message}`);
  }

  return result;
}

async function main() {
  try {
    const rootDir = process.cwd();
    const result = {
      "lambda-python": false,
      "lambda-js": false,
      "lambda-ts": false,
      "glue-python": false,
      "state-machine": false,
      "lambda-layer-python": false,
      "lambda-layer-js": false,
      "lambda-layer-ts": false,
    };

    // Lambda
    const lambdaSrcDir = path.join(rootDir, "lambda", "src");
    try {
      const stats = await fs.stat(lambdaSrcDir);
      if (stats.isDirectory()) {
        const lambdaResults = await detectLambdaLanguages(lambdaSrcDir);
        Object.assign(result, lambdaResults);
      }
    } catch (_) {}

    // Glue
    const glueScriptDir = path.join(rootDir, "glue", "script");
    try {
      const stats = await fs.stat(glueScriptDir);
      if (stats.isDirectory()) {
        const glueFiles = await fs.readdir(glueScriptDir);
        result["glue-python"] = glueFiles.some(
          (file) => path.extname(file).toLowerCase() === ".py"
        );
      }
    } catch (_) {}

    // State Machine
    const stateMachineDir = path.join(rootDir, "state-machine");
    try {
      const stats = await fs.stat(stateMachineDir);
      if (stats.isDirectory()) {
        const stateFiles = await fs.readdir(stateMachineDir);
        result["state-machine"] = stateFiles.some((file) =>
          file.toLowerCase().endsWith(EXTENSIONS.asl)
        );
      }
    } catch (_) {}

    // Python Layer
    const pythonLayerDir = path.join(rootDir, "lambda-layer");
    try {
      const stats = await fs.stat(pythonLayerDir);
      if (stats.isDirectory()) {
        result["lambda-layer-python"] = await scanDirectoryForExtensions(
          pythonLayerDir,
          EXTENSIONS.python
        );
        result["lambda-layer-js"] = await scanDirectoryForExtensions(
          pythonLayerDir,
          EXTENSIONS.js
        );
        result["lambda-layer-ts"] = await scanDirectoryForExtensions(
          pythonLayerDir,
          EXTENSIONS.ts
        );
      }
    } catch (_) {}

    core.setOutput("services-used", JSON.stringify(result));
  } catch (error) {
    core.setFailed(`Action failed: ${error.stack}`);
  }
}

main();
