import http from 'k6/http';
import { check, sleep } from 'k6';

// Стрес-тест: знаходимо межі системи
export const options = {
  stages: [
    { duration: '1m', target: 100 },   // Розігрів
    { duration: '2m', target: 200 },   // Збільшення навантаження
    { duration: '2m', target: 300 },   // Пікове навантаження
    { duration: '1m', target: 0 },     // Повернення до 0
  ],
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Інтенсивні запити до API
  const cities = ['Kyiv', 'Lviv', 'Odesa', 'Kharkiv', 'Dnipro'];
  const city = cities[Math.floor(Math.random() * cities.length)];

  const res = http.get(`${BASE_URL}/api/weather?city=${city}`);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 1s': (r) => r.timings.duration < 1000,
  });

  sleep(0.5); // Мінімальна затримка між запитами
}
