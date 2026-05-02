class SchedulerController {
  constructor({ schedulerService, logger }) {
    this.schedulerService = schedulerService;
    this.logger = logger;
  }

  async optimize(requestContext) {
    const depotId = requestContext.body && requestContext.body.depotId;

    if (depotId === undefined || depotId === null || depotId === "") {
      const error = new Error("depotId is required in the request body");
      error.statusCode = 400;
      throw error;
    }

    await this.logger.log("backend", "info", "controller", "Received optimization request", {
      requestId: requestContext.requestId,
      depotId
    });

    return this.schedulerService.optimizeSchedule(depotId);
  }

  async listDepots(requestContext) {
    await this.logger.log("backend", "info", "controller", "Received depots listing request", {
      requestId: requestContext.requestId
    });
    return this.schedulerService.listDepots();
  }

  async listVehicles(requestContext) {
    await this.logger.log("backend", "info", "controller", "Received vehicles listing request", {
      requestId: requestContext.requestId
    });
    return this.schedulerService.listVehicles();
  }
}

module.exports = {
  SchedulerController
};
