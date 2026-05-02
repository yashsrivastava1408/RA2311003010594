async function parseJsonBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  const body = Buffer.concat(chunks).toString("utf8");

  try {
    return JSON.parse(body);
  } catch (error) {
    const parseError = new Error("Request body must be valid JSON");
    parseError.statusCode = 400;
    throw parseError;
  }
}

module.exports = {
  parseJsonBody
};
