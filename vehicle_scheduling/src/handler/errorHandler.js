const { sendJson } = require("../utils/json");

async function handleError(response, logger, error, requestContext = {}) {
  const statusCode = error.statusCode || 500;

  await logger.log("backend", statusCode >= 500 ? "error" : "warn", "handler", error.message, {
    requestId: requestContext.requestId || null,
    path: requestContext.path || null,
    statusCode
  });

  sendJson(response, statusCode, {
    success: false,
    error: {
      message: error.message,
      details: error.details || null
    }
  });
}

module.exports = {
  handleError
};
