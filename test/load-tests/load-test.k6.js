import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors_load');

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Тестові дані
const cities = ['Kyiv', 'Lviv', 'Odesa', 'Kharkiv', 'Dnipro'];
const testEmails = [
  'test1@example.com',
  'test2@example.com',
  'test3@example.com',
  'test4@example.com',
  'test5@example.com',
];

export let options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    errors_load: ['rate<0.1'],
  },
};

export default function () {
  const city = cities[Math.floor(Math.random() * cities.length)];
  const email = testEmails[Math.floor(Math.random() * testEmails.length)];

  let weatherRes = http.get(`${BASE_URL}/api/weather?city=${city}`, {
    tags: { name: '01_GetWeather' },
  });
  check(weatherRes, {
    'weather status 200': (r) => r.status === 200,
    'weather body is present': (r) => r.json() !== null,
  }) || errorRate.add(1);

  sleep(1);

  const subscribePayload = JSON.stringify({
    email: email,
    city: city,
    frequency: 1,
  });

  const subscribeRes = http.post(
    `${BASE_URL}/api/subscription`,
    subscribePayload,
    {
      tags: { name: '02_Subscribe' },
      headers: { 'Content-Type': 'application/json' },
    },
  );

  check(subscribeRes, {
    'subscribe status 201 or 409': (r) => r.status === 201 || r.status === 409,
  }) || errorRate.add(1);

  sleep(2);

  let subscriptionsRes = http.get(
    `${BASE_URL}/api/subscription/subscriptions`,
    {
      tags: { name: '03_GetSubscriptions' },
    },
  );

  check(subscriptionsRes, {
    'subscriptions status 200': (r) => r.status === 200,
    'subscriptions is array': (r) => Array.isArray(r.json()),
  }) || errorRate.add(1);

  sleep(1);
}
