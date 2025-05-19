# ☀️ Weather API Application

A robust, production-ready NestJS backend with a minimalistic frontend for weather data and subscription management.  
**Get real-time weather, subscribe for updates, and manage your notifications with ease!**

---

## ✨ Features

- **Production-ready deployment:** Backend API is served to the public via an Nginx reverse proxy on Google Cloud
- **REST API** for weather and subscription management
- **Swagger/OpenAPI** documentation ([`/api/docs`](http://35.207.129.35:3000/api/docs))
- **Email notifications** for weather updates
- **Subscription confirmation** and unsubscribe via email token
- **⏳ Auto-cleanup:** Unconfirmed subscriptions are deleted after 5 minutes
- **PostgreSQL** and **Redis** support (via Docker)
- **Prisma ORM** for type-safe DB access
- **Comprehensive testing:** unit, integration, e2e (with Docker Compose)
- **Frontend:** simple HTML/JS client in `/public` ([Live Demo](https://35.207.129.35))
- **CI/CD:** ready for GitHub Actions

---

## 🌐 Live API on Google Cloud

The backend API is deployed on **Google Cloud** and available at:

```
http://35.207.129.35:3000/api
```

You can use this endpoint for all API requests from your frontend or API client.

> ⚠️ **Warning:**  
> If you use the solution deployed on my server, please note that I did **not purchase a domain**—SSL certificates are bound directly to the IP address.  
> Because of this, clicking links may not always work in your browser; you may need to **copy the link and open it in a new tab** for proper access.

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/AndriiSolomka/Weather_API_Application.git
cd Weather_API_Application
```

---

### 2. Environment Variables

Copy `.env.example` to `.env` and `.env.test.example` to `.env.test`:

```bash
cp .env.example .env
cp .env.test.example .env.test
```

To ensure the project runs smoothly, you need to provide the following secrets in your `.env` and `.env.test` files:

- `WEATHER_API_KEY` – Obtain your free Weather API key from [weatherapi.com](https://www.weatherapi.com/).
- `EMAIL_USER` and `EMAIL_PASSWORD` – Use your Gmail address and generate an [App Password](https://support.google.com/accounts/answer/185833) for secure email sending with Nodemailer.

Be sure to fill in all required variables for database, Redis, and any other integrations as described in the `.env.example` file.

Edit values as needed (Postgres, Redis, email, API keys).

---

### 3. Local Development (with Docker)

**Build and start all services:**

```bash
docker compose -f docker-compose.dev.yml up --build
```

- Backend: [http://localhost:3000](http://localhost:3000)
- Swagger: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- Frontend: serve `/public` via a static server or use https://35.207.129.35

**Stop and remove containers:**

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

## 📚 API Documentation

- **Swagger UI:** [http://35.207.129.35:3000/api/docs](http://35.207.129.35:3000/api/docs)
### Main Endpoints

| Method | Endpoint                | Description                                 |
|--------|-------------------------|---------------------------------------------|
| GET    | `/api/weather`          | Get current weather for a city              |
| POST   | `/api/subscribe`        | Subscribe to weather updates                |
| GET    | `/api/confirm/{token}`  | Confirm email subscription                  |
| GET    | `/api/unsubscribe/{token}` | Unsubscribe from weather updates         |

#### Example: `/api/weather?city=London`

```json
{
  "temperature": 18.5,
  "humidity": 60,
  "description": "Partly cloudy"
}
```

#### Example: `/api/subscribe` (form data)

- `email`: user@example.com
- `city`: London
- `frequency`: hourly | daily

---

## 🛠️ Notable Features

- **⏳ Auto-cleanup:** Unconfirmed subscriptions are deleted after 5 minutes if not confirmed.
- **🔒 Secure:** All sensitive configs via `.env` files and GitHub Secrets.
- **♻️ Clean architecture:** Domain-driven structure, clear separation of API/core logic.
- **🧪 Full test coverage:** Unit, integration, and e2e tests, all isolated in Docker.
- **📦 Easy CI/CD:** GitHub Actions workflow for linting and all test stages.

---

## 🤖 CI/CD

- **Workflow:** `.github/workflows/ci.yml`
- **Stages:** Lint, unit, integration, e2e tests (all in Docker)
- **Secrets:** All test envs via GitHub Secrets

---

## 👤 Author

- [`Andrii Solomka`](https://github.com/AndriiSolomka)

---

> Built with ❤️ using NestJS, Prisma, PostgreSQL, Redis, Docker, and deployed on Google Cloud.