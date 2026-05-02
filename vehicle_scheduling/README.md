# Vehicle Scheduling

Backend API that:

- fetches depot and vehicle data from the evaluation service
- computes the highest-impact subset of maintenance tasks within a depot's mechanic-hour budget
- uses the shared logging middleware across route, controller, service, repository, handler, and utils layers
- applies a deterministic planning strategy that prefers higher impact, then lower hour usage, then fewer tasks when plans tie

## Submission Assets

- API screenshots are stored in `screenshots/`
- Runtime credentials are intentionally excluded from the repository

## Architecture

- `src/route`: route matching
- `src/controller`: request validation and orchestration
- `src/service`: business workflow
- `src/domain`: optimization algorithm
- `src/repository`: evaluation API integration
- `src/middleware`: request context creation
- `src/handler`: central error handling
- `src/utils`: JSON, request parsing, and normalization helpers

## Endpoints

- `GET /health`
- `GET /api/v1/depots`
- `GET /api/v1/vehicles`
- `POST /api/v1/schedules/optimize`

### Request body

```json
{
  "depotId": 2
}
```

### Response shape

```json
{
  "success": true,
  "data": {
    "depot": {
      "id": 1,
      "mechanicHours": 60
    },
    "summary": {
      "selectedCount": 0,
      "totalDuration": 0,
      "totalImpact": 0,
      "capacity": 60,
      "idleHours": 60,
      "utilizationPercentage": 0
    },
    "selectedVehicles": []
  }
}
```

## Run

1. Copy `.env.example` to `.env`.
2. Fill in your evaluation credentials.
3. Run `node src/server.js`.

## Example requests

```bash
curl --request GET http://127.0.0.1:3000/health
```

```bash
curl --request GET http://127.0.0.1:3000/api/v1/depots
```

```bash
curl --request GET http://127.0.0.1:3000/api/v1/vehicles
```

```bash
curl --request POST http://127.0.0.1:3000/api/v1/schedules/optimize \
  --header 'Content-Type: application/json' \
  --data '{"depotId":2}'
```

## Notes

- The optimization uses dynamic programming to maximize impact within the mechanic-hour constraint.
- If the vehicles API includes a depot identifier, the service filters by `depotId`.
- If the vehicles API does not include a depot identifier, the service optimizes the full vehicle list against the selected depot's capacity.
- Depot availability can vary by evaluation account, so call `GET /api/v1/depots` before running the optimization request.

## Screenshots

- `screenshots/health.png`
- `screenshots/depots.png`
- `screenshots/vehicles.png`
- `screenshots/optimize-success.png`
- `screenshots/optimize-error.png`
