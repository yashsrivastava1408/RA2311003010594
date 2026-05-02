# Logging Middleware

Reusable Node.js logging package for backend services in this repository.

## Supported values

- `stack`: `backend`, `frontend`
- `level`: `debug`, `info`, `warn`, `error`, `fatal`
- `package`: `cache`, `controller`, `cron_job`, `db`, `domain`, `handler`, `repository`, `route`, `service`, `auth`, `config`, `middleware`, `utils`

## Contract

The exported logger exposes a `log(stack, level, packageName, message, context)` function that:

- validates `stack`, `level`, and `packageName`
- obtains and caches an authorization token
- sends logs to the evaluation log API
- falls back to a local file when the remote call fails

## Usage

```js
const { createEnvironmentLogger } = require("../logging_middleware");

const logger = createEnvironmentLogger({
  envFilePath: "/absolute/path/to/.env"
});

await logger.log("backend", "info", "service", "Scheduler booted", {
  route: "/api/v1/schedules/optimize"
});
```

## Environment

Copy `.env.example` to `.env` and provide your credentials from the evaluation portal.
