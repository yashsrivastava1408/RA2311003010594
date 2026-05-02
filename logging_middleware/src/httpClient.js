async function sendJson(url, options = {}) {
  const response = await fetch(url, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch (error) {
      data = { raw: text };
    }
  }

  if (!response.ok) {
    const httpError = new Error(`HTTP ${response.status} ${response.statusText}`);
    httpError.status = response.status;
    httpError.payload = data;
    throw httpError;
  }

  return {
    status: response.status,
    data
  };
}

module.exports = {
  sendJson
};

