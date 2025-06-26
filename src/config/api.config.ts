import { registerAs } from '@nestjs/config';

export default registerAs('api', () => ({
  weatherApiKey: process.env.WEATHER_API_KEY!,
  weatherApiUrl: process.env.WEATHER_API_URL!,
  openMeteoApiUrl: process.env.OPEN_METEO_API_URL!,
  geocodingApiUrl: process.env.GEOCODING_API_URL!,
}));
