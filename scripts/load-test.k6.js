import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Метрики
const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Розігрів до 50 користувачів
    { duration: '1m', target: 100 },  // Навантаження 100 користувачів
    { duration: '30s', target: 0 },   // Охолодження
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% запитів швидше 500ms
    errors: ['rate<0.1'],              // Менше 10% помилок
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Сценарій 1: Отримання погоди (найчастіший запит)
  let weatherRes = http.get(`${BASE_URL}/api/weather?city=Kyiv`);
  check(weatherRes, {
    'weather status 200': (r) => r.status === 200,
    'weather has data': (r) => r.json('temperature') !== undefined,
  }) || errorRate.add(1);
  
  sleep(1);

  // Сценарій 2: Підписка на оновлення
  const subscribePayload = JSON.stringify({
    email: `test${__VU}@example.com`,
    city: 'Kyiv',
  });

  const subscribeRes = http.post(`${BASE_URL}/api/subscription/subscribe`, subscribePayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(subscribeRes, {
    'subscribe status 200 or 201': (r) => r.status === 200 || r.status === 201,
  }) || errorRate.add(1);

  sleep(2);

  // Сценарій 3: Отримання підписок
  const subsRes = http.get(`${BASE_URL}/api/subscription/subscriptions`);
  check(subsRes, {
    'subscriptions status 200': (r) => r.status === 200,
    'subscriptions is array': (r) => Array.isArray(r.json()),
  }) || errorRate.add(1);

  sleep(1);
}
