const { selectOptimalTasks } = require("../domain/knapsack");

function buildDepotSnapshot(depot) {
  return {
    id: depot.id,
    mechanicHours: depot.mechanicHours
  };
}

function buildSelectionSummary(plan) {
  const idleHours = Math.max(0, plan.capacity - plan.totalDuration);
  const utilization = plan.capacity === 0
    ? 0
    : Number(((plan.totalDuration / plan.capacity) * 100).toFixed(2));

  return {
    selectedCount: plan.selected.length,
    totalDuration: plan.totalDuration,
    totalImpact: plan.totalImpact,
    capacity: plan.capacity,
    idleHours,
    utilizationPercentage: utilization
  };
}

class SchedulerService {
  constructor({ repository, logger }) {
    this.repository = repository;
    this.logger = logger;
  }

  async optimizeSchedule(depotId) {
    await this.logger.log("backend", "info", "service", "Starting schedule optimization", {
      depotId
    });

    const [depots, vehicles] = await Promise.all([
      this.repository.fetchDepots(),
      this.repository.fetchVehicles()
    ]);

    const depot = depots.find((entry) => entry.id === Number(depotId));
    if (!depot) {
      const error = new Error(`Depot ${depotId} was not found`);
      error.statusCode = 404;
      error.details = {
        availableDepotIds: depots.map((entry) => entry.id)
      };
      throw error;
    }

    const depotVehicles = vehicles.filter((vehicle) => {
      if (vehicle.depotId === null || vehicle.depotId === undefined || vehicle.depotId === "") {
        return true;
      }

      return Number(vehicle.depotId) === Number(depotId);
    });

    await this.logger.log("backend", "debug", "service", "Prepared candidate tasks for optimization", {
      depotId,
      candidateCount: depotVehicles.length,
      capacity: depot.mechanicHours
    });

    const plan = selectOptimalTasks(depotVehicles, depot.mechanicHours);

    await this.logger.log("backend", "info", "service", "Completed schedule optimization", {
      depotId,
      selectedCount: plan.selected.length,
      totalImpact: plan.totalImpact,
      totalDuration: plan.totalDuration
    });

    return {
      depot: buildDepotSnapshot(depot),
      summary: buildSelectionSummary(plan),
      selectedVehicles: plan.selected
    };
  }

  async listDepots() {
    await this.logger.log("backend", "info", "service", "Listing available depots");
    return this.repository.fetchDepots();
  }

  async listVehicles() {
    await this.logger.log("backend", "info", "service", "Listing available vehicles");
    return this.repository.fetchVehicles();
  }
}

module.exports = {
  SchedulerService
};
