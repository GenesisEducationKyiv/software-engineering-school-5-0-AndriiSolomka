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

### 2. Setup Shared Libraries

This project uses a shared libraries package (`@weather-api/shared`) for common code across microservices.

**Quick setup:**

```bash
./setup-libs.sh
```

Or manually:

```bash
cd libs
npm run build
cd ..
npm install
```

> 📚 For detailed information about the libs package, see [LIBS_MIGRATION.md](./LIBS_MIGRATION.md)

---

### 3. Environment Variables

Copy `.env.example` to `.env` and `.env.test.example` to `.env.test`:

```bash
cp .env.example .env
cp .env.test.example .env.test
```

To ensure the project runs smoothly, you need to provide the following secrets in your `.env` and `.env.test` files:

- `WEATHER_API_KEY` – Obtain your free Weather API key from [weatherapi.com](https://www.weatherapi.com/).
- `EMAIL_USER` and `EMAIL_PASSWORD` – Use your Gmail address and generate an [App Password](https://support.google.com/accounts/answer/185833) for secure email sending with Nodemailer.

---

### 4. Local Development (with Docker)

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

### 5. Running Tests

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

### 6. Manual Local Run (without Docker)

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

## Observability
---

### Alerts

#### **Critical System Alerts**
- **Service Availability:** Alert if any service (weather, email, subscription, notification) is down or `/metrics` endpoint is unavailable for more than 30 seconds.
- **High Error Rate:** Alert if error logs or error metrics (e.g., `*_operation_total{status="error"}`) exceed 5% of total operations in any service over 5 minutes.

#### **Performance Alerts**
- **API Response Time:** Alert if `/api/weather`, `/api/subscribe`, or notification publishing p95 latency exceeds 1s.
- **Email/Notification Delivery Time:** Alert if `email_send_duration_seconds` or `notification_email_publish_duration_seconds` p95 > 2s.
- **Subscription Processing Delay:** Alert if `subscription_operation_duration_seconds` p95 > 10s.
- **Database/Redis/Kafka Issues:** Alert on connection errors or high latency (from logs or metrics).

#### **Dependency Alerts**
- **PostgreSQL/Redis/Kafka Connectivity:** Alert if connection errors are logged or metrics indicate failures.
- **Kafka Consumer Lag:** Alert if notification queue lag >100 messages.
- **Redis Memory Usage:** Alert if Redis memory usage >75% of maxmemory.

#### **Log-based Alerts**
- **Error Logs:** Alert if error logs exceed N/hour in any service.
- **Warning Logs:** Alert if warning logs spike.
- **No Info/Debug Logs:** Alert if no info/debug logs for >10 minutes (may indicate service freeze).

---

### Log Retention Policy

**Retention Durations:**
- **Error Logs:** Stored for 14 days to support incident analysis and regulatory needs.
- **Warning Logs:** Kept for 14 days to enable proactive monitoring and capacity planning.
- **Info Logs:** Retained for 7 days, providing operational insights and supporting sprint reviews.
- **Debug Logs:** Held for 3 days, with log sampling enabled to reduce storage, focused on short-term troubleshooting.

**Cleanup & Archival Automation:**
- **Every day at 04:30 UTC:** Debug logs older than 3 days are deleted.
- **Each Wednesday at 01:00 UTC:** Info logs exceeding 7 days are purged.
- **On the 2nd and 16th of each month at 06:00 UTC:** Warning logs are archived to cold storage, then deleted after 14 days.
- **On the 2nd and 16th at 02:30 UTC:** Error logs are archived before removal at the 14-day mark.

**Lifecycle & Storage Strategy:**
- **Debug/Info:** Removed permanently after their retention period due to high volume and lower long-term value.
- **Warning/Error:** First archived to cold storage, then deleted after full retention, ensuring critical data is available for audits or investigations.
- **Critical Errors:** Immediately archived post-incident for compliance and forensic purposes.

**Why Cold Storage?**
- **Cost Savings:** Cold storage is up to 90% less expensive than hot storage, yet remains accessible for audits.
- **Regulatory Compliance:** Satisfies requirements for historical log retention.
- **Forensics & Legal:** Supports in-depth incident analysis and maintains a defensible audit trail.
- **Operational Analytics:** Enables long-term trend analysis for reliability and capacity planning.

**Retention Choices Explained:**
- **Short debug/info periods** keep storage lean while supporting daily ops and troubleshooting.
- **Longer warning/error retention** balances the need for incident review with storage efficiency.
- **Archival** ensures compliance and cost control.
- **Nightly/Off-peak cleanup** avoids performance impact during

---

### Metrics Implemented

All microservices expose Prometheus metrics at `/metrics`:

- **Weather:** cache hits/misses, cache size, operation durations.
- **Email:** sent emails, send errors, send durations (by type/status).
- **Subscription:** operation counts and durations (by method/status).
- **Notification:** published emails, publish errors, publish durations.


---

> Built with ❤️ using NestJS, Prisma, PostgreSQL, Redis, Docker, and deployed on Google Cloud.