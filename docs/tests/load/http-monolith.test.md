## HTTP Results

Testing was performed using [autocannon](https://www.npmjs.com/package/autocannon) on the endpoint `GET /api/weather?city={city}` (3 runs, 10 connections, 10 seconds each).

- First run: `city=Kyiv`
- Second run: `city=London`
- Third run: `city=Kramatorsk`

## Environment

- CPU: Apple M1 Pro
- RAM: 32GB
- Node.js version: 20.x
- Network: Localhost, 10 connections
- OS: macOS Sequoia 15.5

| Aspect         | Run #1  | Run #2  | Run #3  | Median    |
| -------------- | ------- | ------- | ------- | --------- |
| Total Requests | 11,000  | 12,000  | 12,000  | 11,666    |
| Avg Requests/s | 1121.7  | 1223.8  | 1205.3  | 1180.6    |
| 50% Latency    | 7 ms    | 6 ms    | 7 ms    | 6.6 ms    |
| Avg Latency    | 8.42 ms | 7.67 ms | 7.79 ms | 7.96 ms   |
| Bytes/s (Avg)  | 396 kB  | 437 kB  | 425 kB  | 419 kB    |
| Total MB Read  | 3.96 MB | 4.37 MB | 4.25 MB | 4.19 MB   |
| Max Latency    | 458 ms  | 449 ms  | 376 ms  | 427.66 ms |

**Summary:**  
The endpoint consistently handles around 1,200 requests per second with an average latency of 7–8 ms for different cities.
Average response size is about 419 kB/s, with a total of approximately 4.2 MB read per test run.
