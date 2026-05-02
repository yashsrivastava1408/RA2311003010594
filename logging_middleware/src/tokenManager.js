const { sendJson } = require("./httpClient");

class TokenManager {
  constructor(config) {
    this.config = config;
    this.cachedToken = null;
    this.expiresAt = 0;
  }

  hasCredentials() {
    const { email, name, rollNo, accessCode, clientID, clientSecret } = this.config.credentials;

    return Boolean(email && name && rollNo && accessCode && clientID && clientSecret);
  }

  async getAccessToken() {
    const now = Date.now();
    if (this.cachedToken && now < this.expiresAt - 30_000) {
      return this.cachedToken;
    }

    if (!this.config.baseUrl) {
      throw new Error("Missing evaluation base URL");
    }

    if (!this.hasCredentials()) {
      throw new Error("Missing evaluation credentials");
    }

    const response = await sendJson(`${this.config.baseUrl}/auth`, {
      method: "POST",
      body: this.config.credentials
    });

    const accessToken = response.data && response.data.access_token;
    const expiresIn = Number(response.data && response.data.expires_in);

    if (!accessToken) {
      throw new Error("Auth response did not include access_token");
    }

    this.cachedToken = accessToken;
    this.expiresAt = Number.isFinite(expiresIn) ? now + expiresIn * 1000 : now + 5 * 60 * 1000;

    return this.cachedToken;
  }
}

module.exports = {
  TokenManager
};

