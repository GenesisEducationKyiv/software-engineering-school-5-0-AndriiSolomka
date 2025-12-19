# PERFORMANCE TESTING REPORT

## GS Weather Service (Microservices Architecture)

**Test Date:** December 19, 2025  
**Test Duration:** 60 seconds (Baseline) / 180 seconds (Stress)  
**Testing Tool:** k6 (Custom JS Load Scripts)

---

## 1. INTRODUCTION

A comprehensive performance test of the **GS Weather Service** microservices system was conducted. The primary objective was to evaluate the API Gateway's capacity to handle incoming REST traffic and the efficiency of gRPC interaction between internal services under load. The testing focused on identifying bottlenecks within the Gateway and assessing the stability of asynchronous event processing via Kafka.

---

## 2. TEST CONFIGURATION

### Load Parameters:

#### Baseline Testing (50 Virtual Users):

- **Concurrent Users:** 50
- **Duration:** 60 seconds
- **Result:** 2,586 requests, 43.1 RPS, 172ms average response time.

#### Stress Testing (500 Virtual Users):

- **Concurrent Users:** 500
- **Duration:** 180 seconds
- **Target URL:** `http://localhost:3000/api`

### Test Scenarios (by weight):

- **Fetch Weather (GET /weather)** (60%): Gateway -> Weather Service (gRPC) -> Redis/External API.
- **Create Subscriptions (POST /subscribe)** (20%): Gateway -> Subscription Service (gRPC) -> Prisma/PostgreSQL.
- **Duplicate & Conflict Validation** (15%): Business logic verification at the gRPC service level.
- **Invalid Requests** (5%): Testing Validation Pipes on the Gateway.

### Infrastructure (Docker Stack):

- **REST Gateway:** NestJS API.
- **Microservices:** Weather, Subscription, Notification (gRPC nodes).
- **Backing Services:** PostgreSQL (Prisma ORM), Redis (Caching), Kafka (Event streaming).

---

## 3. TEST RESULTS

### Baseline Results (50 VU):

| Metric                   | Value | Standard | Status |
| :----------------------- | :---- | :------- | :----- |
| Total Requests           | 2,586 | -        | ✅     |
| Average Throughput (RPS) | 43.1  | > 15     | ✅     |
| Average Response Time    | 172ms | < 300ms  | ✅     |
| 95th Percentile (p95)    | 526ms | < 500ms  | ⚠️     |
| Error Rate               | 0.0%  | < 1%     | ✅     |

### Stress Test Results (500 VU):

**Note:** Significant performance degradation was observed at 500 VU. The Gateway became a critical bottleneck due to high CPU usage (85%+) while proxying gRPC requests, leading to delays in the Event Loop queue.

### Performance Dynamics (Baseline):

```text
⏱️ 05.0s | 📊 233 req  | ⚡ 46.4 RPS | 🕐 183ms avg | 📈 528ms p95 | ❌ 0 err
⏱️ 30.0s | 📊 1371 req | ⚡ 45.7 RPS | 🕐 111ms avg | 📈 198ms p95 | ❌ 0 err
⏱️ 60.0s | 📊 2586 req | ⚡ 43.1 RPS | 🕐 172ms avg | 📈 526ms p95 | ❌ 0 err
```

## 4. RESULTS ANALYSIS

### ✅ Positive Aspects:

1. gRPC Stability: Internal communication between services remains fault-tolerant even with significant increases in latency.

2. Caching Efficiency: Redis implementation in the Weather Service allows repeat requests for popular cities to be processed almost instantaneously.

3. Asynchronous Messaging: Kafka allows the Notification Service to operate independently without blocking the main execution flow in the Gateway.

### Comparison with Previous Tests:

| Metric            | Before Optimization | After gRPC Implementation | Improvement |
| :---------------- | :------------------ | :------------------------ | :---------- |
| RPS               | 12.5                | 43.1                      | +245%       |
| Avg Response Time | 650ms               | 172ms                     | -73%        |

---

## 5. TECHNICAL ANALYSIS

### Resource Utilization (Stress Test 500 VU):

- gateway-service: CPU 80-90% (primary bottleneck), RAM 180MB.
- subscription-service: CPU 35%, RAM 220MB (Prisma Engine overhead).
- weather-service: CPU 15%, RAM 110MB.
- db-postgres: CPU 20-30% during intensive write operations.

### Database Query Analysis (Prisma):

-- Slowest Operations:

1. upsert (Subscription) - ~45ms
2. findUnique (Verification Token) - ~30ms

## 6. CONCLUSIONS & RECOMMENDATIONS

### 🎯 Overall Assessment:

GATEWAY OPTIMIZATION REQUIRED. While the system demonstrates stability under moderate loads, the current Gateway architecture limits the maximum system throughput.

### Urgent Optimization Measures:

#### 1. Gateway Refactoring (Priority: CRITICAL)

Extract communication logic into a standalone libs/api-core library to decouple it from NestJS:

- Implement gRPC connection pooling to reduce connection overhead.
- Use interfaces for services instead of direct gRPC client injections.

#### 2. Database Optimization

Add composite indexes to accelerate subscription lookups and validation:
`CREATE INDEX idx_sub_email_city ON "Subscription"("email", "city");`

#### 3. Gateway-Level Caching

Implement short-term L1 Caching (In-memory) directly within the Gateway for the most requested cities. This will bypass unnecessary gRPC calls to the weather microservice and significantly reduce response times for popular locations.

