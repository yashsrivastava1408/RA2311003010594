function buildEmptyPlan(capacity) {
  return {
    totalImpact: 0,
    totalDuration: 0,
    selected: [],
    capacity
  };
}

function isCandidateBetter(currentPlan, candidatePlan) {
  if (candidatePlan.totalImpact !== currentPlan.totalImpact) {
    return candidatePlan.totalImpact > currentPlan.totalImpact;
  }

  if (candidatePlan.totalDuration !== currentPlan.totalDuration) {
    return candidatePlan.totalDuration < currentPlan.totalDuration;
  }

  return candidatePlan.selected.length < currentPlan.selected.length;
}

function selectOptimalTasks(tasks, capacity) {
  const safeCapacity = Math.max(0, Number(capacity) || 0);
  const bestPlanByHour = Array.from({ length: safeCapacity + 1 }, () => buildEmptyPlan(safeCapacity));

  for (const task of tasks) {
    for (let hours = safeCapacity; hours >= task.duration; hours -= 1) {
      const basePlan = bestPlanByHour[hours - task.duration];
      const candidatePlan = {
        totalImpact: basePlan.totalImpact + task.impact,
        totalDuration: basePlan.totalDuration + task.duration,
        selected: [...basePlan.selected, task],
        capacity: safeCapacity
      };

      if (isCandidateBetter(bestPlanByHour[hours], candidatePlan)) {
        bestPlanByHour[hours] = candidatePlan;
      }
    }
  }

  let bestOverallPlan = buildEmptyPlan(safeCapacity);

  for (const plan of bestPlanByHour) {
    if (isCandidateBetter(bestOverallPlan, plan)) {
      bestOverallPlan = plan;
    }
  }

  return bestOverallPlan;
}

module.exports = {
  selectOptimalTasks
};
