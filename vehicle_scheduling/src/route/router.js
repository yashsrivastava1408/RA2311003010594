const { sendJson } = require("../utils/json");

class Router {
  constructor({ controller, logger }) {
    this.controller = controller;
    this.logger = logger;
  }

  async handle(requestContext, response) {
    if (requestContext.method === "GET" && requestContext.path === "/health") {
      await this.logger.log("backend", "debug", "route", "Health endpoint invoked", {
        requestId: requestContext.requestId
      });

      return sendJson(response, 200, {
        success: true,
        data: {
          status: "ok"
        }
      });
    }

    if (requestContext.method === "GET" && requestContext.path === "/api/v1/depots") {
      await this.logger.log("backend", "info", "route", "Depots route matched", {
        requestId: requestContext.requestId
      });

      const result = await this.controller.listDepots(requestContext);
      return sendJson(response, 200, {
        success: true,
        data: result
      });
    }

    if (requestContext.method === "GET" && requestContext.path === "/api/v1/vehicles") {
      await this.logger.log("backend", "info", "route", "Vehicles route matched", {
        requestId: requestContext.requestId
      });

      const result = await this.controller.listVehicles(requestContext);
      return sendJson(response, 200, {
        success: true,
        data: result
      });
    }

    if (requestContext.method === "POST" && requestContext.path === "/api/v1/schedules/optimize") {
      await this.logger.log("backend", "info", "route", "Optimize route matched", {
        requestId: requestContext.requestId
      });

      const result = await this.controller.optimize(requestContext);
      return sendJson(response, 200, {
        success: true,
        data: result
      });
    }

    const error = new Error("Route not found");
    error.statusCode = 404;
    throw error;
  }
}

module.exports = {
  Router
};
