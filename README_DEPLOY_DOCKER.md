Deploy with Docker (backend + frontend)

This project ships a lightweight Docker setup to run the backend (Node + SQLite) and the static frontend (nginx) together.

Files added:
- `server/Dockerfile` — builds the Node.js backend image
- `frontend/Dockerfile` — builds an nginx image that serves `coffee.html` as index
- `docker-compose.yml` — composes both services and maps ports

Quick start (Windows PowerShell):

```
docker-compose up --build -d

docker-compose ps

Open the frontend in a browser at: http://localhost:5520

docker-compose logs -f backend

docker-compose down
```

Notes:
- The backend uses `server/brewluxe.db` as the SQLite file. `docker-compose.yml` mounts that path into the container so data persists on the host.
- If `brewluxe.db` does not exist yet, start the backend once with `npm start` locally to initialize schema, or create the file with the seed script (`node server/scripts/seed-local.js`) before `docker-compose up`.
- If you want a single-container deployment, you can serve static files from the backend and skip the nginx frontend — tell me if you prefer that and I'll prepare it.
- If `brewluxe.db` does not exist yet, start the backend once with `npm start` locally to initialize schema, or create the file with the seed script (`node server/scripts/seed-local.js`) before `docker-compose up`.
- A single-container option is available: it serves `coffee.html` from the Node backend. Use the provided `Dockerfile` and `docker-compose.single.yml` to build and run everything in one container (backend + frontend).
