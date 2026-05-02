const { randomUUID } = require("crypto");
const { parseJsonBody } = require("../utils/http");

async function buildRequestContext(request, logger) {
  const requestId = randomUUID();
  const url = new URL(request.url, "http://localhost");

  let body = {};
  if (request.method !== "GET" && request.method !== "HEAD") {
    body = await parseJsonBody(request);
  }

  await logger.log("backend", "info", "middleware", "Request accepted", {
    requestId,
    method: request.method,
    path: url.pathname
  });

  return {
    requestId,
    method: request.method,
    path: url.pathname,
    body
  };
}

module.exports = {
  buildRequestContext
};

