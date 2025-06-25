### Running Tests

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