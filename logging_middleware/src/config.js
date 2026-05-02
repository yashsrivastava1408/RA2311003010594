const fs = require("fs");
const path = require("path");

function parseEnvFile(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    return {};
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const result = {};

  for (const rawLine of fileContents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    result[key] = value;
  }

  return result;
}

function resolveConfig(options = {}) {
  const envFileValues = parseEnvFile(options.envFilePath);
  const merged = {
    ...envFileValues,
    ...process.env,
    ...(options.overrides || {})
  };

  const baseUrl = (merged.EVALUATION_BASE_URL || "").replace(/\/+$/, "");
  const fallbackFile = merged.LOG_FALLBACK_FILE || "./logs/fallback.log";

  return {
    baseUrl,
    credentials: {
      email: merged.EVALUATION_EMAIL || "",
      name: merged.EVALUATION_NAME || "",
      rollNo: merged.EVALUATION_ROLL_NO || "",
      accessCode: merged.EVALUATION_ACCESS_CODE || "",
      clientID: merged.EVALUATION_CLIENT_ID || "",
      clientSecret: merged.EVALUATION_CLIENT_SECRET || ""
    },
    defaultStack: merged.LOG_STACK || "backend",
    fallbackFilePath: path.resolve(options.cwd || process.cwd(), fallbackFile)
  };
}

module.exports = {
  parseEnvFile,
  resolveConfig
};
