import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors_stress');

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5055';

export const options = {
  stages: [
    { duration: '1m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '2m', target: 300 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    errors_stress: ['rate<0.10'],
  },
};

export default function () {
  const cities = ['Kyiv', 'Lviv', 'Odesa', 'Kharkiv', 'Dnipro'];
  const city = cities[Math.floor(Math.random() * cities.length)];

  const res = http.get(`${BASE_URL}/api/weather?city=${city}`, {
    tags: { name: '01_GetWeather_Stress' },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 1s': (r) => r.timings.duration < 1000,
  }) || errorRate.add(1);

  sleep(0.5);
}
