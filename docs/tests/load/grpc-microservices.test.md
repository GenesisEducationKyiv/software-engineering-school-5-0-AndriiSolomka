## GRPC Results

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
| Total Requests | 24,000  | 25,000  | 24,000  | 24,333    |
| Avg Requests/s | 2440.7  | 2482.8  | 2445.3  | 2836.6    |
| 50% Latency    | 3 ms    | 3 ms    | 3 ms    | 3 ms      |
| Avg Latency    | 3.6 ms  | 3.61 ms | 3.62 ms | 3.6 ms    |
| Bytes/s (Avg)  | 861 kB  | 876 kB  | 863 kB  | 866 kB    |
| Total MB Read  | 8.61 MB | 8.76 MB | 8.63 MB | 8.66 MB   |
| Max Latency    | 344 ms  | 502 ms  | 449 ms  | 431.66 ms |

**Summary:**  
The endpoint consistently handles over 2,400 requests per second with a very low average latency of around 3.6 ms for different cities.  
There is no significant difference between cities, and the average response size is about 866 kB/s, with a total of approximately 8.7 MB read per test run.
