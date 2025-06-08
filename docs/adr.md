# ADR-001: Choosing Node.js as the Main Platform

**Status:** Accepted  
**Date:** 2025-06-08  
**Author:** Andrii Solomka

---

## Context

We needed to choose a platform for developing the backend of the weather subscription service. Node.js, Go, and PHP were considered.

---

## Considered Options

1. **Node.js**  
   - **Pros:**  
     - High performance for I/O-bound tasks  
     - Large npm ecosystem  
     - Convenient for REST API development  
     - Active community, modern stack
   - **Cons:**  
     - Single-threaded, requires additional solutions for CPU-bound tasks

2. **Go**  
   - **Pros:**  
     - High performance, easy deployment  
   - **Cons:**  
     - Fewer libraries for web/API  
     - Higher onboarding cost for the team

3. **PHP**  
   - **Pros:**  
     - Easy hosting, large developer pool  
   - **Cons:**  
     - Outdated stack for modern APIs  
     - Fewer options for asynchronous processing

---

## Decision

**Node.js** was chosen as the main backend platform.

---

## Consequences

**Positive:**  
- Fast development with a modern stack
- Easy scaling and integration with other services  
- Many ready-to-use libraries for integrations and testing

**Negative:**  
- Single-threaded, requires extra solutions for CPU-bound tasks

---

# ADR-002: Choosing NestJS as the Main Framework

**Status:** Accepted  
**Date:** 2025-06-08  
**Author:** Andrii Solomka

---

## Context

To develop the backend of the weather subscription service on Node.js, we needed to choose a framework. Key requirements: modularity, scalability, TypeScript support, convenient testing, active community. NestJS, Express, and Fastify were considered. An important factor is that the team has significant experience with NestJS, enabling a fast project start and high code quality.

---

## Considered Options

1. **NestJS**  
   - **Pros:**  
     - Angular-like architecture (familiar to many developers)  
     - Built-in support for modularity, DI, middleware, pipes, guards  
     - Seamless TypeScript integration  
     - Active community, many ready modules  
     - Team has strong experience with NestJS  
     - Easy integration with modern testing tools (Jest)  
   - **Cons:**  
     - Larger framework size, steeper learning curve for newcomers

2. **Express**  
   - **Pros:**  
     - Minimalistic, easy to use  
     - Huge ecosystem  
   - **Cons:**  
     - No structured architecture out of the box  
     - Need to implement DI, validation, and project structure manually  
     - Less suitable for large team projects

3. **Fastify**  
   - **Pros:**  
     - Higher performance compared to Express  
     - Built-in schema validation  
   - **Cons:**  
     - Fewer middleware and modules  
     - Less clear architecture for large projects  
     - Less team experience

---

## Decision

**NestJS** was chosen as the main backend framework, as the team has the most experience with it, enabling a fast start, effective support, and project scalability.

---

## Consequences

**Positive:**  
- Fast project start thanks to team experience with NestJS  
- High code quality and modern best practices  
- Easy project scaling  
- Seamless integration with TypeScript and Jest  
- Strong community support

**Negative:**  
- Larger framework size  
- Steeper learning curve for newcomers

---

# ADR-003: Choosing PostgreSQL as the Main Database

**Status:** Accepted  
**Date:** 2025-06-08  
**Author:** Andrii Solomka

---

## Context

We needed to choose a database for storing users, subscriptions, notification history, and weather cache. PostgreSQL, MongoDB, and SQLite were considered.

---

## Considered Options

1. **PostgreSQL**  
   - **Pros:**  
     - ACID transactions, reliability  
     - Powerful query capabilities  
     - Ready for production workloads  
   - **Cons:**  
     - More complex setup compared to SQLite

2. **MongoDB**  
   - **Pros:**  
     - Flexible schema, easy JSON handling  
   - **Cons:**  
     - Eventual consistency, more complex migrations

3. **SQLite**  
   - **Pros:**  
     - Simple setup  
   - **Cons:**  
     - Not suitable for production and multi-user scenarios

---

## Decision

**PostgreSQL** was chosen as the main database.

---

## Consequences

**Positive:**  
- Data reliability and consistency  
- Powerful query capabilities  
- JSON support for weather_data  
- Ready for production workloads

**Negative:**  
- More complex Docker setup  
- Need for a migration system

---

# ADR-004: Choosing Redis for Weather Data Caching

**Status:** Accepted  
**Date:** 2025-06-08  
**Author:** Andrii Solomka

---

## Context

We needed to quickly cache weather data to reduce load on external APIs and speed up user responses.

---

## Considered Options

1. **Redis**  
   - **Pros:**  
     - Very fast in-memory cache  
     - TTL support, easy integration  
     - Pub/sub support for future extensions  
   - **Cons:**  
     - Requires a separate service

2. **Caching in PostgreSQL**  
   - **Pros:**  
     - No need for a separate service  
   - **Cons:**  
     - Slower, adds load to the main DB

3. **In-app memory cache**  
   - **Pros:**  
     - Simple  
   - **Cons:**  
     - Not suitable for scaling, cache lost on restart

---

## Decision

**Redis** was chosen for weather data caching.

---

## Consequences

**Positive:**  
- Reduced latency for weather data retrieval  
- Lower load on external APIs  
- Ready for horizontal scaling

**Negative:**  
- Requires a separate service  
- Additional infrastructure costs

---

# ADR-005: Choosing Google Cloud Platform for Deployment

**Status:** Accepted  
**Date:** 2025-06-08  
**Author:** Andrii Solomka

---

## Context

We needed to choose a cloud platform for deploying the service, considering CI/CD, security, scalability, and integration with other services.

---

## Considered Options

1. **Google Cloud Platform**  
   - **Pros:**  
     - Easy integration with Docker, Kubernetes  
     - Powerful managed services (Cloud SQL, Memorystore, Pub/Sub)  
     - Flexible IAM system, simple CI/CD  
   - **Cons:**  
     - Cost

2. **AWS**  
   - **Pros:**  
     - Largest selection of services  
   - **Cons:**  
     - More complex configuration

3. **Azure**  
   - **Pros:**  
     - Integration with Microsoft ecosystem  
   - **Cons:**  
     - Less team experience

---

## Decision

**Google Cloud Platform** was chosen for deployment and hosting.

---

## Consequences

**Positive:**  
- Easy scaling and CI/CD  
- Integration with managed PostgreSQL and Redis  
- Ready for production workloads

**Negative:**  
- Cost
- Vendor lock-in risk (migration to another cloud provider may be complex and expensive)
---