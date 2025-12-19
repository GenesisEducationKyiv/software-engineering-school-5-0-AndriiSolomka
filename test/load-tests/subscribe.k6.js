import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 100,
  duration: '10s',
};

export default function () {
  const url = 'http://host.docker.internal:3000/api/weather?city=Kyiv';

  const res = http.get(url);

  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(0.1);
}
