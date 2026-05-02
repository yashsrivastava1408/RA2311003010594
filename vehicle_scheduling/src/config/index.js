const path = require("path");
const { parseEnvFile, resolveConfig } = require("../../../logging_middleware/src/config");

function buildAppConfig() {
  const projectRoot = path.resolve(__dirname, "../..");
  const envFilePath = path.join(projectRoot, ".env");
  const envFileValues = parseEnvFile(envFilePath);
  const sharedConfig = resolveConfig({
    cwd: projectRoot,
    envFilePath
  });
  const merged = {
    ...envFileValues,
    ...process.env
  };

  return {
    app: {
      host: merged.APP_HOST || "0.0.0.0",
      port: Number(merged.APP_PORT || 3000)
    },
    evaluation: {
      baseUrl: sharedConfig.baseUrl
    },
    logging: sharedConfig
  };
}

module.exports = {
  buildAppConfig
};
