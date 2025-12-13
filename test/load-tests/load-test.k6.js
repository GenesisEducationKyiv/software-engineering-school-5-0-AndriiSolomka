import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors_load');

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5055';

const userData = new SharedArray('users', function () {
  return JSON.parse(open('./scripts/subscribe.k6.js')).emails;
});

export let options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    errors_load: ['rate<0.01'],
  },
};

export default function () {
  const user = userData[Math.floor(Math.random() * userData.length)];
  const email = user.email;
  const city = user.city;

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