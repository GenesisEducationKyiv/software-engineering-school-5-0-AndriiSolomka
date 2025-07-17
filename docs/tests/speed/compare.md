# Protocol Comparison Report: HTTP Monolith vs. gRPC Microservices

This report compares the performance of HTTP (monolithic architecture) and gRPC (microservices architecture) protocols on the high-traffic endpoint `GET /api/weather?city={city}`.

## Test Configuration

- **Tool:** [autocannon](https://www.npmjs.com/package/autocannon)
- **Runs:** 3 per protocol, 10 connections, 10 seconds each
- **Cities tested:** Kyiv, London, Kramatorsk

## Environment

- CPU: Apple M1 Pro
- RAM: 32GB
- Node.js version: 20.x
- Network: Localhost, 10 connections
- OS: macOS Sequoia 15.5

## Results Summary

| Aspect         | HTTP Median | gRPC Median | Difference         |
|----------------|-------------|-------------|--------------------|
| Total Requests | 11,666      | 24,333      | +108% (gRPC)       |
| Avg Requests/s | 1,180.6     | 2,836.6     | +140% (gRPC)       |
| 50% Latency    | 6.6 ms      | 3 ms        | -55% (gRPC lower)  |
| Avg Latency    | 7.96 ms     | 3.6 ms      | -55% (gRPC lower)  |
| Bytes/s (Avg)  | 419 kB      | 866 kB      | +106% (gRPC)       |
| Total MB Read  | 4.19 MB     | 8.66 MB     | +107% (gRPC)       |
| Max Latency    | 427.66 ms   | 431.66 ms   | ≈ Equal            |

## Detailed Results

### HTTP Monolith

- Handles ~1,200 requests/sec with average latency 7–8 ms.
- Average response size: 419 kB/s, ~4.2 MB per run.
- Max latency occasionally spikes to 400+ ms.
- [See full HTTP results](./http-monolith.test.md)

### gRPC Microservices

- Handles over 2,400 requests/sec with average latency ~3.6 ms.
- Average response size: 866 kB/s, ~8.7 MB per run.
- Max latency also spikes to 400–500 ms, but average is much lower.
- [See full gRPC results](./grpc-microservices.test.md)

## Conclusion

The transition from a modular monolith using HTTP to a microservices architecture using gRPC resulted in a **significant performance improvement**:

-  **Total number of processed requests** increased by more than **2x** (+108%).
-  **Average requests per second** increased by **140%**.
-  **Latency** was reduced by **50%**, both in median and average (−55%).
-  **Data throughput** doubled, and gRPC handled the increased load efficiently.

---
Therefore, the solution based on **gRPC and microservices architecture performs significantly faster and more efficiently** under high load compared to the HTTP-based modular monolith.  
