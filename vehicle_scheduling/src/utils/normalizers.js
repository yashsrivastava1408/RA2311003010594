function coerceNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeDepot(rawDepot) {
  return {
    id: coerceNumber(rawDepot.ID ?? rawDepot.id),
    mechanicHours: coerceNumber(rawDepot.MechanicHours ?? rawDepot.mechanicHours)
  };
}

function normalizeVehicle(rawVehicle, index) {
  return {
    taskId: String(rawVehicle.TaskID ?? rawVehicle.taskId ?? `task-${index}`),
    duration: coerceNumber(rawVehicle.Duration ?? rawVehicle.duration),
    impact: coerceNumber(rawVehicle.Impact ?? rawVehicle.impact),
    depotId: rawVehicle.DepotID ?? rawVehicle.depotId ?? rawVehicle.depotID ?? null
  };
}

module.exports = {
  normalizeDepot,
  normalizeVehicle
};

