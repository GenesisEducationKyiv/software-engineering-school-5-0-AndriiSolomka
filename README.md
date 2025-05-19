# Weather API Application

A full-featured NestJS backend with a minimalistic frontend for weather data and subscription management.  
Users can get current weather for any city and subscribe to email updates.  
Includes robust testing (unit, integration, e2e) and Docker-based local development.

---

## Features

- **REST API** for weather and subscription management
- **Swagger/OpenAPI** documentation (`/api/docs`)
- **Email notifications** for weather updates
- **Subscription confirmation** and unsubscribe via email token
- **PostgreSQL** and **Redis** support
- **Prisma ORM**
- **Comprehensive testing**: unit, integration, e2e (with Docker Compose)
- **Frontend**: simple HTML/JS client in `/public`
- **CI/CD**: ready for GitHub Actions

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Weather_API_Application.git
cd Weather_API_Application
```

---

### 2. Environment Variables

Copy `.env.example` to `.env` and `.env.test` for local/dev and test environments:

```bash
cp .env.example .env
cp .env.example .env.test
```

Edit values as needed (Postgres, Redis, email, API keys).

---

### 3. Local Development (with Docker)

#### Build and start all services:

```bash
docker compose -f docker-compose.dev.yml up --build
```

- Backend: [http://localhost:3000](http://localhost:3000)
- Swagger: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- Frontend: open `public/index.html`

#### Stop and remove containers:

```bash
docker compose -f docker-compose.dev.yml down -v
```

---

### 4. Running Tests

All tests run in isolation via Docker Compose.

#### Unit tests

```bash
docker compose -f docker-compose.test.yml up --build test-unit
```

#### Integration tests

```bash
docker compose -f docker-compose.test.yml up --build test-integration
```

#### E2E tests

```bash
docker compose -f docker-compose.test.yml up --build test-e2e
```

#### Clean up after tests

```bash
docker compose -f docker-compose.test.yml down -v
```

---

### 5. Manual Local Run (without Docker)

#### Install dependencies

```bash
npm install
```

#### Start PostgreSQL and Redis (locally or via Docker)

#### Run migrations

```bash
npx prisma migrate deploy --schema ./prisma/schema.prisma
```

#### Start the app

```bash
npm run start:dev
```

---

### 6. API Documentation

- Swagger UI: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
---

## CI/CD

- GitHub Actions workflow: `.github/workflows/ci.yml`
- Runs lint, unit, integration, and e2e tests in Docker
- Uses secrets for test environment variables



