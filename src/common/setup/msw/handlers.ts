import { http } from 'msw';

export const createWeatherHandlers = (apiUrl: string) => {
  return [
    http.get(`${apiUrl}/search.json`, ({ request }) => {
      const url = new URL(request.url);
      const city = url.searchParams.get('q');

      const validCities = ['Kyiv', 'Lviv', 'Odesa', 'Kharkiv', 'Dnipro'];

      if (!city || !validCities.includes(city)) {
        return new Response(JSON.stringify([]), { status: 200 });
      }

      return Response.json([
        {
          id: 12345,
          name: city,
          region: 'Some Region',
          country: 'Ukraine',
          lat: 50.45,
          lon: 30.52,
        },
      ]);
    }),

    http.get(`${apiUrl}/current.json`, ({ request }) => {
      const url = new URL(request.url);
      const city = url.searchParams.get('q');

      const validCities = ['Kyiv', 'Lviv', 'Odesa', 'Kharkiv', 'Dnipro'];

      if (!city || !validCities.includes(city)) {
        return new Response(
          JSON.stringify({ error: { message: 'City not found' } }),
          { status: 404 },
        );
      }

      return Response.json({
        location: {
          name: city,
          region: 'Some Region',
          country: 'Ukraine',
          lat: 50.45,
          lon: 30.52,
          localtime: '2023-05-17 15:00',
        },
        current: {
          temp_c: 22,
          condition: {
            text: 'Sunny',
            icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
          },
          humidity: 65,
          wind_kph: 12,
        },
      });
    }),
  ];
};
