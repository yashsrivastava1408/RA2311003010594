const http = require("http");
const path = require("path");
const { createEnvironmentLogger } = require("../../logging_middleware");
const { buildAppConfig } = require("./config");
const { SchedulerController } = require("./controller/schedulerController");
const { handleError } = require("./handler/errorHandler");
const { buildRequestContext } = require("./middleware/requestContext");
const { EvaluationRepository } = require("./repository/evaluationRepository");
const { Router } = require("./route/router");
const { SchedulerService } = require("./service/schedulerService");

async function bootstrap() {
  const config = buildAppConfig();
  const logger = createEnvironmentLogger({
    cwd: path.resolve(__dirname, ".."),
    envFilePath: path.resolve(__dirname, "../.env")
  });

  const repository = new EvaluationRepository({
    baseUrl: config.evaluation.baseUrl,
    logger,
    loggingConfig: config.logging
  });
  const schedulerService = new SchedulerService({ repository, logger });
  const controller = new SchedulerController({ schedulerService, logger });
  const router = new Router({ controller, logger });

  const server = http.createServer(async (request, response) => {
    let requestContext = null;

    try {
      requestContext = await buildRequestContext(request, logger);
      await router.handle(requestContext, response);
    } catch (error) {
      await handleError(response, logger, error, requestContext || {});
    }
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(config.app.port, config.app.host, resolve);
  });

  await logger.log("backend", "info", "service", "Vehicle maintenance scheduler server started", {
    host: config.app.host,
    port: config.app.port
  });
}

bootstrap().catch(async (error) => {
  const logger = createEnvironmentLogger({
    cwd: path.resolve(__dirname, ".."),
    envFilePath: path.resolve(__dirname, "../.env")
  });

  await logger.log("backend", "fatal", "service", "Server bootstrap failed", {
    reason: error.message
  });
  process.exit(1);
});
