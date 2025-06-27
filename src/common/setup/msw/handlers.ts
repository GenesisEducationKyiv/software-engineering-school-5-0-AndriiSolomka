import { http, HttpResponse, JsonBodyType } from 'msw';

export const weatherApi = {
  mock: (fn: (city: string | null) => HttpResponse<JsonBodyType>) => {
    return http.get(
      'http://api.weatherapi.com/v1/current.json',
      ({ request }) => {
        const url = new URL(request.url);
        const city = url.searchParams.get('q');
        return fn(city);
      },
    );
  },
  ok: () =>
    weatherApi.mock((city) =>
      HttpResponse.json({
        location: { name: city },
        current: { temp_c: 20, humidity: 50, condition: { text: 'Sunny' } },
      }),
    ),
  notFound: () =>
    weatherApi.mock(() =>
      HttpResponse.json(
        {
          error: {
            code: 1006,
            message: 'No matching location found.',
          },
        },
        { status: 400 },
      ),
    ),
};

export const searchApi = {
  mock: (fn: (city: string | null) => HttpResponse<JsonBodyType>) => {
    return http.get(
      'https://geocoding-api.open-meteo.com/v1/search',
      ({ request }) => {
        const url = new URL(request.url);
        const city = url.searchParams.get('name');
        return fn(city);
      },
    );
  },
  ok: () =>
    searchApi.mock((city) =>
      HttpResponse.json({
        results: [
          {
            name: city,
            latitude: 50.45,
            longitude: 30.52,
          },
        ],
      }),
    ),

  notFound: () =>
    searchApi.mock(() =>
      HttpResponse.json(
        { results: [], generationtime_ms: 0.5 },
        { status: 200 },
      ),
    ),
};
