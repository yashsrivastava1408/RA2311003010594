const fs = require("fs");
const path = require("path");
const { ALLOWED_LEVELS, ALLOWED_PACKAGES, ALLOWED_STACKS } = require("./constants");
const { resolveConfig } = require("./config");
const { sendJson } = require("./httpClient");
const { TokenManager } = require("./tokenManager");

function assertAllowedValue(label, value, allowedValues) {
  if (!allowedValues.has(value)) {
    throw new Error(`Invalid ${label}: ${value}`);
  }
}

function ensureDirectoryExists(filePath) {
  const directory = path.dirname(filePath);
  fs.mkdirSync(directory, { recursive: true });
}

async function appendFallbackLog(filePath, payload, errorMessage) {
  ensureDirectoryExists(filePath);
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    payload,
    errorMessage
  });

  await fs.promises.appendFile(filePath, `${line}\n`, "utf8");
}

function createLogger(options = {}) {
  const config = resolveConfig(options);
  const tokenManager = new TokenManager(config);

  return {
    async log(stack, level, packageName, message, context = {}) {
      assertAllowedValue("stack", stack, ALLOWED_STACKS);
      assertAllowedValue("level", level, ALLOWED_LEVELS);
      assertAllowedValue("package", packageName, ALLOWED_PACKAGES);

      if (!message || typeof message !== "string") {
        throw new Error("Log message must be a non-empty string");
      }

      const payload = {
        stack,
        level,
        package: packageName,
        message: context && Object.keys(context).length > 0
          ? `${message} | context=${JSON.stringify(context)}`
          : message
      };

      try {
        const accessToken = await tokenManager.getAccessToken();
        const response = await sendJson(`${config.baseUrl}/logs`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          body: payload
        });

        return response.data;
      } catch (error) {
        await appendFallbackLog(config.fallbackFilePath, payload, error.message);
        return {
          fallback: true,
          message: "Log persisted locally",
          reason: error.message
        };
      }
    }
  };
}

function createEnvironmentLogger(options = {}) {
  return createLogger(options);
}

module.exports = {
  createEnvironmentLogger,
  createLogger
};

