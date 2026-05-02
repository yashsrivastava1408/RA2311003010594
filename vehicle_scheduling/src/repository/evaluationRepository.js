const { sendJson } = require("../../../logging_middleware/src/httpClient");
const { TokenManager } = require("../../../logging_middleware/src/tokenManager");
const { normalizeDepot, normalizeVehicle } = require("../utils/normalizers");

class EvaluationRepository {
  constructor({ baseUrl, logger, loggingConfig }) {
    this.baseUrl = baseUrl;
    this.logger = logger;
    this.tokenManager = new TokenManager(loggingConfig);
  }

  async getAuthorizationHeader() {
    const accessToken = await this.tokenManager.getAccessToken();
    return {
      Authorization: `Bearer ${accessToken}`
    };
  }

  async fetchDepots() {
    await this.logger.log("backend", "info", "repository", "Fetching depots from evaluation service");
    const response = await sendJson(`${this.baseUrl}/depots`, {
      method: "GET",
      headers: await this.getAuthorizationHeader()
    });
    const depots = Array.isArray(response.data && response.data.depots) ? response.data.depots : [];
    return depots.map(normalizeDepot);
  }

  async fetchVehicles() {
    await this.logger.log("backend", "info", "repository", "Fetching vehicles from evaluation service");
    const response = await sendJson(`${this.baseUrl}/vehicles`, {
      method: "GET",
      headers: await this.getAuthorizationHeader()
    });
    const vehicles = Array.isArray(response.data && response.data.vehicles) ? response.data.vehicles : [];
    return vehicles.map(normalizeVehicle);
  }
}

module.exports = {
  EvaluationRepository
};

