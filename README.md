# Backend Track Submission

This repository contains the backend-track submission for roll number `RA2311003010594`.

## Structure

- `logging_middleware/`: reusable logging package that authenticates with the evaluation service and publishes structured logs
- `vehicle_scheduling/`: vehicle scheduling microservice that fetches depots and vehicles, computes an optimal maintenance plan, and exposes API endpoints

## Vehicle Scheduling Endpoints

- `GET /health`
- `GET /api/v1/depots`
- `GET /api/v1/vehicles`
- `POST /api/v1/schedules/optimize`

## Screenshots

All API output screenshots are located in `vehicle_scheduling/screenshots/`.

## Security

- Local `.env` files are intentionally excluded from version control.
- `.env.example` files are included as templates for configuration.
